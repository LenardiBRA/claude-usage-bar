// Claude Code status line: modelo · esforço, e barras de uso 5h / 7d com tempo até o reset.
// Uma linha só. Cada barra tem sua própria cor (verde → amarelo → vermelho) pelo próprio %.

let raw = ''
process.stdin.on('data', d => (raw += d))
process.stdin.on('end', () => {
  let input
  try {
    input = JSON.parse(raw)
  } catch {
    return
  }
  process.stdout.write(line(input))
})

const RESET = '\x1b[0m'
const DIM = '\x1b[2m'
const EMPTY = '\x1b[38;2;70;70;70m'
const WIDTH = 10
const PARTIALS = ['', '▏', '▎', '▍', '▌', '▋', '▊', '▉']

// Pontos do degradê: [percentual, [r, g, b]]
const STOPS = [
  [0, [80, 200, 120]],
  [50, [230, 200, 60]],
  [75, [240, 140, 50]],
  [90, [230, 60, 60]],
]

const rgb = pct => {
  const p = Math.max(0, Math.min(100, pct))
  let i = STOPS.length - 1
  while (i > 0 && STOPS[i][0] > p) i--
  const [p0, c0] = STOPS[i]
  const [p1, c1] = STOPS[Math.min(i + 1, STOPS.length - 1)]
  const t = p1 === p0 ? 0 : (p - p0) / (p1 - p0)
  const [r, g, b] = c0.map((v, k) => Math.round(v + (c1[k] - v) * Math.min(1, t)))
  return `\x1b[38;2;${r};${g};${b}m`
}

const bar = pct => {
  const eighths = Math.round((Math.max(0, Math.min(100, pct)) / 100) * WIDTH * 8)
  const full = Math.floor(eighths / 8)
  const part = PARTIALS[eighths % 8]
  const used = '█'.repeat(full) + part
  const empty = '░'.repeat(WIDTH - full - (part ? 1 : 0))
  return `${used}${EMPTY}${empty}`
}

const timeLeft = resetsAt => {
  if (resetsAt == null || resetsAt === '') return ''
  const ms = typeof resetsAt === 'number'
    ? resetsAt * (resetsAt < 1e12 ? 1000 : 1) - Date.now()
    : new Date(resetsAt).getTime() - Date.now()
  if (!Number.isFinite(ms)) return ''
  const min = Math.max(0, Math.round(ms / 60000))
  if (min < 60) return `${min}m`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d ${h % 24}h`
}

const usage = (label, w) => {
  const pct = Number(w?.used_percentage)
  if (!Number.isFinite(pct)) return ''
  const color = rgb(pct)
  const left = timeLeft(w.resets_at)
  return `${DIM}${label}${RESET} ${color}${bar(pct)}${RESET} ${color}${Math.round(pct)}%${left ? ' ' + left : ''}${RESET}`
}

const line = input => {
  const model = input?.model?.display_name
  const effort = input?.effort?.level
  const head = [model, effort].filter(Boolean).join(' · ')
  const parts = [
    head && `${DIM}${head}${RESET}`,
    usage('5h', input?.rate_limits?.five_hour),
    usage('7d', input?.rate_limits?.seven_day),
  ].filter(Boolean)
  return parts.join('   ')
}
