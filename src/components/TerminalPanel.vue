<script setup lang="ts">
import '@xterm/xterm/css/xterm.css'
import {FitAddon} from '@xterm/addon-fit'
import {Terminal} from '@xterm/xterm'
import {computed, ref, shallowRef, watch} from 'vue'
import {useEventListener} from '@vueuse/core'
import {ansi, color, splitTerminalText, type TerminalAction, type TerminalSender} from '@/utils/terminal'
import {WebLinksAddon} from "@xterm/addon-web-links";
import {useMounted} from "@/utils/mounted.ts";

const props = withDefaults(defineProps<{
  prompt?: string
  onAction?: TerminalAction | TerminalAction[]
  initial?: string[]
}>(), {
  prompt: '',
  initial: () => [],
})

const emits = defineEmits<{
  changed: [screen: string[]]
}>()

const command = defineModel<string>('command', {default: ''})
const screen = ref([...props.initial])

watch(screen, (value) => {
  emits('changed', [...value])
})

const host = ref<HTMLElement | null>(null)
const terminal = shallowRef<Terminal | null>(null)
const fitAddon = new FitAddon()
// running=true 时禁用输入，直到所有 action 执行完成再恢复 prompt。
const running = ref(false)
let lastTouchY: number | null = null

const handlers = computed(() => {
  if (!props.onAction) {
    return []
  }

  return Array.isArray(props.onAction) ? props.onAction : [props.onAction]
})

const focus = () => terminal.value?.focus()

const getAverageTouchY = (touches: TouchList) => {
  if (touches.length === 0) {
    return null
  }

  let total = 0

  for (let index = 0; index < touches.length; index += 1) {
    total += touches[index].clientY
  }

  return total / touches.length
}

const resetTouchScroll = () => {
  lastTouchY = null
}

const onTouchStart = (event: TouchEvent) => {
  lastTouchY = getAverageTouchY(event.touches)
}

const onTouchMove = (event: TouchEvent) => {
  const instance = terminal.value
  const currentY = getAverageTouchY(event.touches)

  if (!instance || currentY === null) {
    return
  }

  // 移动端触摸滚动应只驱动终端缓冲区，避免浏览器拖动整个外层容器。
  event.preventDefault()

  if (lastTouchY === null) {
    lastTouchY = currentY
    return
  }

  const deltaY = lastTouchY - currentY

  if (Math.abs(deltaY) < 4) {
    return
  }

  const fontSize = typeof instance.options.fontSize === 'number' ? instance.options.fontSize : 14
  const lineHeight = typeof instance.options.lineHeight === 'number' ? instance.options.lineHeight : 1.45
  const pxPerLine = Math.max(fontSize * lineHeight, 1)
  const lines = Math.trunc(deltaY / pxPerLine)

  if (lines !== 0) {
    instance.scrollLines(lines)
    lastTouchY = currentY
  }
}

useEventListener(window, 'resize', () => fitAddon.fit())
useEventListener(host, 'touchstart', onTouchStart, {passive: true})
useEventListener(host, 'touchmove', onTouchMove, {passive: false})
useEventListener(host, 'touchend', resetTouchScroll)
useEventListener(host, 'touchcancel', resetTouchScroll)

