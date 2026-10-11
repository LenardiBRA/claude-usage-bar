// Aponta o statusLine do ~/.claude/settings.json para o statusline.js instalado.
// Uso: node configure.js <caminho do statusline.js>
const fs = require('fs')
const os = require('os')
const path = require('path')

const script = process.argv[2]
if (!script) {
  console.error('uso: node configure.js <caminho do statusline.js>')
  process.exit(1)
}

const dir = path.join(os.homedir(), '.claude')
const file = path.join(dir, 'settings.json')
fs.mkdirSync(dir, { recursive: true })

let settings = {}
if (fs.existsSync(file)) {
  const raw = fs.readFileSync(file, 'utf8')
  try {
    settings = raw.trim() ? JSON.parse(raw) : {}
  } catch {
    console.error(`Não consegui ler ${file} (JSON inválido). Nada foi alterado.`)
    process.exit(1)
  }
  fs.copyFileSync(file, `${file}.bak`)
}

settings.statusLine = {
  type: 'command',
  command: `node "${script.split(path.sep).join('/')}"`,
}

fs.writeFileSync(file, JSON.stringify(settings, null, 2) + '\n')
console.log(`statusLine configurado em ${file}`)
