<#
  serve.ps1 — private local server for the AI Value Chain Map.

  - Serves the page at http://localhost:8765/
  - /api/chat      in-page chat with the Chat account (Claude streams; Codex / Antigravity reply in one piece)
  - /api/update    manual update: scope all | layer | sector | stock | figures -> queued figures, news and analyses
  - /api/accounts  AI accounts (Claude, Codex, Antigravity): status, sign in / out, which account+model per task
  Every AI runs headless under YOUR own sign-in for that tool (no API key, no stored password).
  Only reachable from this computer (localhost).

  Start:  double-click start.cmd   (or: powershell -NoProfile -ExecutionPolicy Bypass -File serve.ps1)
  Stop:   close the window or press Ctrl+C.
#>
param([int]$Port = 8765, [switch]$NoBrowser,
  # Web pages (besides this server itself) allowed to use this AI bridge, e.g. the GitHub Pages copy of the app.
  # The bridge still only listens on localhost; requests from any other site are refused.
  [string[]]$AllowOrigin = @('https://ponthongmak.github.io'))
# -File passes "a,b" as one string: split it.
$AllowOrigin = @($AllowOrigin | ForEach-Object { $_ -split ',' } | ForEach-Object { $_.Trim().TrimEnd('/') } | Where-Object { $_ })
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'tools\common.ps1')

