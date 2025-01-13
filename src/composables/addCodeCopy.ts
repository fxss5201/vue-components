import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import clipboardJS, { type Event } from 'clipboard'
import type ClipboardJS from 'clipboard'
import { ElMessage } from 'element-plus'

export function addCodeCopy () {
  const clipboard = ref<ClipboardJS | null>(null)
  const clipboardTime = ref<number | null>(null)

  function initClipboard () {
    clipboard.value = new clipboardJS('.copy-btn')
    clipboard.value!.on('success', (e: Event) => {
      (e.trigger.previousElementSibling as HTMLElement)!.style.display = 'block';
      (e.trigger as HTMLElement)!.style.display = 'none'
      clipboardTime.value = setTimeout(() => {
        (e.trigger.previousElementSibling as HTMLElement)!.style.display = 'none';
        (e.trigger as HTMLElement)!.style.display = 'block'
      }, 1000)
    })
    clipboard.value!.on('error', () => {
      ElMessage.error('复制失败')
    })
  }

  function destroyClipboard () {
    clipboard.value && clipboard.value!.destroy()
    clipboardTime.value && clearTimeout(clipboardTime.value)
  }

  onMounted(() => {
    nextTick(() => {
      initClipboard()
    })
  })

  onUnmounted(() => {
    destroyClipboard()
  })
}
