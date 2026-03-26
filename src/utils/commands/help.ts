import {ansi, color, type TerminalAction} from "@/utils/terminal.ts";

const help: TerminalAction = (rawCommand, sender) => {
    if (rawCommand.trim() !== 'help') {
        return false
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
        color('🧰 Available commands', ansi.bold, ansi.underline, ansi.yellow) + ': ' + color('fastfetch, clear, help, echo, pwd, whoami, uname, date, delay', ansi.lime),
        '',
        color('👤 Profile', ansi.bold, ansi.underline, ansi.magenta),
        `${color('  🐙 GitHub', ansi.bold, ansi.blue)}: ${color('https://github.com/magic-cucumber', ansi.white)}`,
        `${color('  🪪 ID', ansi.bold, ansi.blue)}: ${color('kagg886 (magic-cucumber)', ansi.white)}`,
        `${color('  💬 Bio', ansi.bold, ansi.blue)}: ${color('happy cute and not furry', ansi.white, ansi.italic)}`,
        `${color('  🌐 Website', ansi.bold, ansi.blue)}: ${color('https://kagg886.top', ansi.white)}`,
        '',
        color('📱 Social Media', ansi.bold, ansi.underline, ansi.magenta),
        `${color('  💠 Linux DO', ansi.bold, ansi.blue)}: ${color('https://linux.do/u/kagg886/summary', ansi.white)}`,
        `${color('  ➕ 其他', ansi.bold, ansi.blue)}: ${color('等待补充', ansi.white)}`,
        '',
        color('🚀 Highlights', ansi.bold, ansi.underline, ansi.orange),
        `${color('  🎯 Focus', ansi.bold, ansi.green)}: ${color('Pixiv-MultiPlatform (cross-platform third-party Pixiv client)', ansi.white)}`,
        `${color('  📦 Public repos', ansi.bold, ansi.green)}: ${color('17 (14 owned)', ansi.white)}`,
        `${color('  👥 Community', ansi.bold, ansi.green)}: ${color('8 followers, 0 following', ansi.white)}`,
        `${color('  ⭐ Repo impact', ansi.bold, ansi.green)}: ${color('104 total stars, 8 total forks (owned repos)', ansi.white)}`,
        `${color('  🏆 Top projects', ansi.bold, ansi.green)}: ${color('Pixiv-MultiPlatform(100★), wvbridge(2★), mcp-gateway(1★)', ansi.white)}`,
        `${color('  🧠 Main stacks', ansi.bold, ansi.green)}: ${color('Kotlin, Vue, TypeScript, C++', ansi.white)}`,
        `${color('  ⚡ Recent activity', ansi.bold, ansi.green)}: ${color('magic-cucumber, wvbridge, Pixiv-MultiPlatform', ansi.white)}`,
        '',
        color('📌 Note', ansi.bold, ansi.underline, ansi.red) + ': ' + color('This account is used to stay connected after the main account was blocked.', ansi.white),
        color('🪦 Legacy account status', ansi.bold, ansi.strikethrough, ansi.dim) + ': ' + color('main account reachable', ansi.strikethrough, ansi.dim),
        rainbowDivider,
    ].join('\n'))
    return true
}

export default help
