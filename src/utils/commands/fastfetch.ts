import {Ansis} from "ansis";
import {type TerminalSender} from "@/utils/terminal.ts";

const ansi = new Ansis(1)
const reset = ansi.reset.open
const cursor = {
    columnOne: "\u001b[1G",
    upSixteen: "\u001b[16A",
    rightThirtyFour: "\u001b[34C",
}

const infoLine = (label: string, value: string) =>
    `${cursor.rightThirtyFour}${reset}${ansi.bold.open}${ansi.yellow.open}${label}${reset}: ${reset}${value}`

const lines = [
    `${ansi.bold.open}${ansi.green.open}                     ..'`,
    `                 ,xNMM.`,
    `               .OMMMMo`,
    `               lMM"`,
    `     .;loddo:.  .olloddol;.`,
    `   cKMMMMMMMMMMNWMMMMMMMMMM0:`,
    ` ${ansi.yellow.open}.KMMMMMMMMMMMMMMMMMMMMMMMWd.`,
    ` XMMMMMMMMMMMMMMMMMMMMMMMX.`,
    `${ansi.redBright.open};MMMMMMMMMMMMMMMMMMMMMMMM:`,
    `:MMMMMMMMMMMMMMMMMMMMMMMM:`,
    `${ansi.red.open}.MMMMMMMMMMMMMMMMMMMMMMMX.`,
    ` kMMMMMMMMMMMMMMMMMMMMMMMMWd.`,
    ` ${ansi.magenta.open}'XMMMMMMMMMMMMMMMMMMMMMMMMMMk`,
    `  'XMMMMMMMMMMMMMMMMMMMMMMMMK.`,
    `    ${ansi.blue.open}kMMMMMMMMMMMMMMMMMMMMMMd`,
    `     ;KMMMMMMMWXXWMMMMMMMk.`,
    `       "cooc*"    "*coo'${reset}${cursor.columnOne}${cursor.upSixteen}${reset}${cursor.rightThirtyFour}${ansi.bold.open}${ansi.green.open}886kagg${reset}@${ansi.bold.open}${ansi.green.open}Ciallo${reset}`,
    `${cursor.rightThirtyFour}--------------`,
    infoLine("OS", "macOS  27.0 (26A5388g) arm64"),
    infoLine("Host", "MacBook Air (15-inch, M4, 2025)"),
    infoLine("Kernel", "Darwin 27.0.0"),
    infoLine("Uptime", "11 days, 4 hours, 20 mins"),
    infoLine("Packages", "131 (brew), 17 (brew-cask)"),
    infoLine("Shell", "zsh 5.9"),
    infoLine("Display (Color LCD)", "3420x2214 @ 2x in 15\", 60 Hz [Built-in] *"),
    infoLine("WM", "Quartz Compositor 1.600.0"),
    infoLine("WM Theme", "Multicolor (Dark)"),
    infoLine("Theme", "Liquid Glass"),
    infoLine("Font", ".AppleSystemUIFont [System], Helvetica [User]"),
    infoLine("Cursor", "Fill - Black, Outline - White (32px)"),
    infoLine("Terminal", "ghostty 1.3.1"),
    infoLine("Terminal Font", "Maple Mono NF CN (15pt)"),
    infoLine("CPU", "Apple M4 (10) @ 4.46 GHz"),
    infoLine("GPU", "Apple M4 (10) @ 1.47 GHz [Integrated]"),
    infoLine("Memory", `17.97 GiB / 24.00 GiB (${ansi.yellowBright("75%")})`),
    infoLine("Swap", `722.81 MiB / 2.00 GiB (${ansi.green("35%")})`),
    infoLine("Disk (/)", `408.00 GiB / 460.43 GiB (${ansi.redBright("89%")}) - apfs [Read-only]`),
    infoLine("Battery (bq40z651)", `${ansi.yellowBright("34%")} (1 hour, 12 mins remaining) [Discharging]`),
    infoLine("Locale", "en_US.UTF-8"),
    cursor.rightThirtyFour,
    `${cursor.rightThirtyFour}${reset}${ansi.bgBlack.open}   ${ansi.bgRed.open}   ${ansi.bgGreen.open}   ${ansi.bgYellow.open}   ${ansi.bgBlue.open}   ${ansi.bgMagenta.open}   ${ansi.bgCyan.open}   ${ansi.bgWhite.open}   ${reset}`,
    `${cursor.rightThirtyFour}${ansi.bgGray.open}   ${ansi.bgRedBright.open}   ${ansi.bgGreenBright.open}   ${ansi.bgYellowBright.open}   ${ansi.bgBlueBright.open}   ${ansi.bgMagentaBright.open}   ${ansi.bgCyanBright.open}   ${ansi.bgWhiteBright.open}   ${reset}`,
]

export default async function (command: string, sender: TerminalSender): Promise<boolean> {
    if (!command.startsWith("fastfetch")) {
        return false
    }
    sender(lines.join("\n"))
    return true
}
