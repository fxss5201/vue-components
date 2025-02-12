<template>
  <div class="month-calendar">
    <div class="calendar-head">
      <div class="calendar-head-left">
        <slot name="dateTitle" :curMonth="curMonth">
          <el-button-group>
            <el-button :icon="ArrowLeftBold" @click="reduceMonthFn"></el-button>
            <el-button>{{ curMonthStr }}</el-button>
            <el-button :icon="ArrowRightBold" @click="increaseMonthFn"></el-button>
          </el-button-group>
          <el-button class="ml-12" @click="toNowMonthFn">今</el-button>
        </slot>
      </div>
      <div class="calendar-head-right">
        <slot name="dateTool" :curMonth="curMonth"></slot>
      </div>
    </div>
    <div class="calendar-week">
      <div v-for="(item, index) in weekNameList" :key="index" class="calendar-week-item">{{ item }}</div>
    </div>
    <div class="calendar-body">
      <div v-for="(item, index) in dateList"
        :key="index"
        @click="dateItemClickFn(item)"
        class="calendar-body-item" :class="item.type">
        <div class="date-item-head">
          <div class="date" :class="{ 'now-date': item.fullDateStr === nowDate }">{{ item.dateStr }}</div>
          <div v-if="item.isWork !== undefined" class="work" :class="{ 'text-red': item.isWork }">{{ item.isWork ? '班' : '休' }}</div>
          <div v-if="item.chinese" class="chinese" :title="item.chinese">{{ item.chinese }}</div>
        </div>
        <slot name="dateItem" v-bind:dateItem="item"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { Lunar, Solar, HolidayUtil } from 'lunar-typescript'
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'

export interface PropsType {
  weekStart?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  weekNames?: string[]
  titleFormat?: string
  dateFormat?: string
  needChinese?: boolean
  needHoliday?: boolean
}

export interface DateType {
  date: Date
  dateStr: string
  fullDateStr: string
  type: 'prev-month' | 'current-month' | 'next-month'
  chinese?: string
  isWork?: boolean | undefined
}

export interface RangeChangeValue {
  range: string[]
  rangeList: DateType[]
}

const props = withDefaults(defineProps<PropsType>(), {
  weekStart: 1,
  weekNames: () => ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  titleFormat: 'YYYY-MM',
  dateFormat: 'DD',
  needChinese: true,
  needHoliday: true
})
const emit = defineEmits<{
  rangeChange: [value: RangeChangeValue],
  dateItemClick: [value: DateType]
}>()

const weekNameList = ref<string[]>([])
const dateList = ref<DateType[]>([])
const curMonth = ref(dayjs().format('YYYY-MM'))
const nowDate = ref(dayjs().format('YYYY-MM-DD'))

const curMonthStr = computed(() => {
  return dayjs(curMonth.value).format(props.titleFormat)
})

watch(
  () => props,
  (val) => {
    weekNameList.value = val.weekNames!.slice(val.weekStart!).concat(val.weekNames!.slice(0, val.weekStart!))
    doGetAndEmit()
  },
  {
    immediate: true,
    deep: true
  }
)

function doGetAndEmit () {
  dateList.value = getMonthCalendar(curMonth.value.split('-').map(Number))
  emit('rangeChange', {
    range: [dateList.value[0].fullDateStr, dateList.value[dateList.value.length - 1].fullDateStr],
    rangeList: dateList.value
  })
}

function reduceMonthFn () {
  curMonth.value = dayjs(curMonth.value).subtract(1, 'month').format('YYYY-MM')
  doGetAndEmit()
}

function increaseMonthFn () {
  curMonth.value = dayjs(curMonth.value).add(1,'month').format('YYYY-MM')
  doGetAndEmit()
}

function toNowMonthFn () {
  curMonth.value = dayjs().format('YYYY-MM')
  doGetAndEmit()
}

function dateItemClickFn (item: DateType) {
  emit('dateItemClick', item)
}

