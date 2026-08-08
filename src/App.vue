<script setup lang="ts">
import {computed, ref} from 'vue'
import {useLocalStorage, useWindowSize} from '@vueuse/core'
import TerminalPanel from '@/components/TerminalPanel.vue'
import MacOSWindow from '@/components/MacOSWindow.vue'
import {handler as fastfetch, line} from "@/utils/commands/fastfetch.ts";
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
import MacOSMenu from "@/components/MacOSMenu.vue";

const prompt = '(base) 886kagg@Ciallo ~ % '

const buffer = useLocalStorage('buffer', '')

const data = useLocalStorage('history', [line])
const handleScreenChanged = (screen: string[]) => data.value = screen


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
    data.value = [line]
    hash.value = Math.random()
  }
})

const {width, height} = useWindowSize()
const size = ref({
  w: width.value,
  h: height.value - 40,
})
const point = ref({
  x: (width.value - size.value.w) / 2,
  y: 40,
})

const MENU_HEIGHT = 40
const handleDrag = (_type: string, _newX?: number, newY?: number) =>
  newY === undefined || newY >= MENU_HEIGHT
const handleResize = (_newX: number, newY: number, _newW: number, _newH: number) =>
  newY >= MENU_HEIGHT

const fontSize = computed(() => {
  if (width.value < 720) {
    return 8
  }
  return 14
})
</script>

<template>
  <main class="terminal-shell">
    <MacOSMenu style="width: 100%;z-index: 10000" :default-menu="['妈妈','爸爸']" :menu="[{title: '妈妈'},{title: '爸爸',subTitle: ['奶奶','小狗']},{title: '姐姐'}]"/>
    <MacOSWindow
        v-model:point="point"
        v-model:size="size"
        @drag="handleDrag"
        @resize="handleResize"
        title="magic-cucumber's MacBook Air"
    >
      <TerminalPanel
          class="terminal-panel"
          :font-size="fontSize"
          :initial="data"
          :key="hash"
          :prompt="prompt"
          @changed="handleScreenChanged"
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
    </MacOSWindow>
  </main>
</template>

<style scoped>
.terminal-shell {
  min-height: 100svh;
  padding: 0;
  position: relative;
  overflow: hidden;
  background: #ffffff;
}

.terminal-panel {
  min-width: 0;
  min-height: 0;
}
</style>
