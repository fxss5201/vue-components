<template>
  <div class="resize-card"
    ref="resizeCard"
    :style="{
      width: resizeCardWidth + 'px',
      height: resizeCardHeight + 'px'
    }">
    <slot />
    <div class="resize-card__resize" v-if="props.resize" ref="handleResizeEl" :style="{ right: `${handleResizeElRight + 2}px` }">
      <svg t="1728634259531" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18172" width="200" height="200"><path d="M938.666667 938.666667 853.333333 938.666667 853.333333 853.333333 938.666667 853.333333 938.666667 938.666667M938.666667 768 853.333333 768 853.333333 682.666667 938.666667 682.666667 938.666667 768M768 938.666667 682.666667 938.666667 682.666667 853.333333 768 853.333333 768 938.666667M768 768 682.666667 768 682.666667 682.666667 768 682.666667 768 768M597.333333 938.666667 512 938.666667 512 853.333333 597.333333 853.333333 597.333333 938.666667M938.666667 597.333333 853.333333 597.333333 853.333333 512 938.666667 512 938.666667 597.333333Z" p-id="18173"></path></svg>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, watch, ref } from 'vue'
import { getScrollbarWidth } from '@/utils/getScrollbarWidth'

const props = withDefaults(
  defineProps<{
    defaultWidth?: number
    defaultHeight?: number
    minWidth?: number
    minHeight?: number
    maxWidth?: number
    maxHeight?: number
    resize?: boolean
    autoWatchScroll?: boolean
    isScroll?: boolean
    immediateEmit?: boolean
  }>(),
  {
    defaultWidth: 600,
    defaultHeight: 500,
    minWidth: 200,
    minHeight: 100,
    maxWidth: 1000,
    maxHeight: 800,
    resize: true,
    // 是否自动监听滚动条的变化，默认自动监听调整右下角拖拽图表位置，设置为false时，需要手动设置isScroll属性
    autoWatchScroll: true,
    isScroll: false,
    // 是否立即触发resize事件，默认为false会在拖动结束时触发resize事件，设置为true时，会在拖动过程中触发resize事件
    immediateEmit: false
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
  resizeCard.value!.style.userSelect = 'none'
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

      if (props.immediateEmit) {
        emit('reisze', {
          width: resizeCardWidth.value,
          height: resizeCardHeight.value
        })
      }

      startX = currentX
      startY = currentY
    }
  }

  document.addEventListener('mousemove', resizeMoveFn.value)
  document.addEventListener('mouseup', mouseupFn)
}
function mouseupFn () {
  isResizing.value = false
  resizeCard.value!.style.userSelect = ''
  emit('reisze', {
    width: resizeCardWidth.value,
    height: resizeCardHeight.value
  })
  document.removeEventListener('mousemove', resizeMoveFn.value)
  document.removeEventListener('mouseup', mouseupFn)
}

const scrollbarWidth = getScrollbarWidth()
const handleResizeElRight = ref(0)
watch(
  () => props.isScroll,
  (newVal) => {
    if (!props.autoWatchScroll) {
      nextTick(() => {
        if (newVal) {
          handleResizeElRight.value = scrollbarWidth
        } else {
          handleResizeElRight.value = 0
        }
      })
    }
  },
  {
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
.resize-card {
  position: relative;
  overflow: hidden auto;
  border: 1px solid var(--el-menu-border-color);
  .resize-card__resize {
    position: absolute;
    bottom: 2px;
    z-index: 1;
    width: 20px;
    cursor: se-resize;
    .icon {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
