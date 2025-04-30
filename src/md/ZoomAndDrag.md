# ZoomAndDrag

* 支持缩放（鼠标滚轮缩放）
* 支持拖拽
* 按住键盘 `shift` 键 可以快速拖拽缩放

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
