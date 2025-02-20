<template>
  <div class="terminal-card" ref="terminalRef"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import '@xterm/xterm/css/xterm.css'
import { Terminal } from '@xterm/xterm'
import { WebContainer } from '@webcontainer/api'
import { FitAddon } from '@xterm/addon-fit'
import c from 'chalk'
import { useResizeObserver } from '@vueuse/core'

let _promise: Promise<WebContainer> | null = null
const terminal = ref<Terminal | null>(null)
const fitAddon = ref<FitAddon | null>(null)
const terminalRef = ref<HTMLDivElement>()
const webContainer = ref<WebContainer>()

useResizeObserver(terminalRef, () => {
  fitAddon.value?.fit()
  terminal.value?.resize(terminal.value!.cols, terminal.value!.rows)
})

function getContainer() {
  if (!_promise) {
    terminal.value?.writeln('')
    terminal.value?.writeln(c.gray('> Initiating WebContainer...'))
    _promise = WebContainer.boot()
      .then((wc) => {
        terminal.value?.writeln(c.green('> WebContainer is booted.'))
        return wc
      })
      .catch((err) => {
        console.error(err)
        terminal.value?.writeln(c.red('> WebContainer failed to boot.'))
        throw err
      })
  }
  return _promise
}

async function startShell(terminal: Terminal, webcontainerInstance: WebContainer) {
  const shellProcess = await webcontainerInstance.spawn("jsh", {
    terminal: {
      cols: terminal.cols,
      rows: terminal.rows,
    },
  })
  shellProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        terminal.write(data);
      },
    }),
  )

  const input = shellProcess.input.getWriter()
  terminal.onData((data) => {
    input.write(data);
  })

  return shellProcess
}

onMounted(async () => {
  fitAddon.value = new FitAddon()
  terminal.value = new Terminal({
    convertEol: true,
  })
  terminal.value.loadAddon(fitAddon.value)
  terminal.value.open(terminalRef.value!)

  fitAddon.value.fit()

  webContainer.value = await getContainer()

  webContainer.value.on('server-ready', (port, url) => {
    terminal.value?.writeln(c.blue(`> Server is running on ${url}`))
    emits('server', url)
  })

  await startShell(terminal.value, webContainer.value)

  emits('ready')
})

const emits = defineEmits<{
  ready: [],
  server: [value: string]
}>()

defineExpose({
  webContainer,
  terminal
})
</script>

<style lang="scss" scoped>
.terminal-card {
  width: 100%;
  height: 100%;
}
</style>
