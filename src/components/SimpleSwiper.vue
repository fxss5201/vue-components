<template>
  <div class="simple-swiper" ref="simpleSwiper">
    <div class="simple-swiper-arrow" v-if="isHadButton" @click="doChangeMarginLeft('l')">
      <el-icon :size="16"><ArrowLeftBold /></el-icon>
    </div>
    <div class="simple-swiper-wrapper" ref="simpleSwiperWeapper">
      <div class="simple-swiper-content" ref="simpleSwiperContent">
        <slot></slot>
      </div>
    </div>
    <div class="simple-swiper-arrow" v-if="isHadButton" @click="doChangeMarginLeft('r')">
      <el-icon :size="16"><ArrowRightBold /></el-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'
import { nextTick, ref, onMounted } from 'vue'
import { useDebounceFn, useResizeObserver } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    itemWidth?: number
    length?: number
  }>(),
  {
    itemWidth: 100,
    length: 10
  }
)

const simpleSwiper = ref<HTMLDivElement>()
const simpleSwiperWeapper = ref<HTMLDivElement>()
const simpleSwiperContent = ref<HTMLDivElement>()
const isHadButton = ref(false)
const singleChangeWidth = ref(0)
const maxCanChangeNum = ref(0)
const nowChangeNum = ref(0)

const debouncedFn = useDebounceFn(() => {
  doCreateSwiper()
}, 200, { maxWait: 800 })
useResizeObserver(simpleSwiper, () => {
  debouncedFn()
})

onMounted(() => {
  doCreateSwiper()
})

function doCreateSwiper () {
  nextTick(() => {
    createSwiper()
  })
}
function createSwiper () {
  const simpleSwiperWeapperWidth = simpleSwiperWeapper.value?.offsetWidth as number
  const simpleSwiperContentWidth = props.itemWidth * props.length
  if (simpleSwiperContent.value) {
    simpleSwiperContent.value.style.width = `${simpleSwiperContentWidth}px`
    simpleSwiperContent.value.style.marginLeft = '0px'
    const num = Math.floor(simpleSwiperWeapperWidth / props.itemWidth)
    singleChangeWidth.value = num * props.itemWidth
    maxCanChangeNum.value = Math.ceil(props.length / num)
    nowChangeNum.value = maxCanChangeNum.value
    let isHadButtonCur = false
    if (simpleSwiperContentWidth > simpleSwiperWeapperWidth) {
      isHadButtonCur = true
    }
    let isNeedDone = false
    if (isHadButton.value !== isHadButtonCur) {
      isNeedDone = true
    }
    isHadButton.value = isHadButtonCur
    if (isNeedDone) doCreateSwiper()
  }
}

function doChangeMarginLeft (flag: string) {
  if (!simpleSwiperContent.value) return
  let nowMarginLeft = simpleSwiperContent.value.style.marginLeft
  let curMarginLeft = nowMarginLeft ? parseInt(nowMarginLeft) : 0
  if (flag === 'r') {
    if (nowChangeNum.value > 1) {
      curMarginLeft -= singleChangeWidth.value
      nowChangeNum.value--
    }
  } else {
    if (nowChangeNum.value < maxCanChangeNum.value) {
      curMarginLeft += singleChangeWidth.value
      nowChangeNum.value++
    }
  }
  simpleSwiperContent.value.style.marginLeft = `${curMarginLeft}px`
}
</script>

<style lang="scss" scoped>
.simple-swiper {
  display: flex;
  align-items: center;
  .simple-swiper-arrow {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0px 0px 6px 0px rgba(75, 75, 75, 0.16);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
      color: var(--el-color-primary);
    }
  }
  .simple-swiper-wrapper {
    margin: 0 5px;
    flex: auto;
    overflow: hidden;
    .simple-swiper-content {
      display: flex;
      transition: all 1s;
    }
  }
}
</style>
