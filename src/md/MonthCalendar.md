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

### RangeChangeValue

``` ts
interface DateType {
  date: Date
  dateStr: string
  fullDateStr: string
  type: 'prev-month' | 'current-month' | 'next-month'
  chinese?: string
  isWork?: boolean | undefined
}

interface RangeChangeValue {
  range: string[]
  rangeList: DateType[]
}
```

## 例子
