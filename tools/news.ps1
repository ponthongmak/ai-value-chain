<#
  news.ps1 — gather the latest news for one or more layers of the value chain (and the
  stocks in them) with Claude Sonnet 5.5, running Claude Code headless under your login.

  Usage:
    powershell -NoProfile -ExecutionPolicy Bypass -File tools\news.ps1 -Layer 3
    powershell -NoProfile -ExecutionPolicy Bypass -File tools\news.ps1 -Layer 1,2,5
    powershell -NoProfile -ExecutionPolicy Bypass -File tools\news.ps1 -All

  Writes news\L<n>.json and rebuilds ai-news.js (what the page loads).
#>
param([int[]]$Layer, [switch]$All, [int]$Days = 14, [string]$Account, [string]$Model)
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'common.ps1')

$layers = Get-Layers
if ($All) { $Layer = $layers | ForEach-Object { $_.n } }
if (-not $Layer) { throw 'Give -Layer 3 (or several, comma separated) or -All.' }
$prompt = [IO.File]::ReadAllText((Join-Path $AiRoot 'ai\news-prompt.md'), $Utf8)
$schemaPath = Join-Path $AiRoot 'ai\news-schema.json'
if (-not (Test-Path $NewsDir)) { New-Item -ItemType Directory -Force $NewsDir | Out-Null }

$failed = @()
foreach ($n in $Layer) {
  $key = "L$n"
  $Ly = $layers | Where-Object { $_.n -eq $n }
  try {
    if (-not $Ly) { throw "No layer $n on the page." }
    Write-Host "`n=== Layer $n · $($Ly.name) ===" -ForegroundColor Cyan
    $who = Resolve-AiChoice 'news' $Account $Model
    Write-JobStatus $key 'running' "$($who.profile.label) $($who.model) is gathering news for layer $n"
    $stocks = ($Ly.tickers | ForEach-Object { $c = Get-Company $_; if ($c) { "- $($c.ticker): $($c.name) ($($c.tv)). $($c.does)" } }) -join "`n"
    $subs = ($Ly.subs | ForEach-Object { "- $($_.name): $($_.tickers -join ', ')" }) -join "`n"
    $today = Get-Date
    $promptText = @"
$prompt

LAYER
$n. $($Ly.name)
Sub-sectors:
$subs

STOCKS
$stocks

TODAY: $($today.ToString('yyyy-MM-dd'))
PERIOD: $($today.AddDays(-$Days).ToString('yyyy-MM-dd')) to $($today.ToString('yyyy-MM-dd'))
"@
    $res = Invoke-AI -Task news -Prompt $promptText -SchemaPath $schemaPath -Account $Account -Model $Model
    $body = $res.structured
    if (-not $body -or -not $body.items) { throw 'The AI answered, but not in the expected news format.' }

    # Keep only well-formed items about this layer's stocks.
    $allowed = @($Ly.tickers)
    $items = @($body.items | Where-Object { $_.url -match '^https?://' } | ForEach-Object {
      $_.tickers = @($_.tickers | ForEach-Object { ([string]$_).ToUpper() } | Where-Object { $allowed -contains $_ } | Select-Object -Unique)
      if ($_.impact -notin @('positive', 'negative', 'mixed')) { $_.impact = 'mixed' }
      $_
    })
    $out = [ordered]@{
      layer = $n; name = $Ly.name; model = $(if ($res.model) { $res.model } else { $res.provider }); provider = $res.provider; account = $res.account
      generatedAt = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
      period = @($today.AddDays(-$Days).ToString('yyyy-MM-dd'), $today.ToString('yyyy-MM-dd'))
      costUsd = $res.costUsd
      brief = $body.brief; themes = $body.themes; items = $items
    }
    [IO.File]::WriteAllText((Join-Path $NewsDir "$key.json"), ($out | ConvertTo-Json -Depth 8), $Utf8)
    & (Join-Path $PSScriptRoot 'build-analysis.ps1')
    Write-JobStatus $key 'done' "$($items.Count) news items"
    Write-Host "[$key] done: $($items.Count) items."
  } catch {
    $failed += $key
    Write-JobStatus $key 'error' $_.Exception.Message
    Write-Warning "[$key] $($_.Exception.Message)"
  }
}
if ($failed) { exit 1 }
