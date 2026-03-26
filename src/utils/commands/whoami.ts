import {type TerminalAction} from "@/utils/terminal.ts";

const whoami: TerminalAction = (rawCommand, sender) => {
    if (rawCommand.trim() !== 'whoami') {
        return false
    }
    sender('886kagg')
    return true
}

export default whoami
