import { type Directive } from "vue"

type WheelHandler = (event: WheelEvent) => void

export const vWheel: Directive<HTMLElement, WheelHandler> = {
  mounted(el, binding) {
    const handler = binding.value
    el.addEventListener('wheel', handler)
  },
  unmounted(el, binding) {
    const handler = binding.value
    el.removeEventListener('wheel', handler)
  }
}
