# SimpleSwiper

简介：简单的轮播组件

## props

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | :--- |
| itemWidth | `number` | - | 单个子项宽度 |
| itemDuration | `number` | - | 单个子项目滚动的耗时，单位ms |
| length | `number` | - | 一共有多少子项 |
| switchingMethod | `'prevNextButton' \| 'pagination' \| 'bullets'` | `prevNextButton` | 切换方式 |
| showIndicators | `boolean` | `false` | 是否显示进度（1/3） |
| bulletsNumber | `number` | 5 | 以 `bullets` 圆点展示的时候，当页数很多的时候，设置仅显示几个 |
| bulletsTooltip | `boolean` | `false` | 以 `bullets` 圆点展示的时候，当页数很多的时候，圆点的提示 |

切换方式：

- `prevNextButton` 上一个/下一个按钮
- `pagination` 分页
- `bullets` 圆点

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | :--- |
| change | 切换时触发 | `(curNum: number, allNum: number) => void` |

## 例子
