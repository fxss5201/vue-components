# ZoomAndDrag

* 支持缩放（鼠标滚轮缩放）
* 支持拖拽
* 按住键盘 `shift` 键 可以快速拖拽缩放

## 原理

ZoomAndDrag 组件仅提供拖拽缩放的壳子，通过计算出缩放后的内容的 `margin-left` 和 `margin-top` 来实现拖拽（基于 `transform` 实现），通过计算出缩放后的内容的 `width` 和 `height` 来实现缩放。

ZoomAndDrag 组件的子元素需要动态设置 `height` ，初始化的 `height` 必须有值，在父组件中的生命周期 `onMounted` 中调用 `resetZoomFn` 方法初始化/重置缩放。

``` ts
onMounted(() => {
  nextTick(() => {
    ZoomAndDragRef.value?.resetZoomFn()
  })
})
```

ZoomAndDrag 组件的子元素 `width` 不需要设置，`width` 会根据父元素的 `width` 自适应，内部子元素通过 `flex` 布局实现自适应。

**建议**：针对于子元素之间的间距，建议放在子元素内部，通过 `padding` 或者 `calc` 实现，避免子元素之间的间距影响缩放中心。

## props

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | :--- |
| zoomStep | `number` | `0.1` | 缩放倍数每次调整值，默认0.1 |
| minZoom | `number` | `0.5` | 最小缩放倍数 |
| maxZoom | `number` | `10` | 最大缩放倍数 |
| zoomHeightFlag | `boolean` | `false` | 纵向是否可以缩放，默认只有横向缩放，纵向缩放待实现 |
| intersectionWidth | `number` | `100` | 横向必须保留的交集，防止可视窗口脱离显示内容 |
| intersectionHeight | `number` | `50` | 纵向必须保留的交集，防止可视窗口脱离显示内容 |

## Emits

| 事件名 | 说明 | 回调参数 |
| --- | --- | :--- |
| mouseMoveChange | 拖拽事件 | `(payload: EmitFnPalyload) => void` |
| zoomChange | 缩放事件 | `(payload: EmitFnPalyload) => void` |

### EmitFnPalyload 类型

``` ts
interface EmitFnPalyload {
  zoom: number
  zoomDragContentMarginLeft: number
  zoomDragContentMarginTop: number
  zoomDragContentWidth: number
  zoomDragContentHeight: number
}
```

## 例子
