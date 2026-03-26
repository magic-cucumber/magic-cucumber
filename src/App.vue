<script setup lang="ts">
import {ref} from 'vue'
import TerminalPanel from './components/TerminalPanel.vue'
import fastfetch from "./utils/commands/fastfetch.ts";
import {ansi, color} from "./utils/terminal.ts";
import fallback from "./utils/commands/fallback.ts";
import * as clear0 from "./utils/commands/clear.ts";
import date from "./utils/commands/date.ts";
import delay from "./utils/commands/delay.ts";
import echo from "./utils/commands/echo.ts";
import empty from "./utils/commands/empty.ts";
import help from "./utils/commands/help.ts";
import pwd from "./utils/commands/pwd.ts";
import uname from "./utils/commands/uname.ts";
import whoami from "./utils/commands/whoami.ts";

const prompt = '(base) 886kagg@Ciallo ~ % '

const buffer = ref('')
const data = ref([
  `${color('Last login: Thu Mar 26 17:46:01 on ttys001', ansi.bold, ansi.green)}`,
  `${prompt}fastfetch`,
  `${color("                     ..'", ansi.lime)}          ${color('886kagg@Ciallo', ansi.bold, ansi.lime)}`,
  `${color('                 ,xNMM.', ansi.lime)}           ${color('--------------', ansi.bold, ansi.lime)}`,
  `${color('               .OMMMMo', ansi.lime)}            ${color('OS', ansi.bold, ansi.yellow)}: ${color('macOS Tahoe 26.4 (25E246) arm64', ansi.bold, ansi.lime)}`,
  `${color('               lMM"', ansi.lime)}               ${color('Host', ansi.bold, ansi.yellow)}: ${color('MacBook Air (15-inch, M4, 2025)', ansi.bold, ansi.lime)}`,
  `${color('     .;loddo:.  .olloddol;.', ansi.lime)}       ${color('Kernel', ansi.bold, ansi.yellow)}: ${color('Darwin 25.4.0', ansi.bold, ansi.lime)}`,
  `${color('   cKMMMMMMMMMMNWMMMMMMMMMM0:', ansi.lime)}     ${color('Uptime', ansi.bold, ansi.yellow)}: ${color('1 day, 8 hours, 20 mins', ansi.bold, ansi.lime)}`,
  `${color(' .KMMMMMMMMMMMMMMMMMMMMMMMWd.', ansi.yellow)}     ${color('Packages', ansi.bold, ansi.yellow)}: ${color('140 (brew), 10 (brew-cask)', ansi.bold, ansi.lime)}`,
  `${color(' XMMMMMMMMMMMMMMMMMMMMMMMX.', ansi.yellow)}       ${color('Shell', ansi.bold, ansi.yellow)}: ${color('zsh 5.9', ansi.bold, ansi.lime)}`,
  `${color(';MMMMMMMMMMMMMMMMMMMMMMMM:', ansi.red)}        ${color('Display (Color LCD)', ansi.bold, ansi.yellow)}: ${color('3420x2214 @ 2x in 15", 60', ansi.bold, ansi.lime)}`,
  `${color(':MMMMMMMMMMMMMMMMMMMMMMMM:', ansi.red)}        ${color('WM', ansi.bold, ansi.yellow)}: ${color('Quartz Compositor 1.600.0', ansi.bold, ansi.lime)}`,
  `${color('.MMMMMMMMMMMMMMMMMMMMMMMX.', ansi.red)}        ${color('WM Theme', ansi.bold, ansi.yellow)}: ${color('Multicolor (Light)', ansi.bold, ansi.lime)}`,
  `${color(' kMMMMMMMMMMMMMMMMMMMMMMMMWd.', ansi.red)}     ${color('Theme', ansi.bold, ansi.yellow)}: ${color('Liquid Glass', ansi.bold, ansi.lime)}`,
  `${color(" 'XMMMMMMMMMMMMMMMMMMMMMMMMMMk", ansi.magenta)}    ${color('Font', ansi.bold, ansi.yellow)}: ${color('.AppleSystemUIFont [System], Helvetica [', ansi.bold, ansi.lime)}`,
  `${color("  'XMMMMMMMMMMMMMMMMMMMMMMMMK.", ansi.magenta)}    ${color('Cursor', ansi.bold, ansi.yellow)}: ${color('Fill - Black, Outline - White (32px)', ansi.bold, ansi.lime)}`,
  `${color('    kMMMMMMMMMMMMMMMMMMMMMMd', ansi.purple)}      ${color('Terminal', ansi.bold, ansi.yellow)}: ${color('Apple Terminal 470', ansi.bold, ansi.lime)}`,
  `${color('     ;KMMMMMMMWXXWMMMMMMMk.', ansi.blue)}       ${color('Terminal Font', ansi.bold, ansi.yellow)}: ${color('AndaleMono (12pt)', ansi.bold, ansi.lime)}`,
  `${color(`       "cooc*"    "*coo'"`, ansi.blue)}         ${color('CPU', ansi.bold, ansi.yellow)}: ${color('Apple M4 (10) @ 4.46 GHz', ansi.bold, ansi.lime)}`,
  `${' '.repeat(34)}${color('GPU', ansi.bold, ansi.yellow)}: ${color('Apple M4 (10) @ 1.47 GHz [Integrated]', ansi.bold, ansi.lime)}`,
  `${' '.repeat(34)}${color('Memory', ansi.bold, ansi.yellow)}: ${color('20.86 GiB / 24.00 GiB ', ansi.bold, ansi.lime)}${color('(87%)', ansi.bold, ansi.red)}`,
  `${' '.repeat(34)}${color('Swap', ansi.bold, ansi.yellow)}: ${color('7.08 GiB / 8.00 GiB ', ansi.bold, ansi.lime)}${color('(88%)', ansi.bold, ansi.red)}`,
  `${' '.repeat(34)}${color('Disk (/)', ansi.bold, ansi.yellow)}: ${color('381.09 GiB / 460.43 GiB ', ansi.bold, ansi.lime)}${color('(83%)', ansi.bold, ansi.red)}${color(' - apfs', ansi.bold, ansi.lime)}`,
  `${' '.repeat(34)}${color('Battery (bq40z651)', ansi.bold, ansi.yellow)}: ${color('100% [AC connected]', ansi.bold, ansi.lime)}`,
  `${' '.repeat(34)}${color('Power Adapter', ansi.bold, ansi.yellow)}: ${color('35W USB-C Power Adapter', ansi.bold, ansi.lime)}`,
  `${' '.repeat(34)}${color('Locale', ansi.bold, ansi.yellow)}: ${color('zh_CN.UTF-8', ansi.bold, ansi.lime)}`,
  '',
  `${' '.repeat(34)}${color('   ', ansi.bgBlack)}${color('   ', ansi.bgRed)}${color('   ', ansi.bgGreen)}${color('   ', ansi.bgYellow)}${color('   ', ansi.bgBlue)}${color('   ', ansi.bgMagenta)}${color('   ', ansi.bgCyan)}${color('   ', ansi.bgWhite)}`,
  '',
])


const clear = clear0.default({clear: () => data.value = []})
</script>

<template>
  <main class="terminal-shell">
    <section class="terminal-frame">
      <header class="terminal-bar">
        <div class="traffic-lights" aria-hidden="true">
          <span class="traffic-light close"></span>
          <span class="traffic-light minimize"></span>
          <span class="traffic-light maximize"></span>
        </div>
        <p class="terminal-title">magic-cucumber's MacBook Air</p>
      </header>

      <TerminalPanel
          v-model:data="data"
          v-model:command="buffer"
          :prompt="prompt"
          :on-action="[
              fastfetch,
              clear,
              date,
              delay,
              echo,
              help,
              pwd,
              uname,
              whoami,
              empty,
              fallback
          ]"
      />
    </section>
  </main>
</template>
