<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { FitAddon } from '@xterm/addon-fit'
import { Terminal } from '@xterm/xterm'
import type { IDisposable } from '@xterm/xterm'
import '@xterm/xterm/css/xterm.css'

const terminalHost = ref<HTMLElement | null>(null)

const prompt = '(base) 886kagg@Ciallo ~ % '
const ansi = {
  reset: '\x1b[0m',
  green: '\x1b[92m',
  lime: '\x1b[38;5;118m',
  yellow: '\x1b[38;5;184m',
  orange: '\x1b[38;5;214m',
  red: '\x1b[38;5;203m',
  magenta: '\x1b[38;5;201m',
  purple: '\x1b[38;5;99m',
  blue: '\x1b[38;5;63m',
  white: '\x1b[97m',
  dim: '\x1b[90m',
  bold: '\x1b[1m',
  bgBlack: '\x1b[48;5;240m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
} as const
const color = (value: string, ...tokens: string[]) =>
  `${tokens.join('')}${value}${ansi.reset}`
const visiblePrompt = color(prompt, ansi.bold, ansi.green)
const visiblePromptWithCommand = (command: string) =>
  `${visiblePrompt}${color(command, ansi.bold, ansi.green)}`
const fastfetchLines = [
  `${color("                     ..'", ansi.lime)}          ${color('886kagg@Ciallo', ansi.bold, ansi.lime)}`,
  `${color('                 ,xNMM.', ansi.lime)}           ${color('--------------', ansi.bold, ansi.lime)}`,
  `${color('               .OMMMMo', ansi.lime)}            ${color('OS', ansi.bold, ansi.yellow)}: ${color('macOS Tahoe 26.4 (25E246) arm64', ansi.bold, ansi.lime)}`,
  `${color('               lMM"', ansi.lime)}               ${color('Host', ansi.bold, ansi.yellow)}: ${color('MacBook Air (15-inch, M4, 2025)', ansi.bold, ansi.lime)}`,
  `${color('     .;loddo:.  .olloddol;.', ansi.lime)}       ${color('Kernel', ansi.bold, ansi.yellow)}: ${color('Darwin 25.4.0', ansi.bold, ansi.lime)}`,
  `${color('   cKMMMMMMMMMMNWMMMMMMMMMM0:', ansi.lime)}     ${color('Uptime', ansi.bold, ansi.yellow)}: ${color('1 day, 8 hours, 20 mins', ansi.bold, ansi.lime)}`,
  `${color(' .KMMMMMMMMMMMMMMMMMMMMMMMWd.', ansi.yellow)}     ${color('Packages', ansi.bold, ansi.yellow)}: ${color('140 (brew), 10 (brew-cask)', ansi.bold, ansi.lime)}`,
  `${color(' XMMMMMMMMMMMMMMMMMMMMMMMX.', ansi.yellow)}       ${color('Shell', ansi.bold, ansi.yellow)}: ${color('zsh 5.9', ansi.bold, ansi.lime)}`,
  `${color(';MMMMMMMMMMMMMMMMMMMMMMMM:', ansi.red)}        ${color('Display (Color LCD)', ansi.bold, ansi.yellow)}: ${color('3420x2214 @ 2x in 15", 60', ansi.bold, ansi.lime)}`,
  `${color(':MMMMMMMMMMMMMMMMMMMMMMMM:', ansi.red)}        ${color('WM', ansi.bold, ansi.yellow)}: ${color('Quartz Compositor 1.600.0', ansi.bold, ansi.lime)}`,
  `${color('.MMMMMMMMMMMMMMMMMMMMMMMX.', ansi.red)}       ${color('WM Theme', ansi.bold, ansi.yellow)}: ${color('Multicolor (Light)', ansi.bold, ansi.lime)}`,
  `${color(' kMMMMMMMMMMMMMMMMMMMMMMMMWd.', ansi.red)}     ${color('Theme', ansi.bold, ansi.yellow)}: ${color('Liquid Glass', ansi.bold, ansi.lime)}`,
  `${color(" 'XMMMMMMMMMMMMMMMMMMMMMMMMMMk", ansi.magenta)}    ${color('Font', ansi.bold, ansi.yellow)}: ${color('.AppleSystemUIFont [System], Helvetica [', ansi.bold, ansi.lime)}`,
  `${color("  'XMMMMMMMMMMMMMMMMMMMMMMMMK.", ansi.magenta)}    ${color('Cursor', ansi.bold, ansi.yellow)}: ${color('Fill - Black, Outline - White (32px)', ansi.bold, ansi.lime)}`,
  `${color('    kMMMMMMMMMMMMMMMMMMMMMMd', ansi.purple)}      ${color('Terminal', ansi.bold, ansi.yellow)}: ${color('Apple Terminal 470', ansi.bold, ansi.lime)}`,
  `${color('     ;KMMMMMMMWXXWMMMMMMMk.', ansi.blue)}       ${color('Terminal Font', ansi.bold, ansi.yellow)}: ${color('AndaleMono (12pt)', ansi.bold, ansi.lime)}`,
  `${color(`       "cooc*"    "*coo'"`, ansi.blue)}         ${color('CPU', ansi.bold, ansi.yellow)}: ${color('Apple M4 (10) @ 4.46 GHz', ansi.bold, ansi.lime)}`,
  `${' '.repeat(34)}${color('GPU', ansi.bold, ansi.yellow)}: ${color('Apple M4 (10) @ 1.47 GHz [Integrated]', ansi.bold, ansi.lime)}`,
  `${' '.repeat(34)}${color('Memory', ansi.bold, ansi.yellow)}: ${color('20.86 GiB / 24.00 GiB ', ansi.bold, ansi.lime)}${color('(87%)', ansi.bold, ansi.red)}`,
  `${' '.repeat(34)}${color('Swap', ansi.bold, ansi.yellow)}: ${color('7.08 GiB / 8.00 GiB ', ansi.bold, ansi.lime)}${color('(88%)', ansi.bold, ansi.red)}`,
  `${' '.repeat(34)}${color('Disk (/)', ansi.bold, ansi.yellow)}: ${color('381.09 GiB / 460.43 GiB ', ansi.bold, ansi.lime)}${color('(83%)', ansi.bold, ansi.red)}${color(' - apfs', ansi.bold, ansi.lime)}`,
  `${' '.repeat(34)}${color('Battery (bq40z651)', ansi.bold, ansi.yellow)}: ${color('100% [AC connected]', ansi.bold, ansi.lime)}`,
  `${' '.repeat(34)}${color('Power Adapter', ansi.bold, ansi.yellow)}: ${color('35W USB-C Power Adapter', ansi.bold, ansi.lime)}`,
  `${' '.repeat(34)}${color('Locale', ansi.bold, ansi.yellow)}: ${color('zh_CN.UTF-8', ansi.bold, ansi.lime)}`,
]
const colorBars = `${' '.repeat(34)}${color('   ', ansi.bgBlack)}${color('   ', ansi.bgRed)}${color('   ', ansi.bgGreen)}${color('   ', ansi.bgYellow)}${color('   ', ansi.bgBlue)}${color('   ', ansi.bgMagenta)}${color('   ', ansi.bgCyan)}${color('   ', ansi.bgWhite)}`

