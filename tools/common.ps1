# common.ps1 — shared helpers for the AI Analysis tools (dot-source this file).
# Everything here runs Claude Code headless (`claude -p`) under YOUR Claude Code login.
# No API key is used or stored.

$Global:AiRoot = Split-Path -Parent $PSScriptRoot
$Global:AiHtml = Join-Path $AiRoot 'index.html'
$Global:AiDir  = Join-Path $AiRoot 'analysis'
$Global:AiJobs = Join-Path $AiDir '.jobs'

# Models. Change here if you want a different one.
$Global:AnalysisModel = 'claude-opus-5-5'    # deep per-stock evaluation
$Global:ChatModel     = 'claude-sonnet-5-5'  # in-page chat
$Global:NewsModel     = 'claude-sonnet-5-5'  # layer and stock news

$Global:Utf8 = New-Object Text.UTF8Encoding $false
$Global:NewsDir = Join-Path $AiRoot 'news'
$Global:DataDir = Join-Path $AiRoot 'data'

# TradingView symbol (NASDAQ:NVDA, EURONEXT:SU, KRX:000660) -> Yahoo symbol (NVDA, SU.PA, 000660.KS).
function ConvertTo-YahooSymbol([string]$s) {
  if ($s -notmatch ':') { return $s }
  $ex, $tk = $s.Split(':', 2)
  switch ($ex.ToUpper()) {
    'EURONEXT' { return "$tk.PA" }
    'KRX'      { return "$tk.KS" }
    'TWSE'     { return "$tk.TW" }
    'TSE'      { return "$tk.T" }
    'HKEX'     { return "$tk.HK" }
    'LSE'      { return "$tk.L" }
    'XETR'     { return "$tk.DE" }
    'SET'      { return "$tk.BK" }
    default    { return $tk }
  }
}

# Every ticker in the page's CO table, in page order.
function Get-AllTickers {
  $html = [IO.File]::ReadAllText($AiHtml, $Utf8)
  return @([regex]::Matches($html, "(?m)^  ([A-Z0-9]+):\{(?:label:'[^']*',\s*)?name:'[^']+',\s*tv:'") | ForEach-Object { $_.Groups[1].Value })
}

# The 7 layers from the page's LAYERS table: number, name, sub-sectors with tickers.
function Get-Layers {
  $html = [IO.File]::ReadAllText($AiHtml, $Utf8)
  $start = $html.IndexOf('const LAYERS = [')
  $end = $html.IndexOf("`n];", $start)
  $block = $html.Substring($start, $end - $start)
  $heads = [regex]::Matches($block, "\{n:(\d), name:'([^']+)'")
  $out = @()
  for ($i = 0; $i -lt $heads.Count; $i++) {
    $from = $heads[$i].Index
    $to = if ($i + 1 -lt $heads.Count) { $heads[$i + 1].Index } else { $block.Length }
    $chunk = $block.Substring($from, $to - $from)
    $subs = @([regex]::Matches($chunk, "\{s:'([^']+)', s_th:'[^']*', t:\[([^\]]*)\]") | ForEach-Object {
      [pscustomobject]@{ name = $_.Groups[1].Value; tickers = @([regex]::Matches($_.Groups[2].Value, "'([A-Z0-9]+)'") | ForEach-Object { $_.Groups[1].Value }) }
    })
    $out += [pscustomobject]@{ n = [int]$heads[$i].Groups[1].Value; name = $heads[$i].Groups[2].Value; subs = $subs
      tickers = @($subs | ForEach-Object { $_.tickers } | Select-Object -Unique) }
  }
  return $out
}

function Find-Claude {
  if ($env:CLAUDE_EXE -and (Test-Path $env:CLAUDE_EXE)) { return $env:CLAUDE_EXE }
  $cmd = Get-Command claude -ErrorAction SilentlyContinue | Where-Object { $_.CommandType -eq 'Application' } | Select-Object -First 1
  if ($cmd) { return $cmd.Source }
  $cands = @()
  $cands += Get-ChildItem "$env:USERPROFILE\.local\bin\claude.exe" -ErrorAction SilentlyContinue
  $cands += Get-ChildItem "$env:LOCALAPPDATA\Claude-Data\*\claude-code\*\*\claude.exe" -ErrorAction SilentlyContinue
  $cands += Get-ChildItem "$env:APPDATA\Claude\claude-code\*\claude.exe" -ErrorAction SilentlyContinue
  $hit = $cands | Sort-Object LastWriteTime -Descending | Select-Object -First 1
  if ($hit) { return $hit.FullName }
  return $null
}

