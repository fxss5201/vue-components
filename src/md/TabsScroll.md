# TabsScroll

简介：tabs 滚动组件，支持鼠标滚轮滚动

## props

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | :--- |
| model-value / v-model | `string` | `` | 绑定值，选中选项卡的 key |
| tabs | `Tab` | `[]` | 设置数据 |
| scrollSpeed | `number` | 18 | 鼠标滚轮触发一次，滚动条移动的距离 |

### Tab 类型

``` ts
interface Tab {
  name: string
  key: string
  tip?: string
  [key: string]: any
}
```

| 属性名 | 类型 | 说明 |
| --- | --- | :--- |
| name | `string` | 名称 |
| key | `string` | 唯一标识 |
| tip | `string` | DOM元素的 `title` |

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | :--- |
| tabClick | 点击事件 | `(value: Tab) => void` |
| tabChange | 切换事件 | `(value: Tab) => void` |
| tabClose | 关闭按钮点击事件 | `(value: Tab) => void` |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| tabName | 自定义标题 |

## Exposes

| 方法名 | 说明 |
| --- | :--- |
| currentTabScrollInToView | 当前选中的 tab 滚动到可视区域 |

## 例子
