<#
  fundamentals.ps1 — download financial history from Yahoo Finance for the scores, trend
  charts and peer comparison. Uses no AI.

  Per stock: 4 fiscal years + trailing 12 months (TTM) of the main statement items, the last
  5 quarters of revenue and net income, a rebuilt market cap per year, and the 12-month price
  trend. ALL MONEY IS IN USD, converted at today's exchange rate (the same rate for every year,
  so currency moves do not distort the trends).

  Usage:
    powershell -NoProfile -ExecutionPolicy Bypass -File tools\fundamentals.ps1 -All
    powershell -NoProfile -ExecutionPolicy Bypass -File tools\fundamentals.ps1 -Ticker NVDA,ANT
  Writes data\fundamentals.json (merged) and rebuilds fundamentals.js.
#>
param([string[]]$Ticker, [switch]$All)
$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
. (Join-Path $PSScriptRoot 'common.ps1')

if ($All -or -not $Ticker) { $Ticker = Get-AllTickers }
$Ticker = @($Ticker | ForEach-Object { $_ -split '[,\s]+' } | Where-Object { $_ } | ForEach-Object { $_.ToUpper() })
Write-JobStatus 'FUND' 'running' "Downloading figures for $($Ticker.Count) stocks"

$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36'
$s = New-Object Microsoft.PowerShell.Commands.WebRequestSession
try { Invoke-WebRequest 'https://fc.yahoo.com' -WebSession $s -UserAgent $ua -UseBasicParsing -TimeoutSec 20 | Out-Null } catch {}
$crumb = (Invoke-WebRequest 'https://query1.finance.yahoo.com/v1/test/getcrumb' -WebSession $s -UserAgent $ua -UseBasicParsing -TimeoutSec 20).Content
if (-not $crumb -or $crumb.Length -gt 40) { Write-JobStatus 'FUND' 'error' 'Could not get a Yahoo session'; throw 'Could not get a Yahoo session (crumb).' }
$cq = [uri]::EscapeDataString($crumb)

function Get-Json([string]$url) { (Invoke-WebRequest $url -WebSession $s -UserAgent $ua -UseBasicParsing -TimeoutSec 30).Content | ConvertFrom-Json }
function Raw($o) { if ($null -ne $o -and $o.PSObject.Properties['raw']) { return [double]$o.raw }; return $null }
function Mul($v, $k) { if ($null -eq $v -or $null -eq $k) { return $null }; return [double]$v * $k }
$fx = @{ USD = 1.0 }
function Get-Usd([string]$cur) {   # today's rate: 1 unit of $cur in USD
  if (-not $cur) { return $null }
  if (-not $fx.ContainsKey($cur)) {
    try { $fx[$cur] = [double](Get-Json "https://query1.finance.yahoo.com/v8/finance/chart/$($cur)USD=X?range=5d&interval=1d").chart.result[0].meta.regularMarketPrice }
    catch { $fx[$cur] = $null }
  }
  return $fx[$cur]
}
# Least-squares fit of y on x; returns slope and R².
function Get-Fit([double[]]$x, [double[]]$y) {
  $n = $x.Length; if ($n -lt 3) { return $null }
  $mx = ($x | Measure-Object -Average).Average; $my = ($y | Measure-Object -Average).Average
  $sxy = 0.0; $sxx = 0.0; $syy = 0.0
  for ($i = 0; $i -lt $n; $i++) { $dx = $x[$i] - $mx; $dy = $y[$i] - $my; $sxy += $dx * $dy; $sxx += $dx * $dx; $syy += $dy * $dy }
  if ($sxx -eq 0) { return $null }
  $b = $sxy / $sxx
  return @{ slope = $b; r2 = $(if ($syy -gt 0) { ($sxy * $sxy) / ($sxx * $syy) } else { 0 }) }
}

$items = [ordered]@{ rev = 'TotalRevenue'; gp = 'GrossProfit'; oi = 'OperatingIncome'; ni = 'NetIncome'; fcf = 'FreeCashFlow'; ebitda = 'EBITDA'
  assets = 'TotalAssets'; equity = 'StockholdersEquity'; debt = 'TotalDebt'; cash = 'CashAndCashEquivalents'; shares = 'DilutedAverageShares' }
