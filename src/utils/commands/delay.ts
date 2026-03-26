import {type TerminalAction} from "../terminal.ts";

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

const delay: TerminalAction = async (rawCommand, sender) => {
    const [command = '', ...args] = rawCommand.trim().split(/\s+/)
    if (command !== 'delay') {
        return false
    }
    sender('waiting...')
    await wait(3000)
    sender(args.join(' ') || 'done')
    return true
}

export default delay
