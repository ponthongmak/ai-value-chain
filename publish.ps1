<#
  publish.ps1 — check this folder for personal data before you commit and push it with GitHub Desktop.
  This folder is the git repository (ponthongmak/ai-value-chain). Local-only files are kept out by .gitignore:
  ai-accounts.json, logs\, analysis\.jobs\, _site\.

  Usage:  powershell -NoProfile -ExecutionPolicy Bypass -File publish.ps1
  Then:   GitHub Desktop -> write a summary -> Commit to main -> Push origin.
#>
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$skipDir = '\\(\.git|logs|_site)\\|\\analysis\\\.jobs\\'
$skipFile = @('ai-accounts.json', 'publish.ps1', 'settings.local.json')
$patterns = @('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}', 'C:\\Users\\', 'G:\\My Drive', 'AppData\\')
$allow = @('noreply@github.com')
$files = Get-ChildItem $root -Recurse -File -Include *.html, *.js, *.json, *.ps1, *.md, *.cmd, *.yml |
  Where-Object { $_.FullName -notmatch $skipDir -and $skipFile -notcontains $_.Name }
$hits = $files | ForEach-Object {
  $f = $_; $txt = [IO.File]::ReadAllText($f.FullName)
  foreach ($p in $patterns) { foreach ($m in [regex]::Matches($txt, $p)) { if ($allow -notcontains $m.Value) { "$($f.FullName.Substring($root.Length + 1)): $($m.Value)" } } }
} | Select-Object -Unique
if ($hits) {
  Write-Host 'Possible personal data found - fix before pushing:' -ForegroundColor Yellow
  $hits | Select-Object -First 30 | ForEach-Object { Write-Host "  $_" }
  exit 1
}
Write-Host "Checked $($files.Count) files: no personal data found." -ForegroundColor Green
Write-Host 'Next: GitHub Desktop -> write a summary -> Commit to main -> Push origin.'
