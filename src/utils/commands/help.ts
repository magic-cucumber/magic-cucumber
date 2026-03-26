import {type TerminalAction} from "../terminal.ts";

const help: TerminalAction = (rawCommand, sender) => {
    if (rawCommand.trim() !== 'help') {
        return false
    }
    sender('Available commands: fastfetch, clear, help, echo, pwd, whoami, uname, date, delay')
    return true
}

export default help
