export type TerminalSender = (chunk: string) => void

// 返回false证明该函数不处理, 交给下一个函数处理
export type TerminalActionResult = boolean | Promise<boolean> | void | Promise<void>

export type TerminalAction = (command: string, sender: TerminalSender) => TerminalActionResult

const normalizeLineBreaks = (value: string) => value.replace(/\r\n?/g, '\n')

export const splitTerminalText = (value: string) => normalizeLineBreaks(value).split('\n')
