import {Ansis} from "ansis";
import {type TerminalAction} from "@/utils/terminal.ts";

const ansis = new Ansis(2)

const whoami: TerminalAction = (rawCommand, sender) => {
    if (rawCommand.trim() !== 'whoami') {
        return
    }
    sender([
        ansis.bold.inverse.fg(201)(' 👤 WHOAMI '),
        ansis.bold.underline.fg(201)('Profile'),
        `${ansis.bold.fg(63)('  GitHub')}: ${ansis.whiteBright('https://github.com/magic-cucumber')}`,
        `${ansis.bold.fg(63)('  ID')}: ${ansis.whiteBright('kagg886 (magic-cucumber)')}`,
        `${ansis.bold.fg(63)('  Bio')}: ${ansis.whiteBright.italic('happy cute and not furry')}`,
        `${ansis.bold.fg(63)('  Website')}: ${ansis.whiteBright('https://kagg886.top')}`,
        '',
        ansis.bold.underline.fg(201)('Social Media'),
        `${ansis.bold.fg(63)('  Linux DO')}: ${ansis.whiteBright('https://linux.do/u/kagg886/summary')}`,
        `${ansis.bold.fg(63)('  Others')}: ${ansis.whiteBright('to be added')}`,
        '',
        ansis.bold.underline.fg(214)('Highlights'),
        `${ansis.bold.greenBright('  Focus')}: ${ansis.whiteBright('Pixiv-MultiPlatform (cross-platform third-party Pixiv client)')}`,
        `${ansis.bold.greenBright('  Public repos')}: ${ansis.whiteBright('17 (14 owned)')}`,
        `${ansis.bold.greenBright('  Community')}: ${ansis.whiteBright('8 followers, 0 following')}`,
        `${ansis.bold.greenBright('  Repo impact')}: ${ansis.whiteBright('104 total stars, 8 total forks (owned repos)')}`,
        `${ansis.bold.greenBright('  Top projects')}: ${ansis.whiteBright('Pixiv-MultiPlatform(100★), wvbridge(2★), mcp-gateway(1★)')}`,
        `${ansis.bold.greenBright('  Main stacks')}: ${ansis.whiteBright('Kotlin, Vue, TypeScript, C++')}`,
        `${ansis.bold.greenBright('  Recent activity')}: ${ansis.whiteBright('magic-cucumber, wvbridge, Pixiv-MultiPlatform')}`,
        '',
        ansis.bold.underline.fg(203)('Note') + ': ' + ansis.whiteBright('This account is used to stay connected after the main account was blocked.'),
        ansis.bold.strikethrough.gray('Legacy account status') + ': ' + ansis.strikethrough.gray('main account reachable'),
    ].join('\n'))
    return true
}

export default whoami
