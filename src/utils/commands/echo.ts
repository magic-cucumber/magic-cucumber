import {type TerminalAction} from "../terminal.ts";

const echo: TerminalAction = (rawCommand, sender) => {
    const [command = '', ...args] = rawCommand.trim().split(/\s+/)
    if (command !== 'echo') {
        return false
    }
    sender(args.join(' '))
    return true
}

export default echo
