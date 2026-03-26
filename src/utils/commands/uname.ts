import {type TerminalAction} from "@/utils/terminal.ts";

const uname: TerminalAction = (rawCommand, sender) => {
    if (rawCommand.trim() !== 'uname') {
        return false
    }
    sender('Darwin Ciallo.local 25.4.0 Darwin Kernel Version 25.4.0: Thu Mar 26 17:46:01 PDT 2026; root:xnu-12377.101.15~1/RELEASE_ARM64_T8132 arm64')
    return true
}

export default uname