let terminal: Terminal | null = null
let fitAddon: FitAddon | null = null
let inputBuffer = ''
let cursorIndex = 0
let historyIndex = 0
const commandHistory: string[] = []
const disposables: IDisposable[] = []

const fitTerminal = () => {
  fitAddon?.fit()
}

const focusTerminal = () => {
  terminal?.focus()
}

const writeLine = (line = '') => {
  terminal?.writeln(line)
}

const clearScreen = () => {
  terminal?.clear()
}

const printFastfetch = () => {
  for (const line of fastfetchLines) {
    writeLine(line)
  }
  writeLine()
  writeLine(colorBars)
  writeLine()
}

const writePrompt = () => {
  terminal?.write(visiblePrompt)
}

const renderInput = () => {
  if (!terminal) {
    return
  }

  terminal.write('\r\x1b[2K')
  terminal.write(visiblePrompt + color(inputBuffer, ansi.bold, ansi.green))

  const offset = inputBuffer.length - cursorIndex
  if (offset > 0) {
    terminal.write(`\x1b[${offset}D`)
  }
}

const resetInput = () => {
  inputBuffer = ''
  cursorIndex = 0
  historyIndex = commandHistory.length
}

const startPrompt = () => {
  resetInput()
  writePrompt()
}

const printCommandOutput = (command: string, args: string[]) => {
  switch (command) {
    case '':
      return
    case 'help':
      writeLine('Available commands: fastfetch, clear, help, echo, pwd, whoami, uname, date')
      return
    case 'fastfetch':
      printFastfetch()
      return
    case 'clear':
      clearScreen()
      return
    case 'echo':
      writeLine(args.join(' '))
      return
    case 'pwd':
      writeLine('/Users/886kagg')
      return
    case 'whoami':
      writeLine('886kagg')
      return
    case 'uname':
      writeLine('Darwin Ciallo 25.4.0 arm64')
      return
    case 'date':
      writeLine(new Intl.DateTimeFormat('zh-CN', {
        dateStyle: 'full',
        timeStyle: 'medium',
      }).format(new Date()))
      return
    default:
      writeLine(`zsh: command not found: ${command}`)
  }
}

