export type TerminalSender = (chunk: string) => void

export type TerminalAction = (command: string, sender: TerminalSender) => void | Promise<void>

export const ansi = {
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

export const color = (value: string, ...tokens: string[]) =>
  `${tokens.join('')}${value}${ansi.reset}`

const normalizeLineBreaks = (value: string) => value.replace(/\r\n?/g, '\n')

export const splitTerminalText = (value: string) => normalizeLineBreaks(value).split('\n')
