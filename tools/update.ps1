<#
  update.ps1 — manual update with any AI account. One entry point for every update:

    -Scope all            figures for all stocks, news for layers 1-7, analyses for all stocks (oldest first)
    -Scope layer  -Target 2         that layer's stocks + its news
    -Scope sector -Target semi      the stocks in that sector (semi, equip, power, net, gpu, soft, fm) + the layers they are in
    -Scope stock  -Target NVDA,ANT  those stocks (figures + analysis)
    -Scope figures [-Target NVDA]   financial figures only (Yahoo, no AI)
    -Parts figures,news,analysis,judge   limit what runs (default: everything that fits the scope; judge = AI panel scores moat/opportunity)
    -Account codex -Model gpt-...   which AI account/model (default: the task choices in ai-accounts.json)
    -DryRun                         show the job list only

  Runs 3 AI jobs at a time and STOPS at the first usage-limit / rate-limit error (no paid extra usage).
  Log: logs\update-<yyyy-MM-dd-HHmm>.log
#>
param([ValidateSet('all', 'layer', 'sector', 'stock', 'figures')][string]$Scope = 'all', [string[]]$Target,
  [string[]]$Parts, [string]$Account, [string]$Model, [int]$Parallel = 3, [switch]$DryRun)
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'common.ps1')

# ---- expand the scope into jobs
$Target = @($Target | ForEach-Object { $_ -split '[,\s]+' } | Where-Object { $_ })
$all = Get-AllTickers; $layers = Get-Layers
$html = [IO.File]::ReadAllText($AiHtml, $Utf8)
$lensOf = @{}; foreach ($t in $all) { $m = [regex]::Match($html, "(?m)^\s*$([regex]::Escape($t)):\{[^\n]*?lens:'(\w+)'"); if ($m.Success) { $lensOf[$t] = $m.Groups[1].Value } }
switch ($Scope) {
  'all'     { $tick = $all; $lays = 1..7 }
  'layer'   { $lays = @($Target | ForEach-Object { [int]$_ }); $tick = @($layers | Where-Object { $lays -contains $_.n } | ForEach-Object { $_.tickers } | Select-Object -Unique) }
  'sector'  { $tick = @($all | Where-Object { $Target -contains $lensOf[$_] }); $lays = @($layers | Where-Object { @($_.tickers | Where-Object { $tick -contains $_ }).Count } | ForEach-Object { $_.n }) }
  'stock'   { $tick = @($Target | ForEach-Object { $_.ToUpper() } | Where-Object { $all -contains $_ }); $lays = @() }
  'figures' { $tick = if ($Target) { @($Target | ForEach-Object { $_.ToUpper() }) } else { $all }; $lays = @() }
}
$want = if ($Parts) { @($Parts | ForEach-Object { $_ -split ',' }) } elseif ($Scope -eq 'figures') { @('figures') } else { @('figures', 'news', 'analysis', 'judge') }
$doFig = $want -contains 'figures'; $doNews = ($want -contains 'news') -and $lays.Count; $doAna = ($want -contains 'analysis') -and $Scope -ne 'figures'
# judging panel: one job per (sector, signed-in judge); a stock scope re-scores only those stocks
$doJudge = ($want -contains 'judge') -and $Scope -ne 'figures'
$judges = if ($doJudge) { @(Get-ActiveJudges) } else { @() }
$lensMap = Get-LensMap; $lenses = @($tick | ForEach-Object { $lensMap[$_] } | Where-Object { $_ } | Select-Object -Unique)
# analyses: oldest first
$tickAna = @($tick | ForEach-Object { $f = Join-Path $AiDir "$_.json"; $at = [datetime]::MinValue
  if (Test-Path $f) { try { $at = [datetime](([IO.File]::ReadAllText($f, $Utf8) | ConvertFrom-Json).generatedAt) } catch {} }
  [pscustomobject]@{ t = $_; at = $at } } | Sort-Object at, t | ForEach-Object { $_.t })
$aiArgs = @(); if ($Account) { $aiArgs += @('-Account', $Account) }; if ($Model) { $aiArgs += @('-Model', $Model) }