const runCommand = () => {
  const raw = inputBuffer
  writeLine()

  const trimmed = raw.trim()
  if (trimmed) {
    commandHistory.push(trimmed)
  }

  const [command = '', ...args] = trimmed.split(/\s+/)
  printCommandOutput(command, args)
  startPrompt()
}

const replaceBufferFromHistory = (nextHistoryIndex: number) => {
  if (nextHistoryIndex < 0 || nextHistoryIndex > commandHistory.length) {
    return
  }

  historyIndex = nextHistoryIndex
  inputBuffer = commandHistory[historyIndex] ?? ''
  cursorIndex = inputBuffer.length
  renderInput()
}

const handleArrowKey = (sequence: string) => {
  switch (sequence) {
    case '\x1b[A':
      replaceBufferFromHistory(Math.max(0, historyIndex - 1))
      return
    case '\x1b[B':
      replaceBufferFromHistory(Math.min(commandHistory.length, historyIndex + 1))
      return
    case '\x1b[C':
      cursorIndex = Math.min(inputBuffer.length, cursorIndex + 1)
      renderInput()
      return
    case '\x1b[D':
      cursorIndex = Math.max(0, cursorIndex - 1)
      renderInput()
      return
    case '\x1b[H':
    case '\x1b[1~':
      cursorIndex = 0
      renderInput()
      return
    case '\x1b[F':
    case '\x1b[4~':
      cursorIndex = inputBuffer.length
      renderInput()
  }
}

const handleInput = (data: string) => {
  if (!terminal) {
    return
  }

  if (data.startsWith('\x1b[')) {
    handleArrowKey(data)
    return
  }

  switch (data) {
    case '\r':
      runCommand()
      return
    case '\u0003':
      writeLine('^C')
      startPrompt()
      return
    case '\u000c':
      clearScreen()
      startPrompt()
      return
    case '\u007f':
      if (cursorIndex === 0) {
        return
      }
      inputBuffer =
        inputBuffer.slice(0, cursorIndex - 1) + inputBuffer.slice(cursorIndex)
      cursorIndex -= 1
      renderInput()
      return
    case '\t':
      return
    default:
      break
  }

  if (data >= ' ' && data !== '\u007f') {
    inputBuffer =
      inputBuffer.slice(0, cursorIndex) + data + inputBuffer.slice(cursorIndex)
    cursorIndex += data.length
    renderInput()
  }
}

onMounted(() => {
  if (!terminalHost.value) {
    return
  }

  fitAddon = new FitAddon()
  terminal = new Terminal({
    allowProposedApi: false,
    convertEol: true,
    cursorBlink: true,
    fontFamily: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
    fontSize: 16,
    lineHeight: 1.35,
    letterSpacing: 0.2,
    theme: {
      background: '#04131d',
      foreground: '#d8f3ff',
      cursor: '#7ef9c6',
      selectionBackground: 'rgba(126, 249, 198, 0.28)',
      black: '#08202f',
      red: '#ff7b72',
      green: '#7ef9c6',
      yellow: '#ffe27a',
      blue: '#6ec1ff',
      magenta: '#7a8cff',
      cyan: '#73f0ff',
      white: '#d8f3ff',
      brightBlack: '#426579',
      brightRed: '#ff938b',
      brightGreen: '#a4ffd9',
      brightYellow: '#fff0a9',
      brightBlue: '#98d5ff',
      brightMagenta: '#a9b4ff',
      brightCyan: '#9ef6ff',
      brightWhite: '#f5fdff',
    },
  })

  terminal.loadAddon(fitAddon)
  terminal.open(terminalHost.value)

  disposables.push(terminal.onData(handleInput))
  terminalHost.value.addEventListener('click', focusTerminal)

  requestAnimationFrame(() => {
    fitTerminal()
    writeLine(color('Last login: Thu Mar 26 17:46:01 on ttys001', ansi.bold, ansi.green))
    terminal?.write(visiblePromptWithCommand('fastfetch'))
    writeLine()
    printFastfetch()
    startPrompt()
    focusTerminal()
  })

  window.addEventListener('resize', fitTerminal)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', fitTerminal)
  terminalHost.value?.removeEventListener('click', focusTerminal)
  for (const disposable of disposables) {
    disposable.dispose()
  }
  disposables.length = 0
  terminal?.dispose()
  terminal = null
  fitAddon = null
})
</script>

<template>
  <main class="terminal-shell">
    <section class="terminal-frame">
      <header class="terminal-bar">
        <div class="traffic-lights" aria-hidden="true">
          <span class="traffic-light close"></span>
          <span class="traffic-light minimize"></span>
          <span class="traffic-light maximize"></span>
        </div>
        <p class="terminal-title">magic-cucumber terminal</p>
      </header>
      <div ref="terminalHost" class="terminal-screen" aria-label="Terminal UI"></div>
    </section>
  </main>
</template>
