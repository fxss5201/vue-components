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
      <div v-for="item in monthList" :key="item.month" class="calendar-month">
        <div class="calendar-month-head">{{ item.month }}</div>
        <div class="calendar-month-body">
          <div v-for="week in weekNameList" :key="week" class="calendar-month-cell">{{ week }}</div>
          <div
            v-for="date in item.children"
            :key="date.date"
            class="calendar-month-cell"
            :class="{ 'calendar-month-cell-not': !date.isIn }"
          >
            {{ date.date }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { ref, watch } from 'vue'
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'

interface Props {
  year: number
  minWeek?: number
  weekStart?: number
  monthFormat?: string
  dateFormat?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['reduceYear', 'increaseYear', 'toNowYear'])

const monthList = ref<MonthType[]>([])
const weekNameList = ref<string[]>([])
const weekNames = ['日', '一', '二', '三', '四', '五', '六']
const renderKey = ref(new Date().getTime())

watch(
  () => props,
  (newValue) => {
    monthList.value = getYearCalendar(newValue.year, {
      minWeek: newValue.minWeek ?? 0,
      weekStart: newValue.weekStart ?? defaultWeekStart,
      monthFormat: newValue.monthFormat || 'YYYY-MM',
      dateFormat: newValue.dateFormat || 'DD'
    })

    const weekStart = newValue.weekStart ?? defaultWeekStart
    const weekNameArray = []
    for (let index = 0; index < 7; index++) {
      weekNameArray.push(weekNames[(weekStart + index) % 7])
    }
    weekNameList.value = weekNameArray
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

const defaultWeekStart = 1

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

interface OptionType {
  minWeek?: number
  weekStart?: number
  monthFormat?: string
  dateFormat?: string
}

interface DateType {
  date: string
  isIn: boolean
}

interface MonthType {
  month: string
  monthStart: string
  monthEnd: string
  cellStart: string
  cellEnd: string
  monthDays: number
  cellDays: number
  preEndDate: number
  nextStartDate: number
  children: DateType[]
}

function getMonthCalendar(year: number, month: number, option: OptionType = {}): MonthType {
  const configOption = {
    minWeek: 0,
    weekStart: defaultWeekStart,
    monthFormat: 'YYYY-MM',
    dateFormat: 'DD',
    ...option
  }
  const weekStart = configOption.weekStart % 7

  const monthDays = getDaysInMonth(year, month + 1)
  const curMonth = month + 1
  const curMonthStr = curMonth > 9 ? curMonth : `0${curMonth}`
  const monthStart = `${year}-${curMonthStr}-01`
  const monthEnd = `${year}-${curMonthStr}-${monthDays}`

  const monthStartDay = dayjs(monthStart).day()
  let preMonthDays = monthStartDay - weekStart
  if (preMonthDays < 0) preMonthDays = preMonthDays + 7
  const cellStart = dayjs(monthStart).subtract(preMonthDays, 'day').format('YYYY-MM-DD')

  let cellEnd
  let cellDays
  if (configOption.minWeek > 5) {
    cellDays = configOption.minWeek * 7
    cellEnd = dayjs(cellStart)
      .add(cellDays - 1, 'day')
      .format('YYYY-MM-DD')
  } else {
    let weekEnd = weekStart - 1
    if (weekEnd < 0) weekEnd = weekEnd + 7
    const monthEndDay = dayjs(monthEnd).day()
    let nextMonthDays = weekEnd - monthEndDay
    if (nextMonthDays < 0) nextMonthDays = nextMonthDays + 7
    cellEnd = dayjs(monthEnd).add(nextMonthDays, 'day').format('YYYY-MM-DD')
    cellDays = preMonthDays + monthDays + nextMonthDays
  }

  const preEndDate = preMonthDays
  const nextStartDate = preMonthDays + monthDays

  const monthChildren: DateType[] = []
  for (let index = 0; index < cellDays; index++) {
    monthChildren.push({
      date: dayjs(cellStart).add(index, 'day').format(configOption.dateFormat),
      isIn: preEndDate <= index && index < nextStartDate
    })
  }

  return {
    month: dayjs(monthStart).format(configOption.monthFormat),
    monthStart,
    monthEnd,
    cellStart,
    cellEnd,
    monthDays,
    cellDays,
    preEndDate,
    nextStartDate,
    children: monthChildren
  }
}

function getYearCalendar(year: number, option: OptionType = {}): MonthType[] {
  const configOption = {
    minWeek: 0,
    weekStart: defaultWeekStart,
    monthFormat: 'YYYY-MM',
    dateFormat: 'DD',
    ...option
  }
  const monthList = [...Array(12).keys()]
  return monthList.map((month) => {
    return getMonthCalendar(year, month, configOption)
  })
}
</script>

<style lang="scss" scoped>
.ml-12 {
  margin-left: 12px;
}
.calendar-year-box {
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

    .calendar-month {
      margin: 6px;
      border: 1px solid var(--el-border-color);
      border-radius: var(--el-border-radius-base);
      width: 350px;
    }
    .calendar-month-head {
      line-height: 40px;
      text-align: center;
    }
    .calendar-month-body {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      align-content: flex-start;
    }
    .calendar-month-cell {
      flex: 0 0 calc(100% / 7);
      text-align: center;
      padding: 6px 4px;
      border-top: 1px solid var(--el-border-color);
      border-left: 1px solid var(--el-border-color);
      word-break: break-all;
    }
    .calendar-month-cell:nth-child(7n + 1) {
      border-left: 0;
    }
    .calendar-month-cell-not {
      color: #ccc;
    }
  }
}
</style>
