import {type TerminalAction} from "@/utils/terminal.ts";

const date: TerminalAction = (rawCommand, sender) => {
    if (rawCommand.trim() !== 'date') {
        return false
    }
    sender(new Intl.DateTimeFormat('zh-CN', {
        dateStyle: 'full',
        timeStyle: 'medium',
    }).format(new Date()))
    return true
}

export default date
