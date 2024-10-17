<template>
  <div class="simple-swiper-box">
    <div class="simple-swiper" ref="simpleSwiper">
      <div class="simple-swiper-arrow" v-if="isHadButton && prevNextButtonFlag">
        <el-button :icon="ArrowLeftBold" circle @click="doChangeMarginLeft('l')" :disabled="nowChangeNum === 1" />
      </div>
      <div class="simple-swiper-wrapper" ref="simpleSwiperWeapper">
        <div class="simple-swiper-content" ref="simpleSwiperContent" :style="{ transitionDuration: `${changeDuration}s` }">
          <slot></slot>
        </div>
      </div>
      <div class="simple-swiper-arrow" v-if="isHadButton && prevNextButtonFlag">
        <el-button :icon="ArrowRightBold" circle @click="doChangeMarginLeft('r')" :disabled="nowChangeNum === maxCanChangeNum" />
      </div>
    </div>
    <div class="simple-swiper-pagination" v-if="paginationFlag">
      <el-pagination
        :current-page="nowChangeNum"
        :page-count="maxCanChangeNum"
        layout="prev, pager, next"
        size="small"
        background
        hide-on-single-page
        @current-change="paginationCurrentChange"
      ></el-pagination>
    </div>
    <div class="simple-swiper-indicators" v-if="props.showIndicators">{{ nowChangeNum }} / {{ maxCanChangeNum }}</div>
    <div class="simple-swiper-bullets" v-if="bulletsFlag">
      <template v-for="item in bulletsList" :key="item">
        <el-tooltip
          effect="dark"
          :content="String(item)"
          placement="bottom"
          :disabled="!props.bulletsTooltip"
        >
          <div class="simple-swiper-bullets-item" :class="{ active: nowChangeNum === item }" @click="doBulletsClick(item)"></div>
        </el-tooltip>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'
import { nextTick, ref, onMounted, watch, computed } from 'vue'
import { useDebounceFn, useResizeObserver } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    itemWidth: number
    itemDuration?: number
    length: number
    switchingMethod: 'prevNextButton' | 'pagination' | 'bullets'
    showIndicators?: boolean
    bulletsNumber?: number
    bulletsTooltip?: boolean
  }>(),
  {
    // 单个子项目滚动的耗时，单位ms
    itemDuration: 180,
    switchingMethod: 'prevNextButton',
    showIndicators: false,
    // 传奇数
    bulletsNumber: 5,
    bulletsTooltip: false
  }
)

const emit = defineEmits<{
  change: [curNum: number, allNum: number]
}>()

const prevNextButtonFlag = computed(() => {
  return props.switchingMethod === 'prevNextButton'
})

const paginationFlag = computed(() => {
  return props.switchingMethod === 'pagination'
})

const bulletsFlag = computed(() => {
  return props.switchingMethod === 'bullets'
})

const bulletsList = computed(() => {
  const listLength = maxCanChangeNum.value < props.bulletsNumber ? maxCanChangeNum.value : props.bulletsNumber
  const list = Array.from({ length: maxCanChangeNum.value }).map((_, index) => index + 1)
  if (listLength === props.bulletsNumber) {
    const halfBulletsNumber = Math.floor(props.bulletsNumber / 2)
    const nowList: number[] = []
    if (nowChangeNum.value < halfBulletsNumber + 1) {
      nowList.push(...list.slice(0, listLength))
    } else if (nowChangeNum.value > maxCanChangeNum.value - halfBulletsNumber) {
      nowList.push(...list.slice(maxCanChangeNum.value - listLength))
    } else {
      nowList.push(...list.slice(nowChangeNum.value - halfBulletsNumber - 1, nowChangeNum.value + halfBulletsNumber))
    }
    return nowList
  }
  return list
})

const simpleSwiper = ref<HTMLDivElement>()
const simpleSwiperWeapper = ref<HTMLDivElement>()
const simpleSwiperContent = ref<HTMLDivElement>()
const isHadButton = ref(false)
const singleChangeWidth = ref(0)
const singleChangeDuration = ref(0)
const changeDuration = ref(0)
const maxCanChangeNum = ref(0)
const nowChangeNum = ref(1)

const debouncedFn = useDebounceFn(() => {
  doCreateSwiper()
}, 200, { maxWait: 800 })
useResizeObserver(simpleSwiper, () => {
  debouncedFn()
})

watch(
  () => [props.length, props.itemWidth, props.itemDuration, props.switchingMethod],
  () => {
    doCreateSwiper()
  }
)

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
  simpleSwiperContent.value!.style.width = `${simpleSwiperContentWidth}px`
  simpleSwiperContent.value!.style.marginLeft = '0px'
  const num = Math.floor(simpleSwiperWeapperWidth / props.itemWidth)
  singleChangeWidth.value = num * props.itemWidth
  singleChangeDuration.value = num * props.itemDuration / 1000
  maxCanChangeNum.value = Math.ceil(props.length / num)
  nowChangeNum.value = 1
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

function doChangeMarginLeft (flag: string) {
  let nowMarginLeft = simpleSwiperContent.value!.style.marginLeft
  let curMarginLeft = nowMarginLeft ? parseInt(nowMarginLeft) : 0
  if (flag === 'r') {
    if (nowChangeNum.value < maxCanChangeNum.value) {
      curMarginLeft -= singleChangeWidth.value
      nowChangeNum.value++
    }
  } else {
    if (nowChangeNum.value > 1) {
      curMarginLeft += singleChangeWidth.value
      nowChangeNum.value--
    }
  }
  emit('change', nowChangeNum.value, maxCanChangeNum.value)
  changeDuration.value = singleChangeDuration.value
  simpleSwiperContent.value!.style.marginLeft = `${curMarginLeft}px`
}

function paginationCurrentChange (cur: number) {
  doChangeByPagination(cur)
}

function doChangeByPagination (cur: number) {
  if (cur >= 1 && cur <= maxCanChangeNum.value) {
    changeDuration.value = Math.abs(cur - nowChangeNum.value) * singleChangeDuration.value
    console.log(changeDuration.value)
    nowChangeNum.value = cur
    emit('change', nowChangeNum.value, maxCanChangeNum.value)
    const curMarginLeft = (cur - 1) * singleChangeWidth.value * -1
    simpleSwiperContent.value!.style.marginLeft = `${curMarginLeft}px`
  }
}

function doBulletsClick (cur: number) {
  if (nowChangeNum.value !== cur) {
    doChangeByPagination(cur)
  }
}
</script>

<style lang="scss" scoped>
.simple-swiper-box {
  position: relative;
  .simple-swiper {
    display: flex;
    align-items: center;
    .simple-swiper-arrow {
      flex: 0 0 40px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
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
  .simple-swiper-pagination {
    display: flex;
    justify-content: center;
  }
  .simple-swiper-indicators {
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.6);
    padding: 4px 6px;
    font-size: 12px;
    border-radius: 4px;
    color: #fff;
  }
  .simple-swiper-bullets {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
   .simple-swiper-bullets-item {
      flex-shrink: 0;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #ccc;
      margin: 0 4px;
      cursor: pointer;
      &:hover, &.active {
        background-color: var(--el-color-primary);
      }
    }
  }
}
</style>
