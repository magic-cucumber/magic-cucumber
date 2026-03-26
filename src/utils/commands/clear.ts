import {type TerminalAction} from "../terminal.ts";

type ClearOptions = {
    clear: () => void
}

export default function clear(options: ClearOptions): TerminalAction {
    return (rawCommand) => {
        if (rawCommand.trim() !== 'clear') {
            return false
        }
        options.clear()
        return true
    }
}
