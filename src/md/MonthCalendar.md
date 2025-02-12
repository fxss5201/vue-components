# MonthCalendar

简介：月日历组件。

## props

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | :--- |
| weekStart | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | 1 | 周开始日，默认星期一 |
| weekNames | `string[]` | ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'] | 周的中文名称 |
| titleFormat | `string` | YYYY-MM | 标题的格式，以 [dayjs](https://day.js.org/docs/en/parse/string-format#list-of-all-available-parsing-tokens) 格式 |
| dateFormat | `string` | DD | 月天格式，以 [dayjs](https://day.js.org/docs/en/parse/string-format#list-of-all-available-parsing-tokens) 格式 |
| needChinese | `boolean` | true | 是否展示阴历日期 |
| needHoliday | `boolean` | true | 是否展示根据国家法定节假日 休/班 |

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | :--- |
| rangeChange | 日期范围改变事件 | `(e: RangeChangeValue) => void` |
| dateItemClick | 日期天点击事件 | `(e: DateType) => void` |

`rangeChange` 会在 `props` 变更时触发，内部 `watch` `props` 并配置 `immediate: true`，在使用中可以直接使用 `rangeChange` 事件获取数据。

### ts 类型

``` ts
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
```

## Slots

| 插槽名 | 插槽Prop | 说明 |
| --- | --- | :--- |
| dateTitle | `curMonth` 当前月份 | 左右按钮、当前日期、今按钮 自定义展示 |
| dateTool | `curMonth` 当前月份 | 右上角自定义按钮区域 |
| dateItem | `dateItem`: DateType | 自定义渲染内容 |

## 例子

``` vue
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
```
