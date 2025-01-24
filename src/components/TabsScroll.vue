<template>
  <div class="tabs-box" ref="tabsBoxRef">
    <el-scrollbar v-wheel="wheelHandler" ref="scrollbarRef" @scroll="scrollFn">
      <div class="tabs-list">
        <div v-for="(item, index) in props.tabs" :key="item.key"
          :class="[`tabs-item-${index}` ,{ 'tabs-item-active': item.key === model }]"
          @click="tabCLickFn(item)"
          class="tabs-item">
          <div v-if="$slots.tabName" class="tabs-item-name">
            <slot name="tabName" :data="item"></slot>
          </div>
          <div v-else class="tabs-item-name">{{ item.name }}</div>
          <div class="tabs-item-close" @click.stop="tabCloseFn(item)">
            <el-icon :size="14"><Close /></el-icon>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, onUpdated, ref, watch } from 'vue'
import type { Tab } from '@/types/TabsScrollType.ts'
import { vWheel } from '@/directive/vWheel'
import { ElScrollbar } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import { useResizeObserver } from '@vueuse/core'

const model = defineModel({ type: String, default: '' })
const emit = defineEmits<{
  tabClick: [value: Tab]
  tabChange: [value: Tab]
  tabClose: [value: Tab]
}>()

const props = withDefaults(
  defineProps<{
    tabs: Tab[],
    scrollSpeed?: number
  }>(),
  {
    tabs: () => [],
    scrollSpeed: 18
  }
)

const scrollLeft = ref(0)
const scrollLeftMax = ref(0)
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()

function tabCLickFn (item: Tab) {
  emit('tabClick', item)
  if (item.key === model.value) {
    return
  }
  model.value = item.key
  emit('tabChange', item)
}

function tabCloseFn (item: Tab) {
  emit('tabClose', item)
}

function wheelHandler (e: WheelEvent) {
  e.preventDefault()
  if (e.deltaY > 0) {
    scrollLeft.value += props.scrollSpeed
  } else {
    scrollLeft.value -= props.scrollSpeed
  }
  if (scrollLeft.value < 0) {
    scrollLeft.value = 0
  } else if (scrollLeft.value > scrollLeftMax.value) {
    scrollLeft.value = scrollLeftMax.value
  }
  scrollbarRef.value?.setScrollLeft(scrollLeft.value)
}

function getScrollLeftMax () {
  nextTick(() => {
    const scrollbarWrap = scrollbarRef.value!.$el.querySelector('.el-scrollbar__wrap')
    scrollLeftMax.value = scrollbarWrap.scrollWidth - scrollbarWrap.offsetWidth
  })
}

onMounted(() => {
  getScrollLeftMax()
})

onUpdated(() => {
  getScrollLeftMax()
})

watch(
  () => model.value,
  () => {
    nextTick(() => {
      const curIndex = props.tabs.findIndex(item => item.key === model.value)
      const tabsItem = tabsBoxRef.value!.querySelector(`.tabs-item-${curIndex}`)
      if (!tabsItem) {
        return
      }
      const tabsFirst = tabsBoxRef.value!.querySelector(`.tabs-item-0`)
      if (!tabsFirst) {
        return
      }
      const tabsFirstLeft = tabsFirst!.getBoundingClientRect().left

      const tabsItemLeft = tabsItem.getBoundingClientRect().left
      const tabsItemLeftWidth = (tabsItem as HTMLElement).offsetWidth

      const tabsBoxWidth = tabsBoxRef.value!.offsetWidth
      const scrollLeftPx = tabsItemLeft - tabsFirstLeft - tabsBoxWidth + tabsItemLeftWidth

      scrollbarRef.value?.setScrollLeft(scrollLeftPx)
      scrollLeft.value = scrollLeftPx
    })
  }
)

watch(
  () => props.tabs,
  () => {
    getScrollLeftMax()
  },
  {
    deep: true
  }
)

const tabsBoxRef = ref<HTMLDivElement>()
useResizeObserver(tabsBoxRef, () => {
  getScrollLeftMax()
})

function scrollFn (e: { scrollLeft: number }) {
  scrollLeft.value = e.scrollLeft
}
</script>

<style lang="scss" scoped>
.tabs-box {
  height: 40px;
}

.tabs-list {
  display: flex;
  height: 40px;
  align-items: stretch;

  .tabs-item {
    flex-shrink: 0;
    padding: 0 3px 0 12px;
    display: flex;
    align-items: center;
    background-color: #f5f7fa;
    cursor: pointer;
    &:hover {
      background-color: #fff;

      .tabs-item-close {
        visibility: visible;
      }
    }
  }

  .tabs-item + .tabs-item {
    border-left: 1px solid var(--el-menu-border-color);
  }

  .tabs-item-active {
    background-color: #fff;
    .tabs-item-close {
      visibility: visible;
    }
  }

  .tabs-item-close {
    visibility: hidden;
    margin-left: 3px;
    padding: 2px;
    font-size: 0;
    line-height: 1;
    border-radius: 2px;
    &:hover {
      background-color: #f5f7fa;
    }
  }
}
</style>
