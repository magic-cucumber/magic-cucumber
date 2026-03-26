import {type TerminalAction} from "../terminal.ts";

const whoami: TerminalAction = (rawCommand, sender) => {
    if (rawCommand.trim() !== 'whoami') {
        return false
    }
    sender('886kagg')
    return true
}

export default whoami
