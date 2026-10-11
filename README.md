# claude-usage-bar

Status line minimalista para o Claude Code, numa linha só:

```
Opus 5.5 · medium   5h ███▎░░░░░░ 32% 2h   7d ████▊░░░░░ 48% 4d 2h
```

- modelo e esforço em uso
- barras de uso de 5 horas e 7 dias, cada uma com sua própria cor (verde → amarelo → laranja → vermelho conforme se aproxima do limite)
- percentual e tempo até o reset (`40m`, `2h`, `4d 2h`)

Requer [Node.js](https://nodejs.org) instalado.

## Instalar

**Windows (PowerShell):**

```powershell
irm https://raw.githubusercontent.com/LenardiBRA/claude-usage-bar/main/install.ps1 | iex
```

**macOS / Linux / Git Bash:**

```bash
curl -fsSL https://raw.githubusercontent.com/LenardiBRA/claude-usage-bar/main/install.sh | bash
```

O instalador copia `statusline.js` para `~/.claude/` e ajusta o `statusLine` em `~/.claude/settings.json` (guardando um backup em `settings.json.bak`). Vale para todas as sessões novas do Claude Code.

## Atualizar

Rode o mesmo comando de instalação de novo.

## Remover

Apague `~/.claude/statusline.js` e o bloco `statusLine` de `~/.claude/settings.json`.