# Quote one argument for a Windows command line (CommandLineToArgvW rules).
function ConvertTo-CmdArg([string]$a) {
  if ($a -eq '') { return '""' }
  if ($a -notmatch '[\s"]') { return $a }
  $sb = New-Object Text.StringBuilder; [void]$sb.Append('"'); $bs = 0
  foreach ($ch in $a.ToCharArray()) {
    if ($ch -eq '\') { $bs++ }
    elseif ($ch -eq '"') { [void]$sb.Append('\' * ($bs * 2 + 1)); [void]$sb.Append('"'); $bs = 0 }
    else { if ($bs) { [void]$sb.Append('\' * $bs) }; [void]$sb.Append($ch); $bs = 0 }
  }
  [void]$sb.Append('\' * ($bs * 2)); [void]$sb.Append('"')
  return $sb.ToString()
}

# Start `claude` with arguments, send $Stdin as the prompt, return the Process
# (stdout redirected as UTF-8; caller reads it).
function Start-Claude([string[]]$ClaudeArgs, [string]$Stdin) {
  $exe = Find-Claude
  if (-not $exe) { throw 'Claude Code CLI not found. Install it (https://claude.com/claude-code) or set $env:CLAUDE_EXE.' }
  $psi = New-Object Diagnostics.ProcessStartInfo
  $psi.FileName = $exe
  $psi.Arguments = ($ClaudeArgs | ForEach-Object { ConvertTo-CmdArg $_ }) -join ' '
  $psi.UseShellExecute = $false
  $psi.RedirectStandardInput = $true
  $psi.RedirectStandardOutput = $true
  $psi.StandardOutputEncoding = $Utf8
  $psi.CreateNoWindow = $true
  $psi.WorkingDirectory = $AiRoot
  $p = [Diagnostics.Process]::Start($psi)
  $bytes = $Utf8.GetBytes($Stdin)
  $p.StandardInput.BaseStream.Write($bytes, 0, $bytes.Length)
  $p.StandardInput.Close()
  return $p
}

# ------------------------------------------------------------------ AI accounts / providers
# ai-accounts.json holds profiles and which profile+model each task uses. It never holds passwords:
# each CLI signs in through its own browser login and keeps its own token.
$Global:AccountsFile = Join-Path $AiRoot 'ai-accounts.json'
$Global:ProviderModels = @{
  claude = @('claude-opus-5-5', 'claude-sonnet-5-5', 'claude-haiku-5-5', 'claude-fable-5-2')
  codex = @('')          # '' = the CLI's default model; more are read from ~/.codex/models_cache.json when present
  antigravity = @('')    # filled from `agy models`
}
function Get-Accounts {
  if (Test-Path $AccountsFile) { try { return [IO.File]::ReadAllText($AccountsFile, $Utf8) | ConvertFrom-Json } catch {} }
  return ([ordered]@{
    profiles = @(
      [ordered]@{ id = 'claude'; provider = 'claude'; label = 'Claude'; configDir = '' },
      [ordered]@{ id = 'codex'; provider = 'codex'; label = 'Codex (ChatGPT)'; configDir = '' },
      [ordered]@{ id = 'antigravity'; provider = 'antigravity'; label = 'Antigravity (Google)'; configDir = '' })
    tasks = [ordered]@{
      analysis = [ordered]@{ profile = 'claude'; model = 'claude-opus-5-5' }
      news = [ordered]@{ profile = 'claude'; model = 'claude-sonnet-5-5' }
      chat = [ordered]@{ profile = 'claude'; model = 'claude-sonnet-5-5' } }
  } | ConvertTo-Json -Depth 5 | ConvertFrom-Json)
}
# Judging panel for the judged scores (moat, AI opportunity): each model scores independently; the page takes the
# weighted average of the models that have results. Models that are not signed in are skipped when scoring.
$Global:DefaultJudges = @(
  [ordered]@{ profile = 'claude'; model = 'claude-opus-5-5'; effort = 'max'; weight = 1 },
  [ordered]@{ profile = 'antigravity'; model = 'gemini-4-neon-high'; effort = 'high'; weight = 1 },
  [ordered]@{ profile = 'codex'; model = 'gpt-6.2-sol'; effort = 'high'; weight = 1 })
function Get-Judges {
  $acc = Get-Accounts
  $j = if ($acc.PSObject.Properties['judges'] -and $acc.judges) { @($acc.judges) } else { @($DefaultJudges | ForEach-Object { [pscustomobject]$_ }) }
  return @($j | Where-Object { $p = $_.profile; @($acc.profiles | Where-Object { $_.id -eq $p }).Count })
}
# Judges whose account is signed in right now.
function Get-ActiveJudges {
  $acc = Get-Accounts
  return @(Get-Judges | Where-Object { $p = $_.profile; $prof = @($acc.profiles | Where-Object { $_.id -eq $p })[0]; (Get-ProfileStatus $prof).signedIn })
}
# ticker -> sector key (lens) from the CO table.
function Get-LensMap {
  $html = [IO.File]::ReadAllText($AiHtml, $Utf8); $map = @{}
  foreach ($m in [regex]::Matches($html, "(?m)^  ([A-Z0-9]+):\{[^\n]*?lens:'(\w+)'")) { $map[$m.Groups[1].Value] = $m.Groups[2].Value }
  return $map
}
function Save-Accounts($acc) { [IO.File]::WriteAllText($AccountsFile, ($acc | ConvertTo-Json -Depth 5), $Utf8) }
function Find-AiExe([string]$provider) {
  switch ($provider) {
    'claude' { return Find-Claude }
    'codex' {
      if ($env:CODEX_EXE -and (Test-Path $env:CODEX_EXE)) { return $env:CODEX_EXE }
      $c = Get-Command codex -ErrorAction SilentlyContinue | Where-Object { $_.CommandType -eq 'Application' } | Select-Object -First 1
      if ($c) { return $c.Source }
      $h = Get-ChildItem "$env:USERPROFILE\.vscode\extensions\openai.chatgpt-*\bin\windows-x86_64\codex.exe" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1
      if ($h) { return $h.FullName }; return $null }
    'antigravity' { $p = "$env:USERPROFILE\.gemini\bin\agy.exe"; if (Test-Path $p) { return $p }; return $null }
  }
  return $null
}
# Environment for a profile: a separate config folder keeps a separate signed-in account.
function Get-ProfileEnv($prof) {
  $e = @{}
  if ($prof.configDir) {
    if ($prof.provider -eq 'claude') { $e['CLAUDE_CONFIG_DIR'] = $prof.configDir }
    if ($prof.provider -eq 'codex') { $e['CODEX_HOME'] = $prof.configDir }
  }
  return $e
}
function Start-AiProcess([string]$exe, [string[]]$cliArgs, [string]$stdin, $envVars) {
  $psi = New-Object Diagnostics.ProcessStartInfo
  $psi.FileName = $exe
  $psi.Arguments = ($cliArgs | ForEach-Object { ConvertTo-CmdArg $_ }) -join ' '
  $psi.UseShellExecute = $false; $psi.CreateNoWindow = $true; $psi.WorkingDirectory = $AiRoot
  $psi.RedirectStandardInput = $true; $psi.RedirectStandardOutput = $true; $psi.StandardOutputEncoding = $Utf8
  $psi.RedirectStandardError = $true; $psi.StandardErrorEncoding = $Utf8
  if ($envVars) { foreach ($k in $envVars.Keys) { $psi.EnvironmentVariables[$k] = $envVars[$k] } }
  $p = [Diagnostics.Process]::Start($psi)
  # Read stderr in the background (avoids a pipe deadlock); Get-AiError reads it after exit.
  $p | Add-Member -NotePropertyName ErrTask -NotePropertyValue $p.StandardError.ReadToEndAsync()
  if ($stdin) { $b = $Utf8.GetBytes($stdin); $p.StandardInput.BaseStream.Write($b, 0, $b.Length) }
  $p.StandardInput.Close()
  return $p
}
function Get-AiError($p) { try { $t = $p.ErrTask.Result.Trim(); if ($t.Length -gt 400) { $t = $t.Substring(0, 400) }; return $t } catch { return '' } }
# Resolve which profile and model a task uses (explicit -Account/-Model win).
function Resolve-AiChoice([string]$Task, [string]$Account, [string]$Model) {
  $acc = Get-Accounts
  $t = $acc.tasks.$Task
  $id = if ($Account) { $Account } elseif ($t) { $t.profile } else { 'claude' }
  $prof = @($acc.profiles | Where-Object { $_.id -eq $id })[0]
  if (-not $prof) { throw "No AI account '$id' in ai-accounts.json" }
  $m = if ($PSBoundParameters.ContainsKey('Model') -and $Model) { $Model } elseif (-not $Account -and $t) { $t.model } elseif ($prof.provider -eq 'claude') { 'claude-sonnet-5-5' } else { '' }
  return [pscustomobject]@{ profile = $prof; model = $m }
}
<#
  Invoke-AI: one call for every provider. Runs the profile's CLI headless with web search,
  optional JSON-schema output, optional session to continue. Returns
  { text, structured, costUsd, sessionId, provider, model, account }.
#>
function Invoke-AI([string]$Task, [string]$Prompt, [string]$SchemaPath, [string]$Account, [string]$Model, [string]$System, [string]$SessionId, [string]$Effort) {
  $c = Resolve-AiChoice $Task $Account $Model
  $prof = $c.profile; $m = $c.model; $prov = [string]$prof.provider
  $exe = Find-AiExe $prov
  if (-not $exe) { throw "$prov CLI not found on this computer." }
  $env1 = Get-ProfileEnv $prof
  $out = [pscustomobject]@{ text = ''; structured = $null; costUsd = $null; sessionId = $null; provider = $prov; model = $m; account = $prof.label }
  switch ($prov) {
    'claude' {
      $a = @('-p', '--output-format', 'json', '--tools', 'WebSearch,WebFetch', '--allowedTools', 'WebSearch,WebFetch', '--permission-prompts', 'none')
      if ($m) { $a += @('--model', $m) }
      if ($Effort) { $a += @('--effort', $Effort) }
      if ($SchemaPath) { $a += @('--json-schema', ([IO.File]::ReadAllText($SchemaPath, $Utf8) | ConvertFrom-Json | ConvertTo-Json -Depth 20 -Compress)) }
      if ($System) { $a += @('--system-prompt', $System) }
      if ($SessionId) { $a += @('--resume', $SessionId) } elseif ($Task -ne 'chat') { $a += '--no-session-persistence' }
      $p = Start-AiProcess $exe $a $Prompt $env1
      $raw = $p.StandardOutput.ReadToEnd(); $p.WaitForExit()
      $r = $null; try { $r = $raw | ConvertFrom-Json } catch {}
      if (-not $r) { throw "Claude returned no JSON (exit $($p.ExitCode)): $($raw.Substring(0, [math]::Min(300, $raw.Length))) $(Get-AiError $p)" }
      if ($r.is_error) { throw "Claude error: $($r.result)" }
      $out.text = [string]$r.result; $out.structured = $r.structured_output; $out.costUsd = $r.total_cost_usd; $out.sessionId = $r.session_id
    }
    'codex' {
      $a = @('--search', 'exec')
      if ($SessionId) { $a += @('resume', $SessionId) }
      $a += @('--skip-git-repo-check', '-s', 'read-only', '--json')
      if ($m) { $a += @('-m', $m) }
      if ($Effort) { $a += @('-c', "model_reasoning_effort=$(if ($Effort -in 'xhigh', 'max') { 'high' } else { $Effort })") }
      if ($SchemaPath -and -not $SessionId) { $a += @('--output-schema', $SchemaPath) }
      $a += '-'
      $p = Start-AiProcess $exe $a ($(if ($System) { "$System`n`n" } else { '' }) + $Prompt) $env1
      $raw = $p.StandardOutput.ReadToEnd(); $p.WaitForExit()
      foreach ($line in ($raw -split "`n")) {
        if (-not $line.Trim().StartsWith('{')) { continue }
        try { $ev = $line | ConvertFrom-Json } catch { continue }
        if ($ev.type -eq 'thread.started') { $out.sessionId = $ev.thread_id }
        elseif ($ev.type -eq 'item.completed' -and $ev.item.type -eq 'agent_message') { $out.text = [string]$ev.item.text }
        elseif ($ev.type -in 'error', 'turn.failed') { throw "Codex error: $(if ($ev.message) { $ev.message } else { $ev.error.message })" }
      }
      if (-not $out.text) { throw "Codex returned no answer (exit $($p.ExitCode)): $(Get-AiError $p)" }
    }
    'antigravity' {
      $a = @('--output-format', 'json', '--mode', 'plan')
      if ($m) { $a += @('--model', $m) }
      if ($Effort) { $a += @('--effort', $Effort) }
      if ($SchemaPath) { $a += @('--json-schema', $SchemaPath) }
      if ($SessionId) { $a += @('--conversation', $SessionId) }
      # Headless agy cannot ask for shell permission: keep it to web search / page reading, and ask for publisher links.
      $rules = 'Tool rules: use only web search and web page reading. Never run shell commands and never read or write local files. For every source give the original publisher URL, not a search redirect link.'
      $a += ('-p=' + $rules + "`n`n" + $(if ($System) { "$System`n`n" } else { '' }) + $Prompt)
      $p = Start-AiProcess $exe $a '' $env1
      $raw = $p.StandardOutput.ReadToEnd(); $p.WaitForExit()
      $r = $null; try { $r = $raw | ConvertFrom-Json } catch {}
      if (-not $r) { throw "Antigravity returned no JSON (exit $($p.ExitCode)): $($raw.Substring(0, [math]::Min(300, $raw.Length))) $(Get-AiError $p)" }
      if ($r.status -ne 'SUCCESS') { throw "Antigravity error: $($r.status) $($r.error) $($r.response)" }
      $out.text = [string]$r.response; $out.structured = $r.structured_output; $out.sessionId = $r.conversation_id
    }
    default { throw "Unknown provider $prov" }
  }
  if ($SchemaPath -and -not $out.structured -and $out.text) {
    $s = $out.text.IndexOf('{'); $e = $out.text.LastIndexOf('}')
    if ($s -ge 0 -and $e -gt $s) { try { $out.structured = $out.text.Substring($s, $e - $s + 1) | ConvertFrom-Json } catch {} }
  }
  return $out
}
# Signed-in status of one profile (no secrets read).
function Get-ProfileStatus($prof) {
  $ErrorActionPreference = 'Continue'   # CLIs print progress on stderr
  $exe = Find-AiExe $prof.provider
  $st = [ordered]@{ id = $prof.id; installed = [bool]$exe; signedIn = $false; account = '' }
  if (-not $exe) { return $st }
  $envs = Get-ProfileEnv $prof
  $saved = @{}; foreach ($k in $envs.Keys) { $saved[$k] = [Environment]::GetEnvironmentVariable($k); [Environment]::SetEnvironmentVariable($k, $envs[$k]) }
  try {
    switch ($prof.provider) {
      'claude' { $j = & $exe auth status 2>$null | Out-String | ConvertFrom-Json; $st.signedIn = [bool]$j.loggedIn; $st.account = (@($j.email, $j.orgName) | Where-Object { $_ }) -join ' - ' }
      'codex' { $t = ((& $exe login status 2>&1 | ForEach-Object { "$_" }) -join ' ').Trim(); $st.signedIn = $t -match '(?i)logged in' -and $t -notmatch '(?i)not logged in'; $st.account = $t }
      'antigravity' { $t = ((& $exe models 2>&1 | ForEach-Object { "$_" }) -join "`n"); $st.signedIn = $t -match 'gemini'; $st.account = if ($st.signedIn) { 'Google account (signed in to Antigravity)' } else { '' } }
    }
  } catch {} finally { foreach ($k in $saved.Keys) { [Environment]::SetEnvironmentVariable($k, $saved[$k]) } }
  return $st
}
function Get-ProviderModels([string]$provider) {
  $ErrorActionPreference = 'Continue'
  switch ($provider) {
    'claude' { return $ProviderModels.claude }
    'antigravity' { $exe = Find-AiExe 'antigravity'; if (-not $exe) { return @('') }; return @('') + @((& $exe models 2>$null) | Where-Object { $_ -match '^\S+\t' } | ForEach-Object { ($_ -split "`t")[0] }) }
    'codex' {
      $f = "$env:USERPROFILE\.codex\models_cache.json"; $ms = @('')
      if (Test-Path $f) { try { $j = [IO.File]::ReadAllText($f, $Utf8) | ConvertFrom-Json; $ms += @($j.models | ForEach-Object { if ($_.slug) { $_.slug } elseif ($_.id) { $_.id } }) } catch {} }
      return @($ms | Select-Object -Unique)
    }
  }
  return @('')
}
# Usage-limit / rate-limit messages from any provider: stop instead of retrying.
function Test-LimitError([string]$msg) {
  return $msg -match '(?i)(usage|rate)[ _-]?limit|limit (reached|exceeded|resets)|hit your limit|quota|\b429\b|overloaded|out of (extra )?usage|extra usage|credit balance|too many requests|resource[_ ]exhausted|insufficient_quota'
}

function Get-ClaudeAuth {
  $exe = Find-Claude
  if (-not $exe) { return [pscustomobject]@{ found = $false; loggedIn = $false; path = $null } }
  try {
    $j = & $exe auth status 2>$null | Out-String | ConvertFrom-Json
    return [pscustomobject]@{ found = $true; loggedIn = [bool]$j.loggedIn; method = $j.authMethod; path = $exe }
  } catch { return [pscustomobject]@{ found = $true; loggedIn = $false; path = $exe } }
}

# Read one company's basics from the CO table in the HTML.
function Get-Company([string]$Ticker) {
  $html = [IO.File]::ReadAllText($AiHtml, $Utf8)
  $m = [regex]::Match($html, "(?m)^\s*$([regex]::Escape($Ticker)):\{(?:label:'[^']*',\s*)?name:'([^']+)',\s*tv:'([^']+)'")
  if (-not $m.Success) { return $null }
  $chunk = $html.Substring($m.Index, [math]::Min(4000, $html.Length - $m.Index))
  $get = { param($k) $x = [regex]::Match($chunk, "\b$k\s*:\s*'((?:[^'\\]|\\.)*)'"); if ($x.Success) { $x.Groups[1].Value } else { '' } }
  # AI-opportunity sub-scores live in the OPP table: TICKER:[exp,mkt,pos,bot,opt]
  $opp = $null
  $os = $html.IndexOf('const OPP = {')
  if ($os -ge 0) {
    $ob = $html.Substring($os, $html.IndexOf('};', $os) - $os)
    $om = [regex]::Match($ob, "\b$([regex]::Escape($Ticker)):\[(\d+),(\d+),(\d+),(\d+),(\d+)\]")
    if ($om.Success) { $opp = @(1..5 | ForEach-Object { [int]$om.Groups[$_].Value }) }
  }
  # Revenue-mix estimate lives in the MIX table: TICKER:['FY2025', ['label','label_th',pct,tag], ...]
  $mix = ''
  $ms = $html.IndexOf('const MIX = {')
  if ($ms -ge 0) {
    $mb = $html.Substring($ms, $html.IndexOf('};', $ms) - $ms)
    $mm = [regex]::Match($mb, "(?m)^\s*$([regex]::Escape($Ticker)):\['([^']*)'(.*)\],?\s*$")
    if ($mm.Success) {
      $tags = @{ '2' = 'ai'; '1' = 'partly'; '0' = 'none' }
      $parts = [regex]::Matches($mm.Groups[2].Value, "\['((?:[^'\\]|\\.)*)','(?:[^'\\]|\\.)*',(\d+),(\d)\]") | ForEach-Object { "$($_.Groups[1].Value) $($_.Groups[2].Value)% ($($tags[$_.Groups[3].Value]))" }
      $mix = "$($mm.Groups[1].Value): " + $(if ($parts) { $parts -join '; ' } else { 'no revenue yet' })
    }
  }
  [pscustomobject]@{
    ticker = $Ticker; name = $m.Groups[1].Value; tv = $m.Groups[2].Value
    moat = (& $get 'moat'); does = (& $get 'does'); opp = $opp; mix = $mix
  }
}

function Write-JobStatus([string]$Ticker, [string]$State, [string]$Message) {
  if (-not (Test-Path $AiJobs)) { New-Item -ItemType Directory -Force $AiJobs | Out-Null }
  $o = [ordered]@{ ticker = $Ticker; state = $State; message = $Message; pid = $PID; at = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ') }
  [IO.File]::WriteAllText((Join-Path $AiJobs "$Ticker.json"), ($o | ConvertTo-Json -Compress), $Utf8)
}
