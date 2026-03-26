import {type TerminalAction} from "../terminal.ts";

const empty: TerminalAction = (rawCommand) => {
    return rawCommand.trim() === ''
}

export default empty
