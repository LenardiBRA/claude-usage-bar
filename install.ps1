# Instala a barra de uso do Claude Code (Windows / PowerShell).
# irm https://raw.githubusercontent.com/LenardiBRA/claude-usage-bar/main/install.ps1 | iex
$ErrorActionPreference = 'Stop'

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error 'Node.js não encontrado. Instale em https://nodejs.org e rode de novo.'
  return
}

$base = 'https://raw.githubusercontent.com/LenardiBRA/claude-usage-bar/main'
$dir = Join-Path $HOME '.claude'
New-Item -ItemType Directory -Force $dir | Out-Null

$script = Join-Path $dir 'statusline.js'
$configure = Join-Path ([IO.Path]::GetTempPath()) 'claude-usage-bar-configure.js'

Invoke-WebRequest "$base/statusline.js" -OutFile $script -UseBasicParsing
Invoke-WebRequest "$base/configure.js" -OutFile $configure -UseBasicParsing

node $configure $script
Remove-Item $configure -Force

Write-Host 'Pronto. Abra uma nova sessão do Claude Code para ver a barra.'
