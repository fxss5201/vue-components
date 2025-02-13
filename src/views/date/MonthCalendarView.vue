<template>
  <div class="page-no-top-padding">
    <MarkdownCard :content="MonthCalendarMd" />
    <el-form :inline="true" :model="formInline" style="margin-top: 20px;">
      <el-form-item label="weekStart：">
        <el-select
          v-model="formInline.weekStart"
          placeholder="周开始日"
          style="width: 150px;"
        >
          <el-option v-for="item in weekNumbers"
            :key="item" :label="weekNameMap[item]" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="titleFormat：">
        <el-select
          v-model="formInline.titleFormat"
          placeholder="标题的格式"
          style="width: 150px;"
        >
          <el-option label="YYYY-MM" value="YYYY-MM" />
          <el-option label="YYYY-M" value="YYYY-M" />
          <el-option label="YYYY年MM月" value="YYYY年MM月" />
          <el-option label="YYYY年M月" value="YYYY年M月" />
        </el-select>
      </el-form-item>
      <el-form-item label="dateFormat：">
        <el-select
          v-model="formInline.dateFormat"
          placeholder="标题的格式"
          style="width: 150px;"
        >
          <el-option label="DD" value="DD" />
          <el-option label="D" value="D" />
          <el-option label="DD日" value="DD日" />
          <el-option label="D日" value="D日" />
        </el-select>
      </el-form-item>
      <el-form-item label="needChinese：">
        <el-switch v-model="formInline.needChinese" />
      </el-form-item>
      <el-form-item label="needHoliday：">
        <el-switch v-model="formInline.needHoliday" />
      </el-form-item>
    </el-form>
    <MonthCalendar
      :week-start="formInline.weekStart"
      :title-format="formInline.titleFormat"
      :date-format="formInline.dateFormat"
      :need-chinese="formInline.needChinese"
      :need-holiday="formInline.needHoliday"
      @range-change="rangeChangeFn"
      @date-item-click="dateItemClickFn">
      <template v-slot:dateItem="{ dateItem }">
        <div>{{ dateItem.fullDateStr }}</div>
        <div>{{ dateItem.type }}</div>
      </template>
    </MonthCalendar>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import MonthCalendar from '@/components/MonthCalendar.vue'
import type { PropsType, DateType, RangeChangeValue } from '@/components/MonthCalendar.vue'
import MarkdownCard from '@/components/MarkdownCard.vue'
import MonthCalendarMd from '@/md/MonthCalendar.md?raw'

const formInline = reactive<PropsType>({
  weekStart: 1,
  titleFormat: 'YYYY-MM',
  dateFormat: 'DD',
  needChinese: true,
  needHoliday: true
})

const weekNumbers = ref<number[]>([0, 1, 2, 3, 4, 5, 6])
interface WeekNameMapType {
  [key: string]: string
}
const weekNameMap = ref<WeekNameMapType>({
  0: '星期日',
  1: '星期一',
  2: '星期二',
  3: '星期三',
  4: '星期四',
  5: '星期五',
  6: '星期六'
})

function rangeChangeFn (value: RangeChangeValue) {
  console.log('rangeChange', value)
}

function dateItemClickFn (value: DateType) {
  console.log('dateItemClick', value)
}
</script>
