<template>
  <div class="notice-bar" ref="noticeBarRef" :style="noticeStyleValue">
    <div v-if="$slots.left || leftText || leftIcon || leftIconfont"
      @click="leftClickFn"
      class="notice-bar__left">
      <slot v-if="$slots.left" name="left"></slot>
      <template v-else>
        <div class="notice-bar__text">{{ leftText }}</div>
        <div v-if="leftIcon || leftIconfont" class="notice-bar__left-icon">
          <el-icon v-if="leftIcon" :size="iconSizeValue">
            <component :is="leftIcon" />
          </el-icon>
          <IconSvg
            v-else-if="leftIconfont"
            :icon="leftIconfont"
             :size="iconSizeValue"
          />
        </div>
      </template>
    </div>
    <div class="notice-bar__center">
      <el-scrollbar ref="scrollbarRef">
        <slot></slot>
      </el-scrollbar>
    </div>
    <div v-if="$slots.right || rightText || rightIcon || rightIconfont"
      @click="rightClickFn"
      class="notice-bar__right">
      <slot v-if="$slots.right" name="right"></slot>
      <template v-else>
        <div class="notice-bar__text">{{ rightText }}</div>
        <div v-if="rightIcon || rightIconfont" class="notice-bar__right-icon">
          <el-icon v-if="rightIcon" :size="iconSizeValue">
            <component :is="rightIcon" />
          </el-icon>
          <IconSvg
            v-else-if="rightIconfont"
            :icon="rightIconfont"
             :size="iconSizeValue"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Component, CSSProperties } from 'vue'
import { computed, ref, onMounted, nextTick, onUpdated, onBeforeUnmount } from 'vue'
import IconSvg from '@/components/IconSvg.vue'
import { useDebounceFn, useResizeObserver } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    noticeStyle?: CSSProperties | CSSProperties[]
    background?: string
    leftText?: string
    rightText?: string
    leftIcon?: Component
    rightIcon?: Component
    leftIconfont?: string
    rightIconfont?: string
    iconSize?: string | number
    scrollSpeed?: number
    delayTime?: number
  }>(),
  {
    background: '#fffbe8',
    leftText: '公告',
    leftIconfont: 'icon-notice',
    iconSize: 16,
    scrollSpeed: 1, // requestAnimationFrame 滚动的距离
    delayTime: 1888 // 滚动开始结束时的延迟时间
  }
)

const emits = defineEmits<{
  leftClick: [e: Event]
  rightClick: [e: Event]
  scrollStart: []
  scrollEnd: []
  canScrollChange: [value: boolean]
}>()

const scrollbarRef = ref()
const isScroll = ref(true)
const scrollTimer = ref<number | null>()
const scrollValue = ref(0)
const mouseenterFn = ref<Function | null>()
const mouseleaveFn = ref<Function | null>()
const timer = ref<number>(0)

onMounted(() => {
  nextTick(() => {
    debouncedFn()
  })
})

onUpdated(() => {
  nextTick(() => {
    debouncedFn()
  })
})

onBeforeUnmount(() => {
  doCancleScrollFn()
})

const noticeBarRef = ref<HTMLDivElement>()
const debouncedFn = useDebounceFn(() => {
  doCancleScrollFn()
  doScrollFn()
}, 200, { maxWait: 800 })
useResizeObserver(noticeBarRef, () => {
  debouncedFn()
})

function doScrollFn () {
  const noticeBarBox = scrollbarRef.value!.$el
  const noticeBarWrap = scrollbarRef.value!.$el.querySelector('.el-scrollbar__wrap')
  const noticeBarScrollWidth = noticeBarWrap.scrollWidth
  const noticeBarOffsetWidth = noticeBarWrap.offsetWidth
  emits('canScrollChange', noticeBarScrollWidth > noticeBarOffsetWidth)
  if (noticeBarScrollWidth > noticeBarOffsetWidth) {
    let scrollSpeed = 0
    timer.value = 0
    const delayTime = props.delayTime
    const scrollValueMax = noticeBarScrollWidth - noticeBarOffsetWidth
    const scrollFn = () => {
      scrollValue.value += scrollSpeed
      const nowTime = new Date().getTime()
      if ((scrollValue.value === 0 || scrollValue.value >= scrollValueMax) && timer.value === 0) {
        timer.value = nowTime
        scrollSpeed = 0
        if (scrollValue.value >= scrollValueMax) {
          emits('scrollEnd')
        }
      } else if ((scrollValue.value === 0 || scrollValue.value >= scrollValueMax) && nowTime - timer.value > delayTime) {
        scrollSpeed = props.scrollSpeed
        timer.value = 0
        if (scrollValue.value === 0) {
          emits('scrollStart')
        }
        if (scrollValue.value >= scrollValueMax) {
          scrollValue.value = 0
          timer.value = nowTime
          scrollSpeed = 0
        }
      }
      if (scrollValue.value > 0 && scrollValue.value < scrollValueMax && scrollSpeed === 0) {
        scrollSpeed = props.scrollSpeed
        timer.value = 0
      }
      scrollbarRef.value?.setScrollLeft(scrollValue.value)
      if (isScroll.value) {
        scrollTimer.value = window.requestAnimationFrame(scrollFn)
      } else {
        if (scrollTimer.value) {
          window.cancelAnimationFrame(scrollTimer.value)
          scrollTimer.value = null
        }
      }
    }
    scrollFn()
  
    mouseenterFn.value = () => {
      isScroll.value = false
    }
    noticeBarBox.addEventListener('mouseenter', mouseenterFn.value)
    mouseleaveFn.value = () => {
      scrollValue.value = noticeBarWrap.scrollLeft
      isScroll.value = true
      scrollFn()
    }
    noticeBarBox.addEventListener('mouseleave', mouseleaveFn.value)
  }
}

function doCancleScrollFn () {
  isScroll.value = true
  scrollValue.value = 0
  const noticeBarBox = scrollbarRef.value!.$el
  noticeBarBox.removeEventListener('mouseenter', mouseenterFn.value)
  mouseenterFn.value = null
  noticeBarBox.removeEventListener('mouseleave', mouseleaveFn.value)
  mouseleaveFn.value = null
  if (scrollTimer.value) {
    window.cancelAnimationFrame(scrollTimer.value)
    scrollTimer.value = null
  }
}

function leftClickFn (e: Event) {
  emits('leftClick', e)
}

function rightClickFn (e: Event) {
  emits('rightClick', e)
}

const noticeStyleValue = computed(() => {
  if (Array.isArray(props.noticeStyle)) {
    return [...props.noticeStyle, { background: props.background }]
  }
  return {
    ...props.noticeStyle,
    background: props.background
  }
})

const iconSizeValue = computed(() => {
  if (typeof props.iconSize === 'string') {
    return props.iconSize
  }
  return `${props.iconSize}px`
})
</script>

<style lang="scss" scoped>
.notice-bar {
  display: flex;
  align-items: center;
  padding: 8px 16px;

  .notice-bar__left,
  .notice-bar__right {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .notice-bar__left {
    .notice-bar__text {
      margin-right: 4px;
    }
  }

  .notice-bar__right {
   .notice-bar__text {
      margin-left: 4px;
    }
  }

  .notice-bar__left-icon,
  .notice-bar__right-icon {
    line-height: 1;
  }

  .notice-bar__center {
    margin-left: 12px;
    flex: auto;
    white-space: nowrap;
    overflow: hidden;
  }
  .notice-bar__right {
    margin-left: 12px;
  }
}
</style>
