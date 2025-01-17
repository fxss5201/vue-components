<template>
  <div ref="echartsRef" style="width: 100%; height: 100%" class="echarts-box"></div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { nextTick, ref, onMounted, onBeforeUnmount, watch, markRaw } from 'vue'
import { useDebounceFn, useResizeObserver, useParentElement } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    opts?: echarts.EChartsInitOpts,
    options: echarts.EChartsOption,
    addEvent?: boolean
  }>(),
  {
    // https://echarts.apache.org/zh/api.html#echarts.init
    // 初始化传入的 opts
    opts: () => {
      return {
        renderer: 'canvas'
      }
    },
    options: () => {
      return {} as echarts.EChartsOption
    },
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

const parentEl = useParentElement()
useResizeObserver(echartsRef, () => {
  // 如果是 ResizeCard 组件，需要调用 resizeEchart 方法
  if (parentEl.value!.classList.contains('resize-card')) {
    resizeEchart()
  } else {
    debouncedFn()
  }
})
onMounted(() => {
  initEchart()
})
onBeforeUnmount(() => {
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
  echartsInstance.value = markRaw(echarts.init(echartsRef.value, null, props.opts))
  updateEchart()
  setTooltipScrollConfig()
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
    echartsInstance.value?.setOption(props.options, true)
    setTooltipScrollConfig()
  })
}

function resizeEchart () {
  echartsInstance.value?.resize()
  setTooltipScrollConfig()
}

function addClickEventFn () {
  echartsInstance.value?.on('click', (event) => {
    if (import.meta.env.DEV) console.log('event', event)
    emit('click', event)
  })
}

function removeClickEventFn () {
  echartsInstance.value?.off('click')
}

// 解决 tooltip 超出 echarts 容器问题
function setTooltipScrollConfig () {
  nextTick(() => {
    if (props.options && props.options.tooltip) {
      let chartBoxHeight = 200
      if (echartsRef.value) {
        chartBoxHeight = echartsRef.value.clientHeight
      }
      const tooltipConfig = {
        tooltip: {
          confine: true,
          enterable: true,
          extraCssText: `max-height: ${chartBoxHeight}px;max-width: 380px;overflow: auto;box-sizing: border-box;`
        }
      }
      echartsInstance.value?.setOption(tooltipConfig)
    }
  })
}
</script>

<style lang="scss">
.echarts-box {
  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px;
    background-color: #fff;
  }
  ::-webkit-scrollbar-track-piece {
    background-color: #efefef;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px #ccc;
  }
}
</style>
