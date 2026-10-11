#!/usr/bin/env bash
# Instala a barra de uso do Claude Code (macOS / Linux / Git Bash).
# curl -fsSL https://raw.githubusercontent.com/LenardiBRA/claude-usage-bar/main/install.sh | bash
set -euo pipefail

if ! command -v node >/dev/null 2>&1; then
  echo 'Node.js não encontrado. Instale em https://nodejs.org e rode de novo.' >&2
  exit 1
fi

base='https://raw.githubusercontent.com/LenardiBRA/claude-usage-bar/main'
dir="$HOME/.claude"
mkdir -p "$dir"

script="$dir/statusline.js"
configure="$(mktemp)"
trap 'rm -f "$configure"' EXIT

curl -fsSL "$base/statusline.js" -o "$script"
curl -fsSL "$base/configure.js" -o "$configure"

node "$configure" "$script"

echo 'Pronto. Abra uma nova sessão do Claude Code para ver a barra.'
