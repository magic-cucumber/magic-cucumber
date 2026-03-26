<script setup lang="ts">
import '@xterm/xterm/css/xterm.css'
import {FitAddon} from '@xterm/addon-fit'
import {Terminal} from '@xterm/xterm'
import {computed, onBeforeUnmount, onMounted, ref, shallowRef} from 'vue'
import {splitTerminalText, type TerminalAction, type TerminalSender} from '../utils/terminal'

const props = withDefaults(defineProps<{
  prompt?: string
  onAction?: TerminalAction | TerminalAction[]
}>(), {
  prompt: '',
})

const data = defineModel<string[]>('data', {default: () => []})
const command = defineModel<string>('command', {default: ''})

const host = ref<HTMLElement | null>(null)
const terminal = shallowRef<Terminal | null>(null)
const fitAddon = new FitAddon()
// running=true 时禁用输入，直到所有 action 执行完成再恢复 prompt。
const running = ref(false)
const onWindowResize = () => fitAddon.fit()

const handlers = computed(() => {
  if (!props.onAction) {
    return []
  }

  return Array.isArray(props.onAction) ? props.onAction : [props.onAction]
})

const focus = () => terminal.value?.focus()

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
  data.value = [...data.value, `${props.prompt}${rawCommand}`]
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

  const error = await Promise.all(handlers.value.map((handler) => handler(rawCommand, sender)))
      .then(() => undefined)
      .catch((e: Error) => e)

  if (error != undefined) {
    sender(`error on processing command!\n${error.message}\n  ${error.stack}`)
  }

  if (pendingOutput) {
    data.value = [...data.value, ...splitTerminalText(pendingOutput)]
  }

  if (data.value.length === 0) {
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

// 把 xterm 的 onData 原始字节流转换为“最小可用行编辑”：
// - Enter 提交
// - Backspace 回删
// - 其余可打印字符直接追加
const appendInput = (chunk: string) => {
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
}

onMounted(() => {
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
  instance.open(host.value!)
  instance.onData(appendInput)
  // 首次挂载按 data 回放历史，再打印当前 prompt。
  if (data.value.length) {
    instance.write(data.value.join('\r\n'))
    instance.write('\r\n')
  }
  if (!running.value) {
    instance.write(`${props.prompt}${command.value}`)
  }
  focus()
  window.addEventListener('resize', onWindowResize)
  fitAddon.fit()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize)
  terminal.value?.dispose()
})
</script>

<template>
  <div ref="host" class="terminal-screen" @click="focus"/>
</template>
