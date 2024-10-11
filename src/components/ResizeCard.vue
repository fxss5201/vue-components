<template>
  <div class="resize-card"
    ref="resizeCard"
    :style="{
      width: resizeCardWidth + 'px',
      height: resizeCardHeight + 'px'
    }">
    <slot />
    <div class="resize-card__resize" v-if="props.resize" ref="handleResizeEl">
      <svg t="1728634259531" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18172" width="200" height="200"><path d="M938.666667 938.666667 853.333333 938.666667 853.333333 853.333333 938.666667 853.333333 938.666667 938.666667M938.666667 768 853.333333 768 853.333333 682.666667 938.666667 682.666667 938.666667 768M768 938.666667 682.666667 938.666667 682.666667 853.333333 768 853.333333 768 938.666667M768 768 682.666667 768 682.666667 682.666667 768 682.666667 768 768M597.333333 938.666667 512 938.666667 512 853.333333 597.333333 853.333333 597.333333 938.666667M938.666667 597.333333 853.333333 597.333333 853.333333 512 938.666667 512 938.666667 597.333333Z" p-id="18173"></path></svg>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, watch, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    defaultWidth?: number
    defaultHeight?: number
    minWidth?: number
    minHeight?: number
    maxWidth?: number
    maxHeight?: number
    resize?: boolean
  }>(),
  {
    defaultWidth: 600,
    defaultHeight: 500,
    minWidth: 200,
    minHeight: 100,
    maxWidth: 1000,
    maxHeight: 800,
    resize: true
  }
)
const emit = defineEmits<{
  reisze: [value: { width: number; height: number }]
}>()

const resizeCard = ref<HTMLDivElement>()
const handleResizeEl = ref<HTMLDivElement>()

watch(
  () => props.resize,
  (newVal) => {
    nextTick(() => {
      if (newVal) {
        addResizeFn()
      } else {
        removeResizeFn()
      }
    })
  },
  {
    immediate: true
  }
)

function addResizeFn () {
  handleResizeEl.value?.addEventListener('mousedown', resizeFn)
}
function removeResizeFn () {
  handleResizeEl.value?.removeEventListener('mousedown', resizeFn)
  document.removeEventListener('mouseup', mouseupFn)
}

const isResizing = ref(false)
let resizeMoveFn = ref()
let resizeCardWidth = ref(props.defaultWidth)
let resizeCardHeight = ref(props.defaultHeight)

function resizeFn (e: MouseEvent) {
  if (resizeCard.value) {
    resizeCard.value.style.userSelect = 'none'
  }
  isResizing.value = true
  let startX = e.clientX
  let startY = e.clientY

  resizeMoveFn.value = (e: MouseEvent) => {
    if (isResizing.value) {
      const currentX = e.clientX
      const currentY = e.clientY
      const deltaX = currentX - startX
      const deltaY = currentY - startY

      let width = resizeCardWidth.value + deltaX
      let height = resizeCardHeight.value + deltaY

      if (width < props.minWidth) {
        width = props.minWidth
      } else if (width > props.maxWidth) {
        width = props.maxWidth
      }
      if (height < props.minHeight) {
        height = props.minHeight
      } else if (height > props.maxHeight) {
        height = props.maxHeight
      }

      resizeCardWidth.value = width
      resizeCardHeight.value = height

      startX = currentX
      startY = currentY
    }
  }

  document.addEventListener('mousemove', resizeMoveFn.value)
  document.addEventListener('mouseup', mouseupFn)
}
function mouseupFn () {
  isResizing.value = false
  if (resizeCard.value) {
    resizeCard.value.style.userSelect = ''
  }
  emit('reisze', {
    width: resizeCardWidth.value,
    height: resizeCardHeight.value
  })
  document.removeEventListener('mousemove', resizeMoveFn.value)
  document.removeEventListener('mouseup', mouseupFn)
}
</script>

<style lang="scss" scoped>
.resize-card {
  position: relative;
  .resize-card__resize {
    position: absolute;
    right: 2px;
    bottom: 2px;
    z-index: 1;
    width: 20px;
    height: 20px;
    cursor: se-resize;
    .icon {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
