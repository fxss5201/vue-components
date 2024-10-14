<template>
  <div ref="echartsRef" style="width: 100%; height: 100%"></div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { nextTick, ref, onMounted, onUnmounted, watch } from 'vue'
import { useDebounceFn, useResizeObserver } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    opts: echarts.EChartsInitOpts,
    options: any,
    addEvent: boolean
  }>(),
  {
    // https://echarts.apache.org/zh/api.html#echarts.init
    // 初始化传入的 opts
    opts: () => {
      return {
        renderer: 'canvas'
      }
    },
    options: () => {},
    addEvent: false
  }
)
const emit = defineEmits<{
  click: [value: echarts.ECElementEvent]
}>()

const echartsRef = ref<HTMLDivElement>()
const echartsInstance = ref<echarts.ECharts | null>()
const debouncedFn = useDebounceFn(() => {
  resizeEchart()
}, 200, { maxWait: 800 })
useResizeObserver(echartsRef, () => {
  debouncedFn()
})
onMounted(() => {
  initEchart()
})
onUnmounted(() => {
  destroyEchart()
})
watch(
  () => props.options,
  () => {
    updateEchart()
  },
  {
    deep: true
  }
)

function initEchart () {
  destroyEchart()
  echartsInstance.value = echarts.init(echartsRef.value, null, props.opts)
  updateEchart()
  if (props.addEvent) {
    addClickEventFn()
  }
}

function destroyEchart () {
  if (echartsInstance.value) {
    if (props.addEvent) {
      removeClickEventFn()
    }
    if (typeof echartsInstance.value.clear === 'function') echartsInstance.value.clear()
    if (typeof echartsInstance.value.dispose === 'function') echartsInstance.value.dispose()
    echartsInstance.value = null
  }
}

function updateEchart () {
  nextTick(() => {
    echartsInstance.value && echartsInstance.value.setOption(props.options, true)
  })
}

function resizeEchart () {
  echartsInstance.value && echartsInstance.value.resize()
}

function addClickEventFn () {
  echartsInstance.value && echartsInstance.value.on('click', (event) => {
    console.log('event', event)
    emit('click', event)
  })
}

function removeClickEventFn () {
  echartsInstance.value && echartsInstance.value.off('click')
}
</script>
