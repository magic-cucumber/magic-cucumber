import {type TerminalAction} from "@/utils/terminal.ts";

type ResetOptions = {
    reset: () => void
}

export default function clear(options: ResetOptions): TerminalAction {
    return (command) => {
        if (command.trim() !== 'reset') {
            return
        }
        options.reset()
        return true
    }
}
