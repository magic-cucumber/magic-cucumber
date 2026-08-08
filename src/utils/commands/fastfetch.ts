import {Ansis} from "ansis";
import {type TerminalSender} from "@/utils/terminal.ts";

const ansis = new Ansis(2)

export const line = [
    `${ansis.fg(118)("                     ..'")}          ${ansis.bold.fg(118)('886kagg@Ciallo')}`,
    `${ansis.fg(118)('                 ,xNMM.')}           ${ansis.bold.fg(118)('--------------')}`,
    `${ansis.fg(118)('               .OMMMMo')}            ${ansis.bold.fg(184)('OS')}: ${ansis.bold.fg(118)('macOS Tahoe 26.4 (25E246) arm64')}`,
    `${ansis.fg(118)('               lMM"')}               ${ansis.bold.fg(184)('Host')}: ${ansis.bold.fg(118)('MacBook Air (15-inch, M4, 2025)')}`,
    `${ansis.fg(118)('     .;loddo:.  .olloddol;.')}       ${ansis.bold.fg(184)('Kernel')}: ${ansis.bold.fg(118)('Darwin 25.4.0')}`,
    `${ansis.fg(118)('   cKMMMMMMMMMMNWMMMMMMMMMM0:')}     ${ansis.bold.fg(184)('Uptime')}: ${ansis.bold.fg(118)('1 day, 8 hours, 20 mins')}`,
    `${ansis.fg(184)(' .KMMMMMMMMMMMMMMMMMMMMMMMWd.')}     ${ansis.bold.fg(184)('Packages')}: ${ansis.bold.fg(118)('140 (brew), 10 (brew-cask)')}`,
    `${ansis.fg(184)(' XMMMMMMMMMMMMMMMMMMMMMMMX.')}       ${ansis.bold.fg(184)('Shell')}: ${ansis.bold.fg(118)('zsh 5.9')}`,
    `${ansis.fg(203)(';MMMMMMMMMMMMMMMMMMMMMMMM:')}        ${ansis.bold.fg(184)('Display (Color LCD)')}: ${ansis.bold.fg(118)('3420x2214 @ 2x in 15", 60')}`,
    `${ansis.fg(203)(':MMMMMMMMMMMMMMMMMMMMMMMM:')}        ${ansis.bold.fg(184)('WM')}: ${ansis.bold.fg(118)('Quartz Compositor 1.600.0')}`,
    `${ansis.fg(203)('.MMMMMMMMMMMMMMMMMMMMMMMX.')}        ${ansis.bold.fg(184)('WM Theme')}: ${ansis.bold.fg(118)('Multicolor (Light)')}`,
    `${ansis.fg(203)(' kMMMMMMMMMMMMMMMMMMMMMMMMWd.')}     ${ansis.bold.fg(184)('Theme')}: ${ansis.bold.fg(118)('Liquid Glass')}`,
    `${ansis.fg(201)(" 'XMMMMMMMMMMMMMMMMMMMMMMMMMMk")}    ${ansis.bold.fg(184)('Font')}: ${ansis.bold.fg(118)('.AppleSystemUIFont [System], Helvetica [')}`,
    `${ansis.fg(201)("  'XMMMMMMMMMMMMMMMMMMMMMMMMK.")}    ${ansis.bold.fg(184)('Cursor')}: ${ansis.bold.fg(118)('Fill - Black, Outline - White (32px)')}`,
    `${ansis.fg(99)('    kMMMMMMMMMMMMMMMMMMMMMMd')}      ${ansis.bold.fg(184)('Terminal')}: ${ansis.bold.fg(118)('Apple Terminal 470')}`,
    `${ansis.fg(63)('     ;KMMMMMMMWXXWMMMMMMMk.')}       ${ansis.bold.fg(184)('Terminal Font')}: ${ansis.bold.fg(118)('AndaleMono (12pt)')}`,
    `${ansis.fg(63)(`       "cooc*"    "*coo'"`)}         ${ansis.bold.fg(184)('CPU')}: ${ansis.bold.fg(118)('Apple M4 (10) @ 4.46 GHz')}`,
    `${' '.repeat(34)}${ansis.bold.fg(184)('GPU')}: ${ansis.bold.fg(118)('Apple M4 (10) @ 1.47 GHz [Integrated]')}`,
    `${' '.repeat(34)}${ansis.bold.fg(184)('Memory')}: ${ansis.bold.fg(118)('20.86 GiB / 24.00 GiB ')}${ansis.bold.fg(203)('(87%)')}`,
    `${' '.repeat(34)}${ansis.bold.fg(184)('Swap')}: ${ansis.bold.fg(118)('7.08 GiB / 8.00 GiB ')}${ansis.bold.fg(203)('(88%)')}`,
    `${' '.repeat(34)}${ansis.bold.fg(184)('Disk (/)')}: ${ansis.bold.fg(118)('381.09 GiB / 460.43 GiB ')}${ansis.bold.fg(203)('(83%)')}${ansis.bold.fg(118)(' - apfs')}`,
    `${' '.repeat(34)}${ansis.bold.fg(184)('Battery (bq40z651)')}: ${ansis.bold.fg(118)('100% [AC connected]')}`,
    `${' '.repeat(34)}${ansis.bold.fg(184)('Power Adapter')}: ${ansis.bold.fg(118)('35W USB-C Power Adapter')}`,
    `${' '.repeat(34)}${ansis.bold.fg(184)('Locale')}: ${ansis.bold.fg(118)('zh_CN.UTF-8')}`,
    '',
    `${' '.repeat(34)}${ansis.bg(240)('   ')}${ansis.bgRed('   ')}${ansis.bgGreen('   ')}${ansis.bgYellow('   ')}${ansis.bgBlue('   ')}${ansis.bgMagenta('   ')}${ansis.bgCyan('   ')}${ansis.bgWhite('   ')}`,
    '',
].join("\n")

export const handler = async function (command: string, sender: TerminalSender): Promise<boolean> {
    if (!command.startsWith("fastfetch")) {
        return false
    }
    sender(line)
    return true
}
