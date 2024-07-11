<template>
  <div class="calendar-year-box" :key="renderKey">
    <div class="calendar-head">
      <el-button-group>
        <el-button :icon="ArrowLeftBold" @click="reduceYear"></el-button>
        <el-button>{{ props.year }}</el-button>
        <el-button :icon="ArrowRightBold" @click="increaseYear"></el-button>
      </el-button-group>
      <el-button class="ml-12" @click="toNowYear">今</el-button>
    </div>
    <div class="calendar-body">
      <CalendarMonth
        v-for="item in monthList"
        :key="item"
        :year="props.year"
        :month="item"
        :min-week="props.minWeek"
        :week-start="props.weekStart"
        :month-format="props.monthFormat"
        :date-format="props.dateFormat"
        :need-holiday="props.needHoliday"
        :need-chinese="props.needChinese"
      ></CalendarMonth>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'
import CalendarMonth from './CalendarMonth.vue'

interface Props {
  year: number
  minWeek?: number
  weekStart?: number
  monthFormat?: string
  dateFormat?: string
  needHoliday?: boolean
  needChinese?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['reduceYear', 'increaseYear', 'toNowYear'])

const monthList = ref<number[]>([...Array(12).keys()])
const renderKey = ref(new Date().getTime())

watch(
  () => props,
  () => {
    renderKey.value = new Date().getTime()
  },
  { deep: true, immediate: true }
)

function reduceYear() {
  emit('reduceYear')
}
function increaseYear() {
  emit('increaseYear')
}
function toNowYear() {
  emit('toNowYear')
}
</script>

<style lang="scss" scoped>
.ml-12 {
  margin-left: 12px;
}
.calendar-year-box {
  line-height: 1.6;
  font-size: 14px;
  .calendar-head {
  }
  .calendar-body {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    align-content: flex-start;
    overflow: hidden;
    width: 100%;
    margin: -6px;
    margin-top: 12px;
  }
}
</style>