Write-Host "Update: scope=$Scope target=$($Target -join ',') parts=$($want -join ',') account=$(if ($Account) { $Account } else { '(task default)' }) model=$(if ($Model) { $Model } else { '(default)' })"
Write-Host "  figures: $(if ($doFig) { "$($tick.Count) stocks" } else { '-' }) | news: $(if ($doNews) { 'L' + ($lays -join ', L') } else { '-' }) | analyses: $(if ($doAna) { "$($tickAna.Count) ($($tickAna -join ', '))" } else { '-' }) | judging: $(if ($doJudge) { "$($lenses.Count) sector(s) x $($judges.Count) model(s) [$(($judges | ForEach-Object { $_.model }) -join ', ')]" } else { '-' })"
if ($DryRun) { return }

$logDir = Join-Path $AiRoot 'logs'; if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Force $logDir | Out-Null }
Start-Transcript -Path (Join-Path $logDir ("update-{0}.log" -f (Get-Date -Format 'yyyy-MM-dd-HHmm'))) | Out-Null
$done = @(); $failed = @(); $stopped = ''
function Get-Status([string]$key) { $f = Join-Path $AiJobs "$key.json"; if (Test-Path $f) { try { return [IO.File]::ReadAllText($f, $Utf8) | ConvertFrom-Json } catch {} }; return $null }
function Start-Tool([string]$script, [string[]]$a) { Start-Process powershell -PassThru -WindowStyle Hidden -ArgumentList (@('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', "`"$(Join-Path $PSScriptRoot $script)`"") + $a) }
# Run jobs (key, script, args) $Parallel at a time; stop at the first usage-limit error.
function Invoke-Jobs($jobs) {
  $q = [System.Collections.Generic.Queue[object]]::new(); $jobs | ForEach-Object { $q.Enqueue($_) }
  while ($q.Count -and -not $script:stopped) {
    $batch = @(); while ($q.Count -and $batch.Count -lt $Parallel) { $batch += $q.Dequeue() }
    Write-Host "$(Get-Date -Format HH:mm) running: $($batch.key -join ', ')  ($($q.Count) waiting)"
    $procs = @($batch | ForEach-Object { Write-JobStatus $_.key 'queued' 'Starting'; Start-Tool $_.script $_.args })
    $procs | ForEach-Object { $_.WaitForExit() }
    foreach ($j in $batch) {
      $s = Get-Status $j.key
      if ($s -and $s.state -eq 'done') { $script:done += $j.key }
      else { $msg = if ($s) { [string]$s.message } else { 'no status' }; $script:failed += $j.key; Write-Warning "$($j.key): $msg"
        if (Test-LimitError $msg) { $script:stopped = "usage limit at $($j.key): $msg" } }
    }
  }
  return @($q.ToArray() | ForEach-Object { $_.key })
}
$left = @()
if ($doFig) {
  Write-Host "`n--- figures (Yahoo) ---"
  $p = Start-Tool 'fundamentals.ps1' $(if ($Scope -eq 'all' -or ($Scope -eq 'figures' -and -not $Target)) { @('-All') } else { @('-Ticker', ($tick -join ',')) }); $p.WaitForExit()
  if ((Get-Status 'FUND').state -eq 'done') { $done += 'figures' } else { $failed += 'figures' }
}
if ($doNews -and -not $stopped) { Write-Host "`n--- news ---"; $left += Invoke-Jobs @($lays | ForEach-Object { @{ key = "L$_"; script = 'news.ps1'; args = @('-Layer', "$_") + $aiArgs } }) }
if ($doAna -and -not $stopped) { Write-Host "`n--- analyses ---"; $left += Invoke-Jobs @($tickAna | ForEach-Object { @{ key = $_; script = 'analyze.ps1'; args = @('-Ticker', $_) + $aiArgs } }) }
elseif ($doAna) { $left += $tickAna }
if ($doJudge -and $judges.Count -and -not $stopped) { Write-Host "`n--- judging panel ---"; $left += Invoke-Jobs @(foreach ($l in $lenses) { foreach ($j in $judges) { @{ key = "J-$l-$($j.profile)"; script = 'judge.ps1'; args = @('-Sector', $l, '-Judge', $j.profile) + $(if ($Scope -eq 'stock') { @('-Ticker', ($tick -join ',')) } else { @() }) } } }) }

Write-Host "`n=== done: $($done.Count) | failed: $($failed.Count) ==="
if ($done) { Write-Host "Updated: $($done -join ', ')" }
if ($failed) { Write-Host "Failed: $($failed -join ', ')" -ForegroundColor Yellow }
if ($stopped) { Write-Host "STOPPED ($stopped). Not reached: $($left -join ', ')" -ForegroundColor Yellow }
Stop-Transcript | Out-Null
