import {Ansis} from "ansis";
import {type TerminalAction} from "@/utils/terminal.ts";

const ansis = new Ansis(2)

const help: TerminalAction = (rawCommand, sender) => {
    if (rawCommand.trim() !== 'help') {
        return
    }
    const rainbowDivider = [
        ansis.fg(203).bold('━━'),
        ansis.fg(214).bold('━━'),
        ansis.fg(184).bold('━━'),
        ansis.greenBright.bold('━━'),
        ansis.fg(63).bold('━━'),
        ansis.fg(99).bold('━━'),
        ansis.fg(201).bold('━━'),
    ].join('')

    sender([
        ansis.bold.inverse.fg(184)(' ✨ HELP ✨ '),
        rainbowDivider,
        ansis.bold.underline.fg(184)('🧰 Available Commands & Purpose'),
        `${ansis.bold.fg(118)('  fastfetch')}: ${ansis.whiteBright('show system information panel')}`,
        `${ansis.bold.fg(118)('  clear')}: ${ansis.whiteBright('clear terminal content')}`,
        `${ansis.bold.fg(118)('  reset')}: ${ansis.whiteBright('restore initial history and input state')}`,
        `${ansis.bold.fg(118)('  help')}: ${ansis.whiteBright('show command list and purpose')}`,
        `${ansis.bold.fg(118)('  whoami')}: ${ansis.whiteBright('show author profile')}`,
        `${ansis.bold.fg(118)('  echo')}: ${ansis.whiteBright('echo input text')}`,
        `${ansis.bold.fg(118)('  pwd')}: ${ansis.whiteBright('print current path')}`,
        `${ansis.bold.fg(118)('  uname')}: ${ansis.whiteBright('show kernel and system identity')}`,
        `${ansis.bold.fg(118)('  date')}: ${ansis.whiteBright('show current time')}`,
        `${ansis.bold.fg(118)('  delay')}: ${ansis.whiteBright('output text after a delay')}`,
        rainbowDivider,
    ].join('\n'))
    return true
}

export default help