$flowKeys = 'rev', 'gp', 'oi', 'ni', 'fcf', 'ebitda', 'shares'        # TTM comes from trailing*; balance items from the latest quarter
$types = @(foreach ($v in $items.Values) { "annual$v"; "quarterly$v" }) + @(foreach ($k in $flowKeys) { "trailing$($items[$k])" })
$p1 = [DateTimeOffset]::new([datetime]'2018-01-01').ToUnixTimeSeconds(); $p2 = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()

$file = Join-Path $DataDir 'fundamentals.json'
if (-not (Test-Path $DataDir)) { New-Item -ItemType Directory -Force $DataDir | Out-Null }
$db = [ordered]@{ fetchedAt = $null; source = 'Yahoo Finance'; currency = 'USD'; stocks = [ordered]@{} }
if (Test-Path $file) { try { ([IO.File]::ReadAllText($file, $Utf8) | ConvertFrom-Json).stocks.PSObject.Properties | ForEach-Object { $db.stocks[$_.Name] = $_.Value } } catch {} }

$i = 0; $ok = 0
foreach ($t in $Ticker) {
  $i++
  $co = Get-Company $t
  if (-not $co) { Write-Warning "[$t] not in the CO table"; continue }
  $y = ConvertTo-YahooSymbol $co.tv; $ye = [uri]::EscapeDataString($y)
  Write-Host "[$i/$($Ticker.Count)] $t ($y)"
  try {
    $r = (Get-Json "https://query2.finance.yahoo.com/v10/finance/quoteSummary/$ye`?modules=financialData,defaultKeyStatistics,summaryDetail,earningsTrend,price&crumb=$cq").quoteSummary.result[0]
    if (-not $r) { throw 'no quoteSummary result' }
    $cur = [string]$r.price.currency; $fin = [string]$r.financialData.financialCurrency; if (-not $fin) { $fin = $cur }
    $kPx = Get-Usd $cur; $kFin = Get-Usd $fin
    if ($null -eq $kPx -or $null -eq $kFin) { throw "no USD rate for $cur/$fin" }
    $mcap = Mul (Raw $r.price.marketCap) $kPx

    # Statement history (fiscal years, TTM, quarters), converted to USD at today's rate.
    $ts = (Get-Json "https://query2.finance.yahoo.com/ws/fundamentals-timeseries/v1/finance/timeseries/$ye`?type=$($types -join ',')&period1=$p1&period2=$p2&crumb=$cq").timeseries.result
    $raw = @{}
    foreach ($res in $ts) { $ty = $res.meta.type[0]; $raw[$ty] = @($res.$ty | Where-Object { $_ -and $_.reportedValue } | ForEach-Object { [pscustomobject]@{ d = [string]$_.asOfDate; v = [double]$_.reportedValue.raw } }) }
    $years = @($raw["annual$($items.rev)"] | ForEach-Object { $_.d } | Sort-Object -Unique | Select-Object -Last 4)
    $val = { param($ty, $d) $hit = @($raw[$ty] | Where-Object { $_.d -eq $d }); if ($hit.Count) { $hit[0].v } else { $null } }
    $last = { param($ty) $a = @($raw[$ty] | Sort-Object d); if ($a.Count) { $a[-1] } else { $null } }
    $ser = [ordered]@{ t = @() }; foreach ($k in $items.Keys) { $ser[$k] = @() }
    foreach ($d in $years) {
      $ser.t += $d
      foreach ($k in $items.Keys) { $v = & $val "annual$($items[$k])" $d; $ser[$k] += $(if ($k -eq 'shares') { $v } else { Mul $v $kFin }) }
    }
    $ttmRev = & $last "trailing$($items.rev)"
    if ($ttmRev -and (-not $years.Count -or $ttmRev.d -gt $years[-1])) {
      $ser.t += 'TTM'
      foreach ($k in $items.Keys) {
        $src = if ($flowKeys -contains $k) { & $last "trailing$($items[$k])" } else { & $last "quarterly$($items[$k])" }
        if ($k -eq 'shares' -and -not $src) { $src = & $last "quarterly$($items[$k])" }
        $v = if ($src) { $src.v } else { $null }
        $ser[$k] += $(if ($k -eq 'shares') { $v } else { Mul $v $kFin })
      }
    }
    $qd = @($raw["quarterly$($items.rev)"] | ForEach-Object { $_.d } | Sort-Object -Unique | Select-Object -Last 5)
    $q = [ordered]@{ t = $qd; rev = @($qd | ForEach-Object { Mul (& $val "quarterly$($items.rev)" $_) $kFin }); ni = @($qd | ForEach-Object { Mul (& $val "quarterly$($items.ni)" $_) $kFin }) }

    # Market cap per year = today's market cap × (price then ÷ price now) × (shares then ÷ shares now).
    $mon = (Get-Json "https://query1.finance.yahoo.com/v8/finance/chart/$ye`?range=5y&interval=1mo").chart.result[0]
    $mt = @($mon.timestamp); $mc = @($mon.indicators.quote[0].close)
    $pxNow = [double]$mon.meta.regularMarketPrice
    $shNow = @($ser.shares | Where-Object { $_ }) | Select-Object -Last 1
    $ser.mcap = @(for ($j = 0; $j -lt $ser.t.Count; $j++) {
      if ($ser.t[$j] -eq 'TTM') { $mcap; continue }
      $end = [DateTimeOffset]::new([datetime]$ser.t[$j]).AddDays(5).ToUnixTimeSeconds(); $p = $null
      for ($m = 0; $m -lt $mt.Count; $m++) { if ($mt[$m] -le $end -and $null -ne $mc[$m]) { $p = [double]$mc[$m] } }
      $sh = $ser.shares[$j]
      if ($p -and $pxNow -and $mcap -and $sh -and $shNow) { $mcap * ($p / $pxNow) * ($sh / $shNow) } else { $null }
    })
    $price5y = @(for ($m = 0; $m -lt $mt.Count; $m++) { if ($null -ne $mc[$m]) { ,@([DateTimeOffset]::FromUnixTimeSeconds($mt[$m]).UtcDateTime.ToString('yyyy-MM'), [math]::Round([double]$mc[$m] * $kPx, 2)) } })

    # 12-1 month price trend: fit ln(price) over the last year, skipping the latest ~21 trading days.
    $day = (Get-Json "https://query1.finance.yahoo.com/v8/finance/chart/$ye`?range=1y&interval=1d").chart.result[0]
    $dc = @($day.indicators.quote[0].close | Where-Object { $null -ne $_ } | ForEach-Object { [double]$_ })
    $px12 = $null
    if ($dc.Count -ge 120) {
      $use = $dc[0..($dc.Count - 22)]
      $fit = Get-Fit ([double[]](0..($use.Count - 1) | ForEach-Object { $_ / 252 })) ([double[]]($use | ForEach-Object { [math]::Log($_) }))
      if ($fit) { $px12 = [ordered]@{ slope = [math]::Exp($fit.slope) - 1; r2 = $fit.r2; days = $use.Count } }
    }

    $nextY = $null; foreach ($tr in @($r.earningsTrend.trend)) { if ($tr.period -eq '+1y') { $nextY = Raw $tr.revenueEstimate.growth } }
    $db.stocks[$t] = [ordered]@{
      symbol = $y; asOf = (Get-Date).ToString('yyyy-MM-dd'); priceCurrency = $cur; statementCurrency = $fin
      usdRate = [ordered]@{ price = $kPx; statements = $kFin }
      price = Mul (Raw $r.financialData.currentPrice) $kPx; marketCap = $mcap
      forwardPE = Raw $r.summaryDetail.forwardPE; trailingPE = Raw $r.summaryDetail.trailingPE; revGrowthNextY = $nextY; roe = Raw $r.financialData.returnOnEquity
      ser = $ser; q = $q; price5y = $price5y; px12 = $px12
    }
    $ok++
  } catch {
    Write-Warning "[$t] $($_.Exception.Message)"
    if (-not $db.stocks.Contains($t)) { $db.stocks[$t] = [ordered]@{ symbol = $y; error = $_.Exception.Message } }
  }
  Start-Sleep -Milliseconds 250
}
$db.fetchedAt = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
$db.rates = $fx
[IO.File]::WriteAllText($file, ($db | ConvertTo-Json -Depth 8 -Compress), $Utf8)
& (Join-Path $PSScriptRoot 'build-analysis.ps1')
Write-JobStatus 'FUND' 'done' "Figures updated for $ok of $($Ticker.Count) stocks"
Write-Host "fundamentals: $ok of $($Ticker.Count) stocks updated (USD)"
