<#
  analyze.ps1 — produce the AI Analysis for one or more stocks with Claude Opus 5.5,
  running Claude Code headless under your Claude Code login.

  Usage:
    powershell -NoProfile -ExecutionPolicy Bypass -File tools\analyze.ps1 -Ticker NVDA
    powershell -NoProfile -ExecutionPolicy Bypass -File tools\analyze.ps1 -Ticker NVDA,TSM,ASML
    powershell -NoProfile -ExecutionPolicy Bypass -File tools\analyze.ps1 -All

  Writes analysis\<TICKER>.json and rebuilds ai-analysis.js (what the page loads).
#>
param(
  [string[]]$Ticker,
  [switch]$All,
  [switch]$SkipExisting,   # skip tickers that already have analysis\<TICKER>.json
  [ValidateSet('low', 'medium', 'high', 'xhigh', 'max')][string]$Effort = 'high',
  [string]$Account,        # profile id from ai-accounts.json (default: the Analysis task's choice)
  [string]$Model
)
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'common.ps1')

if ($All) { $Ticker = Get-AllTickers }
if (-not $Ticker) { throw 'Give -Ticker NVDA (or several, comma separated) or -All.' }
$Ticker = $Ticker | ForEach-Object { $_ -split '[,\s]+' } | Where-Object { $_ } | ForEach-Object { $_.ToUpper() }
if ($SkipExisting) { $Ticker = $Ticker | Where-Object { -not (Test-Path (Join-Path $AiDir "$_.json")) } }
Write-Host "Analyzing $(@($Ticker).Count) stock(s): $($Ticker -join ', ')"
$i = 0

$prompt = [IO.File]::ReadAllText((Join-Path $AiRoot 'ai\analysis-prompt.md'), $Utf8)
$schemaPath = Join-Path $AiRoot 'ai\analysis-schema.json'
if (-not (Test-Path $AiDir)) { New-Item -ItemType Directory -Force $AiDir | Out-Null }

$failed = @()
foreach ($t in $Ticker) {
  $i++; Write-Host "`n=== $i / $(@($Ticker).Count): $t ===" -ForegroundColor Cyan
  if ($SkipExisting -and (Test-Path (Join-Path $AiDir "$t.json"))) { Write-Host "[$t] already done elsewhere, skipping."; continue }
  try {
    $co = Get-Company $t
    if (-not $co) { throw "Ticker $t is not in the CO table of the page." }
    Write-Host "[$t] fetching prices and indicators..."
    Write-JobStatus $t 'running' 'Fetching prices and computing indicators'
    $indJson = & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'indicators.ps1') -Symbol $co.tv
    if ($LASTEXITCODE -ne 0 -or -not $indJson) { throw "Indicator download failed for $($co.tv)" }
    $ind = ($indJson | Out-String) | ConvertFrom-Json
    # The model doesn't need the 120-day series; keep the prompt small.
    $indForModel = $ind | Select-Object * -ExcludeProperty spark, sparkEma50 | ConvertTo-Json -Depth 5

    $promptText = @"
$prompt

COMPANY
ticker: $($co.ticker)
name: $($co.name)
symbol: $($co.tv)
business: $($co.does)
moat thesis: $($co.moat)
AI-opportunity sub-scores (exposure, market growth, position, bottleneck, optionality; each 0-20): $(if ($co.opp) { $co.opp -join ', ' } else { 'not set' })
today: $((Get-Date).ToString('yyyy-MM-dd'))$(if ($ind.historyDays -lt 60) { "`nnote: new listing, only $($ind.historyDays) trading days of price history" })

INDICATORS
$indForModel
"@
    $who = Resolve-AiChoice 'analysis' $Account $Model
    Write-Host "[$t] asking $($who.profile.label) $($who.model) (web research + evaluation, usually 2-5 minutes)..."
    Write-JobStatus $t 'running' "$($who.profile.label) $($who.model) is researching news and writing the evaluation"
    $res = Invoke-AI -Task analysis -Prompt $promptText -SchemaPath $schemaPath -Account $Account -Model $Model -Effort $Effort
    $body = $res.structured
    if (-not $body -or -not $body.en -or -not $body.th) { throw 'The AI answered, but not in the expected analysis format.' }

    $out = [ordered]@{
      ticker = $t; name = $co.name; symbol = $co.tv
      model = $(if ($res.model) { $res.model } else { $res.provider }); provider = $res.provider; account = $res.account; effort = $Effort
      generatedAt = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
      costUsd = $res.costUsd
      stance = $body.stance; thesis = $body.thesis
      indicators = $ind; en = $body.en; th = $body.th; sources = $body.sources
    }
    [IO.File]::WriteAllText((Join-Path $AiDir "$t.json"), ($out | ConvertTo-Json -Depth 10), $Utf8)
    & (Join-Path $PSScriptRoot 'build-analysis.ps1')
    Write-JobStatus $t 'done' 'Analysis updated'
    Write-Host "[$t] done."
  } catch {
    $failed += $t
    Write-JobStatus $t 'error' $_.Exception.Message
    Write-Warning "[$t] $($_.Exception.Message)"
  }
}
if ($failed) { exit 1 }
