import {type TerminalAction} from "../terminal.ts";

const pwd: TerminalAction = (rawCommand, sender) => {
    if (rawCommand.trim() !== 'pwd') {
        return false
    }
    sender('/Users/886kagg')
    return true
}

export default pwd
