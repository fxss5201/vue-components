<template>
  <div :key="renderKey" class="calendar-month">
    <div class="calendar-month-head">{{ monthData.month }}</div>
    <div class="calendar-month-body">
      <div v-for="week in weekNameList" :key="week" class="calendar-month-cell">{{ week }}</div>
      <div
        v-for="date in monthData.children"
        :key="date.date"
        class="calendar-month-cell"
        :class="{
          'calendar-month-cell-not': !date.isIn,
          'calendar-month-cell-now': date.isNow,
          'calendar-month-cell-jie': date.jie
        }"
      >
        <div class="calendar-month-cell-title">
          <div class="calendar-month-cell-row" :title="date.date">{{ date.date }}</div>
          <div
            v-if="props.needChinese"
            class="calendar-month-cell-row calendar-month-cell-chinese"
            :title="date.chinese"
          >
            {{ date.chinese }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { ref, watch } from 'vue'
import { Lunar, Solar } from 'lunar-typescript'

interface Props {
  year: number
  month: number
  minWeek?: number
  weekStart?: number
  monthFormat?: string
  dateFormat?: string
  needChinese?: boolean
}

const props = defineProps<Props>()

const monthData = ref<MonthType>({
  month: '',
  monthStart: '',
  monthEnd: '',
  cellStart: '',
  cellEnd: '',
  monthDays: 0,
  cellDays: 0,
  preEndDate: 0,
  nextStartDate: 0,
  children: [] as DateType[]
})
const weekNameList = ref<string[]>([])
const weekNames = ['日', '一', '二', '三', '四', '五', '六']
const renderKey = ref(new Date().getTime())
const nowDate = ref(dayjs())

watch(
  () => props,
  (newValue) => {
    monthData.value = getMonthCalendar(newValue.year, newValue.month, {
      minWeek: newValue.minWeek ?? 0,
      weekStart: newValue.weekStart ?? defaultWeekStart,
      monthFormat: newValue.monthFormat || 'YYYY-MM',
      dateFormat: newValue.dateFormat || 'DD',
      needChinese: newValue.needChinese || false
    })

    const weekStart = newValue.weekStart ?? defaultWeekStart
    const weekNameArray: string[] = []
    for (let index = 0; index < 7; index++) {
      weekNameArray.push(weekNames[(weekStart + index) % 7])
    }
    weekNameList.value = weekNameArray
    renderKey.value = new Date().getTime()
  },
  { deep: true, immediate: true }
)

const defaultWeekStart = 1

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

interface OptionType {
  minWeek?: number
  weekStart?: number
  monthFormat?: string
  dateFormat?: string
  needChinese?: boolean
}

interface DateType {
  date: string
  fullDate: string
  isIn: boolean
  isNow: boolean
  chinese?: string
  jie?: boolean
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
    needChinese: false,
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
    const curDate = dayjs(cellStart).add(index, 'day')
    const fullDate = curDate.format('YYYY-MM-DD')
    if (configOption.needChinese) {
      const lunarDate = Lunar.fromDate(curDate.toDate())
      const currentJieQi = lunarDate.getCurrentJieQi()
      const solarDate = Solar.fromDate(curDate.toDate())
      const lunarFestivals = lunarDate.getFestivals()
      const solarFestivals = solarDate.getFestivals()
      monthChildren.push({
        fullDate,
        date: curDate.format(configOption.dateFormat),
        isIn: preEndDate <= index && index < nextStartDate,
        isNow: fullDate === nowDate.value.format('YYYY-MM-DD') && curDate.month() === month,
        jie: lunarFestivals.length > 0 || solarFestivals.length > 0,
        chinese:
          lunarFestivals.length > 0
            ? lunarFestivals[0]
            : solarFestivals.length > 0
              ? solarFestivals[0]
              : currentJieQi
                ? currentJieQi.getName()
                : lunarDate.getDayInChinese() === '初一'
                  ? `${lunarDate.getMonthInChinese()}月`
                  : lunarDate.getDayInChinese()
      })
    } else {
      monthChildren.push({
        fullDate,
        date: curDate.format(configOption.dateFormat),
        isIn: preEndDate <= index && index < nextStartDate,
        isNow: fullDate === nowDate.value.format('YYYY-MM-DD') && curDate.month() === month
      })
    }
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
</script>

<style lang="scss" scoped>
.calendar-month {
  margin: 6px;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  width: 380px;

  .calendar-month-head {
    line-height: 40px;
    text-align: center;
  }
  .calendar-month-body {
    display: flex;
    align-items: stretch;
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
    display: flex;
    justify-content: center;
    overflow: hidden;

    &.calendar-month-cell-not {
      color: #ccc;
      .calendar-month-cell-row.calendar-month-cell-chinese {
        color: #ccc;
      }
    }
    &.calendar-month-cell-now {
      background-color: var(--el-color-primary);
      color: #fff;
    }
    &.calendar-month-cell-jie {
      .calendar-month-cell-chinese {
        color: var(--el-color-primary);
      }
    }
  }
  .calendar-month-cell:nth-child(7n + 1) {
    border-left: 0;
  }
  .calendar-month-cell-title {
    overflow: hidden;
  }
  .calendar-month-cell-row {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