$ChatSystem = @'
You are the research assistant built into a private web page that maps the AI value chain in seven layers (power, chips and manufacturing, servers and networking, data centers and cloud, foundation models, platforms, applications). For each listed company the page shows six 0-100 scores: moat and AI opportunity (judged sub-scores), growth, quality, valuation and momentum (percentile ranks among the page's stocks, from Yahoo Finance figures), plus layer news and an AI analysis.

- Answer in the language the user writes in (Thai or English).
- Be concise and concrete: short paragraphs, bullet lists, numbers with dates. Markdown is fine (bold, lists, links, small tables).
- Each message may begin with [Page context]: what the user is looking at on the page (company, moat score, the page's AI Analysis and technical indicators). Use it, but say so when it may be stale.
- For anything that changes over time (prices, earnings, news, guidance), search the web and link your sources. Never invent numbers or links.
- You are not a licensed financial adviser. Explain evidence, trade-offs and risks; do not tell the user to buy or sell, and do not set price targets of your own.
'@

$Jobs = @{}   # ticker -> Process
$Queue = New-Object System.Collections.Generic.List[string]   # tickers waiting for a free slot
$MaxParallel = 3                                              # Opus runs at the same time
$Base = "http://localhost:$Port/"
$Types = @{ '.html' = 'text/html; charset=utf-8'; '.js' = 'text/javascript; charset=utf-8'; '.css' = 'text/css; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'; '.svg' = 'image/svg+xml'; '.png' = 'image/png'; '.jpg' = 'image/jpeg'; '.ico' = 'image/x-icon'; '.md' = 'text/plain; charset=utf-8' }

function Send-Json($ctx, $obj, [int]$code = 200) {
  $b = $Utf8.GetBytes(($obj | ConvertTo-Json -Depth 8 -Compress))
  $ctx.Response.StatusCode = $code; $ctx.Response.ContentType = 'application/json; charset=utf-8'
  $ctx.Response.Headers['Cache-Control'] = 'no-store'
  $ctx.Response.OutputStream.Write($b, 0, $b.Length); $ctx.Response.Close()
}
function Read-Body($ctx) {
  $sr = New-Object IO.StreamReader($ctx.Request.InputStream, $Utf8)
  $t = $sr.ReadToEnd(); $sr.Close()
  if ($t.Length -gt 200000) { throw 'Request too large' }
  if (-not $t) { return $null }
  return $t | ConvertFrom-Json
}
function Get-JobsState {
  $o = @{}
  if (Test-Path $AiJobs) {
    Get-ChildItem $AiJobs -Filter '*.json' | ForEach-Object {
      try { $j = [IO.File]::ReadAllText($_.FullName, $Utf8) | ConvertFrom-Json } catch { return }
      # A job may have been started here, from the terminal, or by Claude Code: check its PID.
      $alive = $false
      $p = $Jobs[$j.ticker]
      if ($p -and -not $p.HasExited) { $alive = $true }
      elseif ($j.pid) { $alive = [bool](Get-Process -Id $j.pid -ErrorAction SilentlyContinue) }
      if ($j.state -eq 'queued' -and -not $Queue.Contains($j.ticker)) { $j.state = 'error'; $j.message = 'Queued job was dropped (server restarted). Click Update again.' }
      if ($j.state -eq 'running' -and -not $alive) { $j.state = 'error'; $j.message = 'The update process stopped unexpectedly.' }
      $o[$j.ticker] = $j
    }
  }
  return $o
}

function Handle-Static($ctx) {
  $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart('/'))
  if ($rel -eq '') { $rel = 'index.html' }
  $full = [IO.Path]::GetFullPath((Join-Path $AiRoot $rel))
  $ext = [IO.Path]::GetExtension($full).ToLower()
  if (-not $full.StartsWith($AiRoot, [StringComparison]::OrdinalIgnoreCase) -or -not $Types.ContainsKey($ext) -or -not (Test-Path $full -PathType Leaf) -or $rel -match '(^|[\\/])\.') {
    $ctx.Response.StatusCode = 404; $ctx.Response.Close(); return
  }
  $b = [IO.File]::ReadAllBytes($full)
  $ctx.Response.ContentType = $Types[$ext]; $ctx.Response.Headers['Cache-Control'] = 'no-cache'
  $ctx.Response.OutputStream.Write($b, 0, $b.Length); $ctx.Response.Close()
}

$JobOpts = @{}   # job key -> extra args (-Account/-Model) for that job
# POST /api/update {scope, target, parts, account, model}: expand into queued jobs (L1-L7 news, ticker analyses, FUND figures).
function Handle-Update($ctx) {
  $b = Read-Body $ctx
  $scope = [string]$b.scope; $target = @($b.target | ForEach-Object { "$_" } | Where-Object { $_ })
  if ($scope -notin 'all', 'layer', 'sector', 'stock', 'figures') { Send-Json $ctx @{ error = 'Bad scope' } 400; return }
  $all = Get-AllTickers; $layers = Get-Layers
  $html = [IO.File]::ReadAllText($AiHtml, $Utf8)
  $lensOf = { param($t) $m = [regex]::Match($html, "(?m)^\s*$([regex]::Escape($t)):\{[^\n]*?lens:'(\w+)'"); if ($m.Success) { $m.Groups[1].Value } }
  switch ($scope) {
    'all'     { $tick = $all; $lays = 1..7 }
    'layer'   { $lays = @($target | Where-Object { $_ -match '^[1-7]$' } | ForEach-Object { [int]$_ }); $tick = @($layers | Where-Object { $lays -contains $_.n } | ForEach-Object { $_.tickers } | Select-Object -Unique) }
    'sector'  { $tick = @($all | Where-Object { $target -contains (& $lensOf $_) }); $lays = @($layers | Where-Object { @($_.tickers | Where-Object { $tick -contains $_ }).Count } | ForEach-Object { $_.n }) }
    default   { $tick = @($target | ForEach-Object { $_.ToUpper() } | Where-Object { $all -contains $_ }); if ($scope -eq 'figures' -and -not $target.Count) { $tick = $all }; $lays = @() }
  }
  $parts = if ($b.parts) { @($b.parts) } elseif ($scope -eq 'figures') { @('figures') } else { @('figures', 'news', 'analysis', 'judge') }
  if ($scope -eq 'figures') { $parts = @('figures') }
  $acc = Get-Accounts
  $account = [string]$b.account; $model = [string]$b.model
  if ($account -and -not @($acc.profiles | Where-Object { $_.id -eq $account }).Count) { Send-Json $ctx @{ error = 'Unknown account' } 400; return }
  $opts = @(); if ($account) { $opts += @('-Account', $account) }; if ($model) { if ($model -notmatch '^[\w.\-:/]{1,80}$') { Send-Json $ctx @{ error = 'Bad model' } 400; return }; $opts += @('-Model', $model) }
  $queued = @()
  if ($parts -contains 'figures' -and $tick.Count) {
    $p = $Jobs['FUND']
    if (-not ($p -and -not $p.HasExited)) {
      Write-JobStatus 'FUND' 'running' 'Starting'
      $fa = if ($tick.Count -eq $all.Count) { @('-All') } else { @('-Ticker', ($tick -join ',')) }
      $Jobs['FUND'] = Start-Process powershell -PassThru -WindowStyle Hidden -ArgumentList (@('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', "`"$(Join-Path $AiRoot 'tools\fundamentals.ps1')`"") + $fa)
      $queued += 'FUND'
    }
  }
  $keys = @(); if ($parts -contains 'news') { $keys += @($lays | ForEach-Object { "L$_" }) }; if ($parts -contains 'analysis') { $keys += $tick }
  if ($parts -contains 'judge' -and $tick.Count) {
    # judging panel: one job per (sector, signed-in judge); a stock scope re-scores only those stocks
    $lm = Get-LensMap; $lenses = @($tick | ForEach-Object { $lm[$_] } | Where-Object { $_ } | Select-Object -Unique)
    foreach ($l in $lenses) { foreach ($jd in (Get-ActiveJudgesCached)) { $k = "J-$l-$($jd.profile)"; $keys += $k
      $JobOpts[$k] = @('-Sector', $l, '-Judge', $jd.profile) + $(if ($scope -eq 'stock') { @('-Ticker', ($tick -join ',')) } else { @() }) } }
  }
  foreach ($k in $keys) {
    $p = $Jobs[$k]
    if (($p -and -not $p.HasExited) -or $Queue.Contains($k)) { continue }
    $who = if ($k -match '^J-') { $null } else { try { Resolve-AiChoice $(if ($k -match '^L[1-7]$') { 'news' } else { 'analysis' }) $account $model } catch { $null } }
    if ($k -notmatch '^J-') { $JobOpts[$k] = $opts }; $Queue.Add($k); Write-JobStatus $k 'queued' $(if ($who) { "Queued: $($who.profile.label) $($who.model)" } else { 'Waiting for a free slot' }); $queued += $k
  }
  Start-QueuedJobs
  Send-Json $ctx @{ started = $true; queued = $queued }
}
# Signed-in judges, cached for a minute (status checks run each CLI).
$JudgeCache = @{ at = [datetime]::MinValue; data = @() }
function Get-ActiveJudgesCached { if (((Get-Date) - $JudgeCache.at).TotalSeconds -gt 60) { $JudgeCache.data = @(Get-ActiveJudges); $JudgeCache.at = Get-Date }; return $JudgeCache.data }
# GET /api/accounts: profiles, status, models, task choices. POST: {action: save|add|remove|login|logout, ...}
$StatusCache = @{ at = [datetime]::MinValue; data = $null }
function Handle-Accounts($ctx) {
  $acc = Get-Accounts
  if ($ctx.Request.HttpMethod -eq 'GET') {
    if (((Get-Date) - $StatusCache.at).TotalSeconds -gt 60 -or $ctx.Request.QueryString['refresh']) {
      $StatusCache.data = @{ status = @($acc.profiles | ForEach-Object { Get-ProfileStatus $_ }); models = @{ claude = Get-ProviderModels 'claude'; codex = Get-ProviderModels 'codex'; antigravity = Get-ProviderModels 'antigravity' } }
      $StatusCache.at = Get-Date
    }
    Send-Json $ctx @{ profiles = $acc.profiles; tasks = $acc.tasks; judges = @(Get-Judges); status = $StatusCache.data.status; models = $StatusCache.data.models }; return
  }
  $b = Read-Body $ctx
  switch ([string]$b.action) {
    'save' {
      foreach ($t in 'analysis', 'news', 'chat') { $c = $b.tasks.$t; if ($c -and @($acc.profiles | Where-Object { $_.id -eq $c.profile }).Count -and ([string]$c.model) -match '^[\w.\-:/]{0,80}$') { $acc.tasks.$t = [pscustomobject]@{ profile = [string]$c.profile; model = [string]$c.model } } }
      Save-Accounts $acc; Send-Json $ctx @{ ok = $true }
    }
    'add' {
      $prov = [string]$b.provider; $label = ([string]$b.label).Trim()
      if ($prov -notin 'claude', 'codex' -or -not $label -or $label.Length -gt 40) { Send-Json $ctx @{ error = 'Choose Claude or Codex and a short name (Antigravity uses the account signed in to Antigravity).' } 400; return }
      $id = "$prov-" + ([guid]::NewGuid().ToString('N').Substring(0, 6))
      $dir = Join-Path $env:USERPROFILE ".ai-value-chain\profiles\$id"; New-Item -ItemType Directory -Force $dir | Out-Null
      $acc.profiles = @($acc.profiles) + [pscustomobject]@{ id = $id; provider = $prov; label = $label; configDir = $dir }
      Save-Accounts $acc; $StatusCache.at = [datetime]::MinValue; Send-Json $ctx @{ ok = $true; id = $id }
    }
    'remove' {
      $id = [string]$b.id
      if ($id -in 'claude', 'codex', 'antigravity') { Send-Json $ctx @{ error = 'Built-in accounts cannot be removed.' } 400; return }
      if (@($acc.tasks.PSObject.Properties | Where-Object { $_.Value.profile -eq $id }).Count) { Send-Json $ctx @{ error = 'This account is still chosen for a task.' } 400; return }
      $acc.profiles = @($acc.profiles | Where-Object { $_.id -ne $id }); Save-Accounts $acc; $StatusCache.at = [datetime]::MinValue; Send-Json $ctx @{ ok = $true }
    }
    { $_ -in 'login', 'logout' } {
      $prof = @($acc.profiles | Where-Object { $_.id -eq [string]$b.id })[0]
      if (-not $prof) { Send-Json $ctx @{ error = 'Unknown account' } 400; return }
      $exe = Find-AiExe $prof.provider
      if (-not $exe) { Send-Json $ctx @{ error = "$($prof.provider) is not installed" } 400; return }
      # Opens a visible window: the provider's own sign-in (in your browser). This app never sees a password.
      $sub = @{ claude = @{ login = 'auth login'; logout = 'auth logout' }; codex = @{ login = 'login'; logout = 'logout' }; antigravity = @{ login = ''; logout = '' } }[$prof.provider][$b.action]
      if ($prof.provider -eq 'antigravity' -and $b.action -eq 'logout') { Send-Json $ctx @{ error = 'Sign out of Google inside the Antigravity app.' } 400; return }
      $set = (Get-ProfileEnv $prof).GetEnumerator() | ForEach-Object { "set `"$($_.Key)=$($_.Value)`" && " }
      Start-Process cmd -ArgumentList '/k', "title $($prof.label) $($b.action) && $($set -join '')`"$exe`" $sub"
      $StatusCache.at = [datetime]::MinValue; Send-Json $ctx @{ ok = $true }
    }
    default { Send-Json $ctx @{ error = 'Unknown action' } 400 }
  }
}
# Start queued AI jobs while fewer than $MaxParallel are running (also called every 2 s by the main loop).
# Keys: L1..L7 = layer news (news.ps1), anything else = a stock's analysis (analyze.ps1).
function Start-QueuedJobs {
  if ($Queue.Count -eq 0) { return }
  # Count from the status files (PID-checked), so jobs started before a server restart are included.
  $running = @((Get-JobsState).Values | Where-Object { $_.ticker -ne 'FUND' -and $_.state -eq 'running' }).Count
  while ($Queue.Count -gt 0 -and $running -lt $MaxParallel) {
    $t = $Queue[0]; $Queue.RemoveAt(0)
    Write-JobStatus $t 'running' 'Starting'
    if ($t -match '^J-') { $script = Join-Path $AiRoot 'tools\judge.ps1'; $jobArgs = @() }
    elseif ($t -match '^L([1-7])$') { $script = Join-Path $AiRoot 'tools\news.ps1'; $jobArgs = @('-Layer', $Matches[1]) }
    else { $script = Join-Path $AiRoot 'tools\analyze.ps1'; $jobArgs = @('-Ticker', $t) }
    $jobArgs += @($JobOpts[$t] | Where-Object { $_ })
    $Jobs[$t] = Start-Process powershell -PassThru -WindowStyle Hidden -ArgumentList (@('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', "`"$script`"") + $jobArgs)
    Write-Host "  $(Split-Path -Leaf $script) $t started (pid $($Jobs[$t].Id)), $($Queue.Count) queued"
    $running++
  }
}

function Write-Line($ctx, $obj) {
  $b = $Utf8.GetBytes((($obj | ConvertTo-Json -Depth 5 -Compress) + "`n"))
  $ctx.Response.OutputStream.Write($b, 0, $b.Length); $ctx.Response.OutputStream.Flush()
}

function Handle-Chat($ctx) {
  $body = Read-Body $ctx
  $msg = [string]$body.message
  if (-not $msg.Trim() -or $msg.Length -gt 12000) { Send-Json $ctx @{ error = 'Message is empty or too long' } 400; return }
  $sid = [string]$body.sessionId
  if ($sid -and $sid -notmatch '^[0-9a-fA-F-]{36}$') { $sid = '' }
  $ctxText = [string]$body.context
  if ($ctxText.Length -gt 20000) { $ctxText = $ctxText.Substring(0, 20000) }
  $prompt = if ($ctxText) { "[Page context]`n$ctxText`n[/Page context]`n`n$msg" } else { $msg }
  $who = Resolve-AiChoice 'chat' '' ''

  $ctx.Response.ContentType = 'application/x-ndjson; charset=utf-8'
  $ctx.Response.Headers['Cache-Control'] = 'no-store'
  $ctx.Response.SendChunked = $true
  if ($who.profile.provider -ne 'claude') {
    # Codex / Antigravity: one reply (no token streaming); the conversation id continues the chat.
    try {
      Write-Line $ctx @{ type = 'tool'; name = 'Thinking'; detail = "$($who.profile.label) $($who.model)" }
      $r = Invoke-AI -Task chat -Prompt $prompt -System $ChatSystem -SessionId $sid
      Write-Line $ctx @{ type = 'text'; text = $r.text }
      Write-Line $ctx @{ type = 'done'; sessionId = $r.sessionId; provider = $r.provider; model = $r.model }
    } catch { try { Write-Line $ctx @{ type = 'error'; message = $_.Exception.Message } } catch {} }
    finally { try { $ctx.Response.Close() } catch {} }
    return
  }
  $cArgs = @('-p', '--output-format', 'stream-json', '--verbose', '--include-partial-messages',
    '--tools', 'WebSearch,WebFetch', '--allowedTools', 'WebSearch,WebFetch', '--permission-prompts', 'none',
    '--system-prompt', $ChatSystem)
  if ($who.model) { $cArgs += @('--model', $who.model) }
  if ($sid) { $cArgs += @('--resume', $sid) }
  $p = $null
  try {
    $p = Start-AiProcess (Find-AiExe 'claude') $cArgs $prompt (Get-ProfileEnv $who.profile)
    $sawDelta = $false
    while ($null -ne ($line = $p.StandardOutput.ReadLine())) {
      if (-not $line.StartsWith('{')) { continue }
      try { $ev = $line | ConvertFrom-Json } catch { continue }
      switch ($ev.type) {
        'stream_event' {
          $e = $ev.event
          if ($e.type -eq 'content_block_delta' -and $e.delta.type -eq 'text_delta') { $sawDelta = $true; Write-Line $ctx @{ type = 'text'; text = $e.delta.text } }
        }
        'assistant' {
          foreach ($blk in $ev.message.content) {
            if ($blk.type -eq 'text' -and -not $sawDelta) { Write-Line $ctx @{ type = 'text'; text = $blk.text } }
            elseif ($blk.type -eq 'tool_use' -or $blk.type -eq 'server_tool_use') {
              $q = if ($blk.input.query) { $blk.input.query } elseif ($blk.input.url) { $blk.input.url } else { '' }
              Write-Line $ctx @{ type = 'tool'; name = $blk.name; detail = $q }
            }
          }
          $sawDelta = $false
        }
        'result' {
          if ($ev.is_error) { Write-Line $ctx @{ type = 'error'; message = [string]$ev.result } }
          else { Write-Line $ctx @{ type = 'done'; sessionId = $ev.session_id; costUsd = $ev.total_cost_usd; provider = 'claude'; model = $who.model } }
        }
      }
    }
    $p.WaitForExit()
  } catch {
    try { Write-Line $ctx @{ type = 'error'; message = $_.Exception.Message } } catch {}
  } finally {
    if ($p -and -not $p.HasExited) { try { $p.Kill() } catch {} }
    try { $ctx.Response.Close() } catch {}
  }
}

# ---------------------------------------------------------------- main loop
$auth = Get-ClaudeAuth
$listener = New-Object Net.HttpListener
$listener.Prefixes.Add($Base)
$listener.Start()
Write-Host ''
Write-Host "  AI Value Chain Map  ->  $Base" -ForegroundColor Cyan
Write-Host "  Claude Code CLI:  $(if ($auth.path) { $auth.path } else { 'NOT FOUND' })"
if (-not $auth.loggedIn) {
  Write-Host '  Claude Code is not signed in, so chat and Update will fail.' -ForegroundColor Yellow
  Write-Host "  Sign in once with:  & `"$($auth.path)`" auth login" -ForegroundColor Yellow
}
Write-Host '  Press Ctrl+C or close this window to stop.'
Write-Host ''
if (-not $NoBrowser) { Start-Process $Base }

try {
  while ($listener.IsListening) {
    # Wait in short slices so queued jobs start even when no page is open (and Ctrl+C works).
    $pending = $listener.GetContextAsync()
    while (-not $pending.Wait(2000)) { try { Start-QueuedJobs } catch { Write-Warning $_.Exception.Message } }
    $ctx = $pending.Result
    $req = $ctx.Request
    try {
      # Private use only: accept requests addressed to this machine, from this page or an allowed copy of it (GitHub Pages).
      $hostOk = $req.UserHostName -match "^(localhost|127\.0\.0\.1):$Port$"
      $origin = $req.Headers['Origin']
      $remote = $origin -and ($AllowOrigin -contains $origin)
      $originOk = (-not $origin) -or ($origin -in "http://localhost:$Port", "http://127.0.0.1:$Port") -or $remote
      if (-not $hostOk -or -not $originOk) { $ctx.Response.StatusCode = 403; $ctx.Response.Close(); continue }
      if ($remote) {
        # CORS for the hosted page; Allow-Private-Network is Chrome's rule for public pages calling localhost.
        $ctx.Response.Headers['Access-Control-Allow-Origin'] = $origin
        $ctx.Response.Headers['Vary'] = 'Origin'
        $ctx.Response.Headers['Access-Control-Allow-Private-Network'] = 'true'
      }
      if ($req.HttpMethod -eq 'OPTIONS') {
        if (-not $remote) { $ctx.Response.StatusCode = 403; $ctx.Response.Close(); continue }
        $ctx.Response.Headers['Access-Control-Allow-Methods'] = 'GET, POST'
        $ctx.Response.Headers['Access-Control-Allow-Headers'] = 'Content-Type, X-AI-Map'
        $ctx.Response.Headers['Access-Control-Max-Age'] = '600'
        $ctx.Response.StatusCode = 204; $ctx.Response.Close(); continue
      }
      $path = $req.Url.AbsolutePath
      if ($path.StartsWith('/api/')) {
        if ($req.HttpMethod -eq 'POST' -and $req.Headers['X-AI-Map'] -ne '1') { Send-Json $ctx @{ error = 'Forbidden' } 403; continue }
        switch ("$($req.HttpMethod) $path") {
          'GET /api/status' {
            $a = Get-ClaudeAuth; $acc = Get-Accounts
            $lbl = { param($t) $c = $acc.tasks.$t; $pr = @($acc.profiles | Where-Object { $_.id -eq $c.profile })[0]; (@($pr.label, $c.model) | Where-Object { $_ }) -join ' - ' }
            Send-Json $ctx @{ ok = $true; claudeFound = $a.found; loggedIn = $(if ((Resolve-AiChoice 'chat' '' '').profile.provider -eq 'claude') { $a.loggedIn } else { $true }); chatModel = (& $lbl 'chat'); chatProvider = (Resolve-AiChoice 'chat' '' '').profile.provider; analysisModel = (& $lbl 'analysis'); newsModel = (& $lbl 'news'); jobs = (Get-JobsState) }
          }
          'GET /api/jobs' { Start-QueuedJobs; Send-Json $ctx (Get-JobsState) }
          'POST /api/update' { Handle-Update $ctx }
          'GET /api/accounts' { Handle-Accounts $ctx }
          'POST /api/accounts' { Handle-Accounts $ctx }
          'POST /api/chat' { Write-Host "  chat ($($req.ContentLength64) bytes)"; Handle-Chat $ctx }
          default { Send-Json $ctx @{ error = 'Not found' } 404 }
        }
      } elseif ($req.HttpMethod -eq 'GET') { Handle-Static $ctx }
      else { $ctx.Response.StatusCode = 405; $ctx.Response.Close() }
    } catch {
      Write-Warning $_.Exception.Message
      try { Send-Json $ctx @{ error = $_.Exception.Message } 500 } catch {}
    }
  }
} finally { $listener.Stop() }
