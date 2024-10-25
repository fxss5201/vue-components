# ResizeCard

简介：可拖拽改变大小的卡片

## props

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| defaultWidth | `number` | 600 | 默认宽度 |
| defaultHeight | `number` | 500 | 默认高度 |
| minWidth | `number` | 200 | 最小宽度 |
| minHeight | `number` | 100 | 最小高度 |
| maxWidth | `number` | 1000 | 最大宽度 |
| maxHeight | `number` | 800 | 最大高度 |
| resize | `boolean` | true | 是否可改变大小 |
| autoWatchScroll | `boolean` | true | 是否自动监听滚动条的变化，默认自动监听调整右下角拖拽图标位置，设置为false时，需要手动设置isScroll属性 |
| isScroll | `boolean` | false | 是否有滚动条，需要调整右下角拖拽图标的位置 |
| immediateEmit | `boolean` | true | 是否立即触发resize事件，默认为false会在拖动结束时触发resize事件，设置为true时，会在拖动过程中触发resize事件 |

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| resize | 大小改变时触发 | `(width: number; height: number) => void` |

## 例子
