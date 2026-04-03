import {ansi, color, type TerminalAction} from "@/utils/terminal.ts";

const help: TerminalAction = (rawCommand, sender) => {
    if (rawCommand.trim() !== 'help') {
        return
    }
    const rainbowDivider = [
        color('━━', ansi.red, ansi.bold),
        color('━━', ansi.orange, ansi.bold),
        color('━━', ansi.yellow, ansi.bold),
        color('━━', ansi.green, ansi.bold),
        color('━━', ansi.blue, ansi.bold),
        color('━━', ansi.purple, ansi.bold),
        color('━━', ansi.magenta, ansi.bold),
    ].join('')

    sender([
        color(' ✨ HELP ✨ ', ansi.bold, ansi.inverse, ansi.yellow),
        rainbowDivider,
        color('🧰 Available Commands & Purpose', ansi.bold, ansi.underline, ansi.yellow),
        `${color('  fastfetch', ansi.bold, ansi.lime)}: ${color('show system information panel', ansi.white)}`,
        `${color('  clear', ansi.bold, ansi.lime)}: ${color('clear terminal content', ansi.white)}`,
        `${color('  reset', ansi.bold, ansi.lime)}: ${color('restore initial history and input state', ansi.white)}`,
        `${color('  help', ansi.bold, ansi.lime)}: ${color('show command list and purpose', ansi.white)}`,
        `${color('  whoami', ansi.bold, ansi.lime)}: ${color('show author profile', ansi.white)}`,
        `${color('  echo', ansi.bold, ansi.lime)}: ${color('echo input text', ansi.white)}`,
        `${color('  pwd', ansi.bold, ansi.lime)}: ${color('print current path', ansi.white)}`,
        `${color('  uname', ansi.bold, ansi.lime)}: ${color('show kernel and system identity', ansi.white)}`,
        `${color('  date', ansi.bold, ansi.lime)}: ${color('show current time', ansi.white)}`,
        `${color('  delay', ansi.bold, ansi.lime)}: ${color('output text after a delay', ansi.white)}`,
        rainbowDivider,
    ].join('\n'))
    return true
}

export default help
