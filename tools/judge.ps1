<#
  judge.ps1 — one panel member scores the judged sub-scores (moat 5 x 0-20, AI opportunity 5 x 0-20)
  for one sector batch. The page averages all panel members (weights in ai-accounts.json "judges").

  Usage:
    powershell -NoProfile -ExecutionPolicy Bypass -File tools\judge.ps1 -Sector semi -Judge claude
    powershell -NoProfile -ExecutionPolicy Bypass -File tools\judge.ps1 -Sector semi -Judge codex -Ticker NVDA,AMD   (re-score only these; merged)
  Writes data\judge\<sector>-<judge>.json and rebuilds judgments.js. Normally run through tools\update.ps1 (part "judge").
#>
param([Parameter(Mandatory = $true)][string]$Sector, [Parameter(Mandatory = $true)][string]$Judge, [string[]]$Ticker)
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'common.ps1')
$key = "J-$Sector-$Judge"
try {
  $cfg = @(Get-Judges | Where-Object { $_.profile -eq $Judge })[0]
  if (-not $cfg) { throw "No judge '$Judge' in the panel (ai-accounts.json judges)." }
  $lens = Get-LensMap
  # GetEnumerator, not .Keys: a ticker named KEYS would shadow the .Keys property of the table.
  $tick = @($lens.GetEnumerator() | Where-Object { $_.Value -eq $Sector } | ForEach-Object { $_.Key } | Sort-Object)
  $only = @($Ticker | ForEach-Object { $_ -split '[,\s]+' } | Where-Object { $_ } | ForEach-Object { $_.ToUpper() })
  if ($only.Count) { $tick = @($tick | Where-Object { $only -contains $_ }) }
  if (-not $tick.Count) { throw "No stocks in sector '$Sector'." }
  Write-JobStatus $key 'running' "$Judge $($cfg.model) is scoring moat and AI opportunity for $($tick.Count) $Sector stocks"

  # Facts per stock: business, moat thesis, and 4 fiscal years + TTM of revenue / operating income (USD).
  $fund = $null; $ff = Join-Path $DataDir 'fundamentals.json'
  if (Test-Path $ff) { try { $fund = ([IO.File]::ReadAllText($ff, $Utf8) | ConvertFrom-Json).stocks } catch {} }
  $b = { param($v) if ($null -eq $v) { '-' } else { '{0:N1}' -f ($v / 1e9) } }
  $facts = foreach ($t in $tick) {
    $c = Get-Company $t; $f = if ($fund) { $fund.$t } else { $null }
    $hist = if ($f -and $f.ser) { "years $($f.ser.t -join ', ') | revenue USD B: $(($f.ser.rev | ForEach-Object { & $b $_ }) -join ', ') | operating income USD B: $(($f.ser.oi | ForEach-Object { & $b $_ }) -join ', ')" } else { 'no figures' }
    "- $t | $($c.name) ($($c.tv))`n  business: $($c.does)`n  moat thesis on the page: $($c.moat)$(if ($c.mix) { "`n  revenue mix (estimate): $($c.mix)" })`n  $hist"
  }
  $prompt = [IO.File]::ReadAllText((Join-Path $AiRoot 'ai\judge-prompt.md'), $Utf8) + "`n`nSECTOR: $Sector`nTODAY: $((Get-Date).ToString('yyyy-MM-dd'))`n`nCOMPANIES`n" + ($facts -join "`n")
  $res = Invoke-AI -Task judge -Prompt $prompt -SchemaPath (Join-Path $AiRoot 'ai\judge-schema.json') -Account $cfg.profile -Model $cfg.model -Effort $cfg.effort
  $rows = @($res.structured.stocks)
  if (-not $rows.Count) { throw 'The AI answered, but not in the expected scoring format.' }

  $clamp = { param($a) @(0..4 | ForEach-Object { $v = if ($a -and $_ -lt @($a).Count) { [int]@($a)[$_] } else { $null }; if ($null -eq $v) { $null } else { [math]::Max(0, [math]::Min(20, $v)) } }) }
  $file = Join-Path $DataDir "judge\$Sector-$Judge.json"
  if (-not (Test-Path (Split-Path $file))) { New-Item -ItemType Directory -Force (Split-Path $file) | Out-Null }
  $stocks = [ordered]@{}
  if ($only.Count -and (Test-Path $file)) { try { ([IO.File]::ReadAllText($file, $Utf8) | ConvertFrom-Json).stocks.PSObject.Properties | ForEach-Object { $stocks[$_.Name] = $_.Value } } catch {} }
  $got = 0
  foreach ($r in $rows) {
    $t = ([string]$r.ticker).ToUpper(); if ($tick -notcontains $t) { continue }
    $m = & $clamp $r.moat; $o = & $clamp $r.opp
    if (@($m + $o | Where-Object { $null -eq $_ }).Count) { continue }   # need all 10 sub-scores
    $stocks[$t] = [ordered]@{ m = $m; o = $o; why_en = [string]$r.why_en; why_th = [string]$r.why_th }; $got++
  }
  if (-not $got) { throw 'No complete scores in the answer.' }
  $out = [ordered]@{ sector = $Sector; judge = $Judge; provider = $res.provider; model = $(if ($res.model) { $res.model } else { $res.provider }); effort = $cfg.effort
    account = $res.account; generatedAt = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ'); costUsd = $res.costUsd; stocks = $stocks }
  [IO.File]::WriteAllText($file, ($out | ConvertTo-Json -Depth 6), $Utf8)
  & (Join-Path $PSScriptRoot 'build-analysis.ps1')
  $miss = @($tick | Where-Object { -not $stocks.Contains($_) })
  Write-JobStatus $key 'done' "$got scored$(if ($miss.Count) { "; missing: $($miss -join ', ')" })"
  Write-Host "[$key] $got of $($tick.Count) scored."
} catch {
  Write-JobStatus $key 'error' $_.Exception.Message
  Write-Warning "[$key] $($_.Exception.Message)"; exit 1
}
