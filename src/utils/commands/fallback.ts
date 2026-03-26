import {type TerminalAction} from "../terminal.ts";

const fallback: TerminalAction = (rawCommand, sender) => {
    const [command = ''] = rawCommand.trim().split(/\s+/)
    if (!command) {
        return true
    }
    sender(`zsh: command not found: ${command}`)
    return true
}

export default fallback