function getMonthCalendar ([year, month]: number[]) {
  // 日期列表
  const dateList = []
  // 星期开始
  const weekStart = props.weekStart
  // 星期结束
  const weekEnd = weekStart + 6
  // 本月第一天
  const firstDay = new Date(year, month - 1, 1)
  // 本月第一天星期
  const firstDayWeek = firstDay.getDay()
  // 本月最后一天
  const lastDay = new Date(year, month, 0)
  // 本月最后一天星期
  const lastDayWeek = lastDay.getDay()
  // 本月第一天前的天数
  let beforeDays = (firstDayWeek - weekStart) % 7
  if (beforeDays < 0) beforeDays = 7 + beforeDays
  // 本月最后一天后的天数
  let afterDays = (weekEnd - lastDayWeek) % 7
  if (afterDays < 0) afterDays = 7 + afterDays
  // 本月天数
  const monthDays = lastDay.getDate()
  // 本月第一天前的日期
  for (let i = 0; i < beforeDays; i++) {
    const date = new Date(year, month - 1, i - beforeDays + 1)
    dateList.push(dateToDateType(date, 'prev-month'))
  }
  // 本月日期
  for (let i = 0; i < monthDays; i++) {
    const date = new Date(year, month - 1, i + 1)
    dateList.push(dateToDateType(date, 'current-month'))
  }
  // 本月最后一天后的日期
  for (let i = 0; i < afterDays; i++) {
    const date = new Date(year, month, i + 1)
    dateList.push(dateToDateType(date, 'next-month'))
  }
  return dateList
}

function dateToDateType (date: Date, type: DateType['type']): DateType {
  const dateType: DateType = {
    date: date,
    dateStr: dayjs(date).format(props.dateFormat),
    fullDateStr: dayjs(date).format('YYYY-MM-DD'),
    type
  }
  if (props.needChinese) {
    dateType.chinese = getChinese(date)
  }
  if (props.needHoliday) {
    dateType.isWork = getHoliday(date)
  }

  return dateType
}

function getChinese (date: Date) {
  const lunarDate = Lunar.fromDate(date)
  const currentJieQi = lunarDate.getCurrentJieQi()
  const solarDate = Solar.fromDate(date)
  const lunarFestivals = lunarDate.getFestivals()
  const solarFestivals = solarDate.getFestivals()
  return lunarFestivals.length > 0
          ? lunarFestivals[0]
          : solarFestivals.length > 0
            ? solarFestivals[0]
            : currentJieQi
              ? currentJieQi.getName()
              : lunarDate.getDayInChinese() === '初一'
                ? `${lunarDate.getMonthInChinese()}月`
                : lunarDate.getDayInChinese()
}

function getHoliday (date: Date) {
  const curHoliday = HolidayUtil.getHoliday(dayjs(date).format('YYYY-MM-DD'))
  if (curHoliday) {
    return curHoliday.isWork()
  }
}
</script>

<style lang="scss" scoped>
.month-calendar {
  border-radius: 4px;
  .calendar-head {
    padding: 16px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--el-border-color-lighter);

    .calendar-head-left,
    .calendar-head-right {
      display: flex;
      align-items: center;
    }
  }
  .calendar-week {
    display: flex;
    align-items: stretch;
    height: 40px;
    .calendar-week-item {
      flex: 0 0 calc(100% / 7);
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px solid var(--el-border-color-lighter);
      &:nth-child(1) {
        border-left: 1px solid var(--el-border-color-lighter);
      }
    }
  }
  .calendar-body {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    border-left: 1px solid var(--el-border-color-lighter);
    border-top: 1px solid var(--el-border-color-lighter);
    .calendar-body-item {
      flex: 0 0 calc(100% / 7);
      height: 88px;
      position: relative;
      cursor: pointer;
      transition: all 0.3s;
      overflow: hidden;
      border-bottom: 1px solid var(--el-border-color-lighter);
      border-right: 1px solid var(--el-border-color-lighter);
      &:hover {
        background-color: var(--el-color-primary-light-9);
      }
      &.prev-month,
      &.next-month {
        .date {
          color: var(--el-text-color-placeholder);
        }
      }
      .date-item-head {
        padding: 6px 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 34px;
        .date {
          flex: auto;
          font-weight: 500;
          font-size: 16px;
          line-height: 22px;
          &.now-date {
            color: #465AFC !important;
          }
        }
        .chinese {
          flex: auto;
          text-align: right;
          font-size: 14px;
          color: #8E98AD;
          line-height: 17px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-left: 4px;
        }
        .work {
          flex-shrink: 0;
          font-size: 14px;
          color: #5DB034;
          line-height: 17px;
          margin-left: 4px;
          &.text-red {
            color: #F56C6C;
          }
        }
      }
    }
  }
}
.ml-12 {
  margin-left: 12px;
}
</style>
