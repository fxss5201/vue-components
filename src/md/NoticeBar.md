# NoticeBar

简介：PC端的顶部公告栏，支持自动检测滚动，鼠标移上自动停止滚动并且可以拖拽滚动条进行查看。

## props

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | :--- |
| noticeStyle | `CSSProperties \| CSSProperties[]` | —— | 设置 style 样式 |
| background | `string` | `#fffbe8` | 设置背景 |
| leftText | `string` | `公告` | 设置左侧文字 |
| rightText | `string` | —— | 设置右侧文字 |
| leftIcon | `Component` | —— | 设置左侧图标，从<https://element-plus.sxtxhy.com/zh-CN/component/icon.html>选择，优先级大于 leftIconfont |
| rightIcon | `Component` | —— | 设置右侧图标，从<https://element-plus.sxtxhy.com/zh-CN/component/icon.html>选择，优先级大于 rightIconfont |
| leftIconfont | `string` | `icon-notice` | 设置左侧图标，从iconfont设置 |
| rightIconfont | `string` | —— | 设置右侧图标，从iconfont设置 |
| iconSize | `string \| number` | `16` | 图标大小 |
| scrollSpeed | `number` | `1` | 滚动速度，requestAnimationFrame 滚动的距离 |
| delayTime | `number` | `1888` | 滚动开始结束时的延迟时间 |

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | :--- |
| leftClick | 左侧点击事件 | `(e: Event) => void` |
| rightClick | 右侧点击事件 | `(e: Event) => void` |
| scrollStart | 滚动开始，会在延迟时间之后，滚动开始的时候触发 | `() => void` |
| scrollEnd | 滚动结束，滚动结束之后立即触发，在延迟时间之前触发 | `() => void` |
| canScrollChange | 是否可以滚动，`true`可以滚动，`false`不可以滚动 | `(value: boolean) => void` |

## 例子
