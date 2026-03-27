<script setup lang="ts">
import {ref} from 'vue'
import TerminalPanel from '@/components/TerminalPanel.vue'
import fastfetch from "@/utils/commands/fastfetch.ts";
import {ansi, color} from "@/utils/terminal.ts";
import fallback from "@/utils/commands/fallback.ts";
import * as clear0 from "@/utils/commands/clear.ts";
import * as reset0 from "@/utils/commands/reset.ts";
import date from "@/utils/commands/date.ts";
import delay from "@/utils/commands/delay.ts";
import echo from "@/utils/commands/echo.ts";
import help from "@/utils/commands/help.ts";
import pwd from "@/utils/commands/pwd.ts";
import uname from "@/utils/commands/uname.ts";
import whoami from "@/utils/commands/whoami.ts";
import {useFullscreen, useLocalStorage} from "@vueuse/core";

const prompt = '(base) 886kagg@Ciallo ~ % '

const buffer = useLocalStorage('buffer', '')

const data_default = [
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
]
const data = useLocalStorage('history', data_default)


const clear = clear0.default({
  clear: () => {
    data.value = []
    hash.value = Math.random()
  }
})

const hash = ref(Math.random())
const reset = reset0.default({
  reset: () => {
    buffer.value = ''
    data.value = [...data_default]
    hash.value = Math.random()
  }
})

const template = ref<HTMLElement | null>(null)


const close = () => history.back()
const mini = () => template.value?.blur()
const {isFullscreen, enter, exit, isSupported} = useFullscreen(template)

const toggle = () => {
  if (!isSupported.value) {
    alert('fullscreen is not supported')
    return
  }
  if (isFullscreen.value) {
    exit()
  } else {
    enter()
  }
}
</script>

<template>
  <main class="terminal-shell">
    <section class="terminal-frame">
      <header class="terminal-bar">
        <div class="traffic-lights">
          <span class="traffic-light close" title="Close" aria-label="Close" @click="close"></span>
          <span class="traffic-light minimize" title="Minimize" aria-label="Minimize" @click="mini"></span>
          <span class="traffic-light maximize" title="Zoom" aria-label="Zoom" @click="toggle"></span>
        </div>
        <p class="terminal-title">magic-cucumber's MacBook Air</p>
      </header>

      <TerminalPanel
          ref="template"
          class="terminal-panel"
          :initial="data"
          :key="hash"
          :prompt="prompt"
          v-model:command="buffer"
          :on-action="[
          fastfetch,
          clear,
          reset,
          date,
          delay,
          echo,
          help,
          pwd,
          uname,
          whoami,
          fallback
        ]"
      />
    </section>
  </main>
</template>

<style scoped>
.terminal-shell {
  min-height: 100svh;
  padding: 0;
  position: relative;
  overflow: hidden;
}

.terminal-shell::before,
.terminal-shell::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.terminal-shell::before {
  background: linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
  linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 100% 44px, 44px 100%;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.5), transparent 88%);
}

.terminal-shell::after {
  background: radial-gradient(circle at center, transparent 55%, rgba(0, 0, 0, 0.34) 100%);
}

.terminal-frame {
  width: 100%;
  height: 100svh;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  border: 1px solid rgba(110, 193, 255, 0.16);
  background: rgba(3, 16, 24, 0.7);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05),
  0 24px 80px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(22px);
}

.terminal-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 56px;
  padding: 0 20px;
  border-bottom: 1px solid rgba(110, 193, 255, 0.12);
  background: linear-gradient(180deg, rgba(8, 32, 47, 0.92), rgba(3, 16, 24, 0.72));
}

.traffic-lights {
  display: flex;
  gap: 8px;
}

.traffic-light {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid transparent;
  cursor: pointer;
  transition: filter 0.16s ease;
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.18);
}

.traffic-light.close {
  background: linear-gradient(180deg, #ff6d67 0%, #ed5b55 100%);
  border-color: #d94b44;
}

.traffic-light.minimize {
  background: linear-gradient(180deg, #f6be4f 0%, #edae2f 100%);
  border-color: #d59b2a;
}

.traffic-light.maximize {
  background: linear-gradient(180deg, #62c755 0%, #4cb748 100%);
  border-color: #40a53d;
}

.traffic-light::before {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: rgba(0, 0, 0, 0.62);
  font-size: 9px;
  font-weight: 700;
  line-height: 1;
  opacity: 0;
  transition: opacity 0.12s ease;
}

.traffic-light.close::before {
  content: '×';
}

.traffic-light.minimize::before {
  content: '−';
}

.traffic-light.maximize::before {
  content: '+';
}

.traffic-lights:hover .traffic-light::before {
  opacity: 1;
}

.traffic-light:hover {
  filter: brightness(0.96);
}

.terminal-title {
  margin: 0;
  color: rgba(216, 243, 255, 0.82);
  font-size: 0.92rem;
  letter-spacing: 0.12em;
}

.terminal-panel {
  min-width: 0;
  min-height: 0;
}

@media (max-width: 720px) {
  .terminal-bar {
    min-height: 48px;
    padding-inline: 14px;
  }

  .terminal-title {
    font-size: 0.75rem;
    letter-spacing: 0.08em;
  }
}
</style>