// 执行一次命令：
// 1) 把当前命令写入 data 作为历史
// 2) action 通过 sender 流式输出到 xterm
// 3) 结束后根据输出末尾是否换行来决定是否补 \r\n，再打印新的 prompt
const submit = async () => {
  if (running.value) {
    return
  }

  const instance = terminal.value

  if (!instance) {
    return
  }

  const rawCommand = command.value
  screen.value = [...screen.value, `${props.prompt}${rawCommand}`]
  command.value = ''
  running.value = true
  // pendingOutput 用于持久化到 data；屏幕显示则由 sender 直接写入，避免整屏重绘闪烁。
  let pendingOutput = ''
  let wroteOutput = false
  let outputEndsWithLineBreak = true

  const sender: TerminalSender = (chunk) => {
    if (!chunk) {
      return
    }

    pendingOutput += chunk
    wroteOutput = true
    // 只看最后一个 chunk 是否以换行结尾，用于决定 prompt 前是否补换行。
    outputEndsWithLineBreak = /(?:\r\n|\r|\n)$/.test(chunk)
    instance.write(chunk)
  }

  loop: for (const handler of handlers.value) {
    const result = await Promise.resolve(handler(rawCommand, sender)).catch((err: Error) => err)
    switch (typeof result) {
      case 'boolean': { //boolean根据返回值 继续处理/不处理
        if (!result) {
          continue
        }
        break loop
      }
      case 'object': { //object为error, 打印错误后不继续处理
        sender('\n')
        sender(color(`error on processing command!\n${result.stack}`, ansi.red))
        break loop
      }
      case 'undefined': { //undefined需要看情况
        if (wroteOutput) break loop //有产出则不处理
      }
    }
  }

  if (pendingOutput) {
    screen.value = [...screen.value, ...splitTerminalText(pendingOutput)]
  }

  if (screen.value.length === 0) {
    // clear 命令会把 data 清空，这里同步清空终端并重画 prompt。
    instance.clear()
    instance.write(`${props.prompt}${command.value}`)
    instance.scrollToBottom()
    running.value = false
    return
  }

  if (wroteOutput && !outputEndsWithLineBreak) {
    instance.write('\r\n')
  }

  running.value = false
  instance.write(`${props.prompt}${command.value}`)
  instance.scrollToBottom()
}

useMounted(() => {
  const instance = new Terminal({
    convertEol: true,
    cursorBlink: true,
    cursorStyle: 'block',
    fontFamily: '"IBM Plex Mono", "SFMono-Regular", Consolas, monospace',
    fontSize: 14,
    lineHeight: 1.45,
    theme: {
      background: '#00000000',
      foreground: '#d8f3ff',
      cursor: '#7ef9c6',
      selectionBackground: 'rgba(126, 249, 198, 0.28)',
    },
  })

  terminal.value = instance
  instance.loadAddon(fitAddon)
  instance.loadAddon(new WebLinksAddon())
  instance.open(host.value!)
  instance.onData((chunk: string) => {
    if (running.value) {
      return
    }

    if (chunk === '\r') {
      terminal.value?.write('\r\n')
      void submit()
      return
    }

    if (chunk === '\u007f') {
      if (!command.value) {
        return
      }

      command.value = command.value.slice(0, -1)
      terminal.value?.write('\b \b')
      return
    }

    const printable = chunk.replace(/[\x00-\x1f\x7f]/g, '')

    if (printable) {
      command.value += printable
      terminal.value?.write(printable)
    }
  })
  // 首次挂载按初始屏幕回放历史，再打印当前 prompt。
  if (screen.value.length) {
    instance.write(screen.value.join('\r\n'))
    instance.write('\r\n')
  }
  if (!running.value) {
    instance.write(`${props.prompt}${command.value}`)
  }
  focus()
  fitAddon.fit()

  return () => terminal.value?.dispose()
})

defineExpose(host)
</script>

<template>
  <div ref="host" class="terminal-screen" @click="focus"/>
</template>

<style scoped>
.terminal-screen {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  padding: 14px;
  overflow: hidden;
  overscroll-behavior: contain;
}

.terminal-screen :deep(.xterm) {
  height: 100%;
}

.terminal-screen :deep(.xterm-viewport) {
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: rgba(126, 249, 198, 0.5) transparent;
}

.terminal-screen :deep(.xterm-screen),
.terminal-screen :deep(.xterm-helpers),
.terminal-screen :deep(.xterm-viewport) {
  width: 100% !important;
}

@media (max-width: 720px) {
  .terminal-screen {
    padding: 10px;
    touch-action: none;
  }
}
</style>
