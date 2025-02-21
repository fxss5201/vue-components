<template>
  <div class="terminal-card" ref="terminalHtmlRef"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import '@xterm/xterm/css/xterm.css'
import { WebContainer } from '@webcontainer/api'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { useResizeObserver } from '@vueuse/core'
import c from 'chalk'
import { startShell, installWebContainer } from '@/composables/webContainer'

const terminalHtmlRef = ref<HTMLDivElement>()
const webContainerRef = ref<WebContainer>()
const terminalRef = ref<Terminal>()
const fitAddonRef = ref<FitAddon>()

useResizeObserver(terminalHtmlRef, () => {
  fitAddonRef.value?.fit()
  terminalRef.value?.resize(terminalRef.value!.cols, terminalRef.value!.rows)
})

onMounted(async () => {
  const { webContainer, terminal, fitAddon } = await installWebContainer(terminalHtmlRef.value!)
  
  webContainerRef.value = webContainer
  terminalRef.value = terminal
  fitAddonRef.value = fitAddon

  webContainerRef.value.on('server-ready', (port, url) => {
    terminalRef.value?.writeln(c.blue(`> Server is running on ${url}`))
    emits('server', url)
  })

  webContainerRef.value.on('error', (error: { message: string }) => {
    emits('error', error.message)
    terminalRef.value?.writeln(c.red(error.message))
  })

  await startShell(terminalRef.value, webContainerRef.value)

  emits('ready')
})

const emits = defineEmits<{
  ready: [],
  error: [value: string],
  server: [value: string]
}>()

defineExpose({
  webContainer: webContainerRef,
  terminal: terminalRef
})
</script>

<style lang="scss" scoped>
.terminal-card {
  width: 100%;
  height: 100%;
}
</style>
