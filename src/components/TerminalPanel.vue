<script setup lang="ts">
import '@xterm/xterm/css/xterm.css'
import { FitAddon } from '@xterm/addon-fit'
import { Terminal } from '@xterm/xterm'
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { splitTerminalText, type TerminalAction, type TerminalSender } from '../utils/terminal'

const props = withDefaults(defineProps<{
  prompt?: string
  onAction?: TerminalAction | TerminalAction[]
}>(), {
  prompt: '',
})

const data = defineModel<string[]>('data', { default: () => [] })
const command = defineModel<string>('command', { default: '' })

const host = ref<HTMLElement | null>(null)
const terminal = shallowRef<Terminal | null>(null)
const fitAddon = new FitAddon()
const running = ref(false)
const pendingOutput = ref('')
const onWindowResize = () => fitAddon.fit()

const handlers = computed(() => {
  if (!props.onAction) {
    return []
  }

  return Array.isArray(props.onAction) ? props.onAction : [props.onAction]
})

const screen = computed(() => {
  const lines = [...data.value]

  if (pendingOutput.value) {
    lines.push(...splitTerminalText(pendingOutput.value))
  }

  if (!running.value) {
    lines.push(`${props.prompt}${command.value}`)
  }

  return lines.join('\r\n')
})

const render = () => {
  const instance = terminal.value

  if (!instance) {
    return
  }

  instance.reset()
  instance.write(screen.value)
  instance.scrollToBottom()
}

const focus = () => terminal.value?.focus()

const submit = async () => {
  if (running.value) {
    return
  }

  const rawCommand = command.value
  data.value = [...data.value, `${props.prompt}${rawCommand}`]
  command.value = ''
  pendingOutput.value = ''
  running.value = true

  const sender: TerminalSender = (chunk) => {
    pendingOutput.value += chunk
  }

  await Promise.all(handlers.value.map((handler) => handler(rawCommand, sender)))

  if (pendingOutput.value) {
    data.value = [...data.value, ...splitTerminalText(pendingOutput.value)]
    pendingOutput.value = ''
  }

  running.value = false
}

const cancel = () => {
  if (running.value) {
    return
  }

  data.value = [...data.value, `${props.prompt}${command.value}`, '^C']
  command.value = ''
}

const appendInput = (chunk: string) => {
  if (running.value) {
    return
  }

  if (chunk === '\r') {
    void submit()
    return
  }

  if (chunk === '\u0003') {
    cancel()
    return
  }

  if (chunk === '\u007f') {
    command.value = command.value.slice(0, -1)
    return
  }

  const printable = chunk.replace(/[\x00-\x1f\x7f]/g, '')

  if (printable) {
    command.value += printable
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
  render()
  focus()
  window.addEventListener('resize', onWindowResize)
  fitAddon.fit()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize)
  terminal.value?.dispose()
})

watch(screen, render, { immediate: true })
</script>

<template>
  <div ref="host" class="terminal-screen" @click="focus" />
</template>
