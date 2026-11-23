<#
  indicators.ps1 — download daily prices from Yahoo Finance and compute the
  technical indicators used in the AI Analysis tab.

  Usage:
    powershell -NoProfile -ExecutionPolicy Bypass -File tools\indicators.ps1 -Symbol NASDAQ:NVDA
    powershell -NoProfile -ExecutionPolicy Bypass -File tools\indicators.ps1 -Symbol NVDA -OutFile analysis\NVDA.ind.json

  -Symbol accepts a TradingView symbol (NASDAQ:NVDA, EURONEXT:SU, KRX:000660)
  or a plain Yahoo symbol (NVDA, SU.PA, 000660.KS).
  Writes UTF-8 JSON to stdout, or to -OutFile when given.
#>
param(
  [Parameter(Mandatory = $true)][string]$Symbol,
  [string]$OutFile
)
$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
. (Join-Path $PSScriptRoot 'common.ps1')   # ConvertTo-YahooSymbol

function Get-Ema([double[]]$v, [int]$n) {
  $out = New-Object 'double[]' $v.Length
  for ($i = 0; $i -lt $v.Length; $i++) { $out[$i] = [double]::NaN }
  if ($v.Length -lt $n) { return $out }
  $sum = 0.0; for ($i = 0; $i -lt $n; $i++) { $sum += $v[$i] }
  $out[$n - 1] = $sum / $n
  $k = 2.0 / ($n + 1)
  for ($i = $n; $i -lt $v.Length; $i++) { $out[$i] = $v[$i] * $k + $out[$i - 1] * (1 - $k) }
  return $out
}

function Rnd([double]$x, [int]$d = 2) { if ([double]::IsNaN($x)) { return $null }; return [math]::Round($x, $d) }

$ysym = ConvertTo-YahooSymbol $Symbol
$url = "https://query1.finance.yahoo.com/v8/finance/chart/$([uri]::EscapeDataString($ysym))?range=2y&interval=1d&includePrePost=false"
$resp = Invoke-RestMethod -Uri $url -UserAgent 'Mozilla/5.0' -TimeoutSec 30
$res = $resp.chart.result[0]
if (-not $res) { throw "No price data for $ysym" }
$q = $res.indicators.quote[0]

# keep only rows with a close
$rows = @()
for ($i = 0; $i -lt $res.timestamp.Count; $i++) {
  if ($null -ne $q.close[$i]) {
    $rows += [pscustomobject]@{ t = [int64]$res.timestamp[$i]; o = $q.open[$i]; h = $q.high[$i]; l = $q.low[$i]; c = [double]$q.close[$i]; v = $q.volume[$i] }
  }
}
if ($rows.Count -lt 1) { throw "No price history for $ysym" }
# New listings (e.g. ANT) have only a few rows: indicators that need more history come out null.
[double[]]$c = @($rows | ForEach-Object { $_.c })
$n = $c.Length; $last = $rows[$n - 1]; $prev = if ($n -ge 2) { $rows[$n - 2] } else { $null }

$ema50 = Get-Ema $c 50; $ema100 = Get-Ema $c 100; $ema200 = Get-Ema $c 200
$ema12 = Get-Ema $c 12; $ema26 = Get-Ema $c 26

# MACD (12, 26, 9)
$macd = [double]::NaN; $signal = [double]::NaN
if ($n -ge 34) {
  $macdLine = @(); for ($i = 25; $i -lt $n; $i++) { $macdLine += ($ema12[$i] - $ema26[$i]) }
  $sig = Get-Ema ([double[]]$macdLine) 9
  $macd = $macdLine[-1]; $signal = $sig[$sig.Length - 1]
}

# Bollinger (20, 2)
$mid = [double]::NaN; $sd = [double]::NaN
if ($n -ge 20) {
  $win = $c[($n - 20)..($n - 1)]
  $mid = ($win | Measure-Object -Average).Average
  $sd = [math]::Sqrt((($win | ForEach-Object { ($_ - $mid) * ($_ - $mid) }) | Measure-Object -Sum).Sum / 20)
}

# RSI (14, Wilder)
$rsi = [double]::NaN
if ($n -ge 15) {
  $gain = 0.0; $loss = 0.0
  for ($i = 1; $i -le 14; $i++) { $d = $c[$i] - $c[$i - 1]; if ($d -gt 0) { $gain += $d } else { $loss -= $d } }
  $ag = $gain / 14; $al = $loss / 14
  for ($i = 15; $i -lt $n; $i++) {
    $d = $c[$i] - $c[$i - 1]
    $ag = ($ag * 13 + [math]::Max($d, 0)) / 14
    $al = ($al * 13 + [math]::Max(-$d, 0)) / 14
  }
  $rsi = if ($al -eq 0) { 100 } else { 100 - 100 / (1 + $ag / $al) }
}

$yr = $rows[[math]::Max(0, $n - 252)..($n - 1)]
$vol20 = (($rows[[math]::Max(0, $n - 20)..($n - 1)] | ForEach-Object { [double]$_.v }) | Measure-Object -Average).Average

$spark = $rows[[math]::Max(0, $n - 120)..($n - 1)] | ForEach-Object {
  ,@([DateTimeOffset]::FromUnixTimeSeconds($_.t).UtcDateTime.ToString('yyyy-MM-dd'), (Rnd $_.c 2))
}
$e50tail = @(); for ($i = [math]::Max(0, $n - 120); $i -lt $n; $i++) { $e50tail += (Rnd $ema50[$i] 2) }

$out = [ordered]@{
  symbol    = $Symbol
  yahoo     = $ysym
  currency  = $res.meta.currency
  asOf      = [DateTimeOffset]::FromUnixTimeSeconds($last.t).UtcDateTime.ToString('yyyy-MM-dd')
  fetchedAt = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
  price     = Rnd $last.c
  open      = Rnd $last.o
  high      = Rnd $last.h
  low       = Rnd $last.l
  volume    = $last.v
  avgVolume20 = [int64]$vol20
  changePct = if ($prev) { Rnd (($last.c - $prev.c) / $prev.c * 100) } else { $null }
  historyDays = $n
  ema50     = Rnd $ema50[$n - 1]
  ema100    = Rnd $ema100[$n - 1]
  ema200    = Rnd $ema200[$n - 1]
  bb        = if ($n -ge 20) { [ordered]@{ upper = Rnd ($mid + 2 * $sd); middle = Rnd $mid; lower = Rnd ($mid - 2 * $sd) } } else { $null }
  macd      = if ($n -ge 34) { [ordered]@{ macd = Rnd $macd; signal = Rnd $signal; hist = Rnd ($macd - $signal) } } else { $null }
  rsi14     = Rnd $rsi
  high52w   = Rnd (($yr | ForEach-Object { [double]$_.h }) | Measure-Object -Maximum).Maximum
  low52w    = Rnd (($yr | ForEach-Object { [double]$_.l }) | Measure-Object -Minimum).Minimum
  spark     = @($spark)
  sparkEma50 = $e50tail
}
$json = $out | ConvertTo-Json -Depth 6 -Compress
if ($OutFile) {
  $dir = Split-Path -Parent $OutFile
  if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Force $dir | Out-Null }
  [IO.File]::WriteAllText($OutFile, $json, (New-Object Text.UTF8Encoding $false))
} else { $json }
