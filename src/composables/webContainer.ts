import { WebContainer } from '@webcontainer/api'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import c from 'chalk'
import { shallowRef } from 'vue'

let _promise: Promise<WebContainer> | null = null

export const terminal = shallowRef<Terminal>()
export const fitAddon = shallowRef<FitAddon>()

export function getContainer() {
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

export async function startShell(terminal: Terminal, webcontainerInstance: WebContainer) {
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

export async function installWebContainer(terminalRef: HTMLDivElement) {
  fitAddon.value = new FitAddon()
  terminal.value = new Terminal({
    convertEol: true,
  })
  terminal.value.loadAddon(fitAddon.value)
  terminal.value.open(terminalRef)
  fitAddon.value.fit()

  const wc = await getContainer()

  return {
    webContainer: wc,
    terminal: terminal.value,
    fitAddon: fitAddon.value
  }
}
