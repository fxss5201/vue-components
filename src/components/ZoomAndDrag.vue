<template>
  <div class="zoom-and-drag">
    <div class="zoom-and-drag_wrap" ref="zoomDragWrap"
      @mousedown="mouseDownFn"
      @mousemove="mouseMoveFn"
      @mouseup="mouseUpFn"
      @mouseleave="mouseUpFn"
      @wheel="wheelFn"
    >
      <div class="zoom-and-drag_content" ref="zoomDragContent">
        <slot></slot>
      </div>
    </div>
    <div class="zoom-and-drag_view"
      :style="{ width: `${zoomDragViewWidth}px`, height: `${zoomDragViewHeight}px` }"
    >
      <div class="zoom-and-drag_view_content" ref="viewContent"
        :style="{
          width: `${viewContentWidth}px`,
          height: `${viewContentHeight}px`,
          left: `${viewContentLeft}px`,
          top: `${viewContentTop}px`
        }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export interface EmitFnPalyload {
  zoom: number
  zoomDragContentMarginLeft: number
  zoomDragContentMarginTop: number
  zoomDragContentWidth: number
  zoomDragContentHeight: number
}

export default defineComponent({
  name: 'ZoomAndDrag',
  props: {
    // 缩放倍数每次调整值，默认0.1
    zoomStep: {
      type: Number,
      default: 0.1
    },
    // 最小缩放倍数
    minZoom: {
      type: Number,
      default: 0.5
    },
    // 最大缩放倍数
    maxZoom: {
      type: Number,
      default: 10
    },
    // 纵向是否可以缩放，默认只有横向缩放，纵向缩放待实现
    zoomHeightFlag: {
      type: Boolean,
      default: false
    },
    // 横向必须保留的交集，防止可视窗口脱离显示内容
    intersectionWidth: {
      type: Number,
      default: 100
    },
    // 纵向必须保留的交集，防止可视窗口脱离显示内容
    intersectionHeight: {
      type: Number,
      default: 50
    }
  },
  data () {
    return {
      resizeObserver: null as ResizeObserver | null,
      zoomDragWrapWidth: 0,
      zoomDragWrapHeight: 0,
      zoomDragContentWidth: 0,
      zoomDragContentHeight: 0,
      zoomDragContentMarginLeft: 0,
      zoomDragContentMarginTop: 0,
      zoom: 1,

      isDragging: false,
      initialX: 0,
      initialY: 0,
      contentDownMarginLeft: 0,
      contentDownMarginTop: 0,

      viewZoom: 0,
      zoomDragViewWidth: 0,
      zoomDragViewHeight: 50,
      viewContentWidth: 0,
      viewContentHeight: 0,
      viewContentLeft: 0,
      viewContentTop: 0
    }
  },
  setup () {
    const zoomDragWrap = ref<HTMLDivElement | null>(null)
    const zoomDragContent = ref<HTMLDivElement | null>(null)
    const viewContent = ref<HTMLDivElement | null>(null)
    return {
      zoomDragWrap,
      zoomDragContent,
      viewContent
    }
  },
  mounted () {
    if (this.zoomDragWrap) {
      this.resizeObserver = new ResizeObserver(() => {
        this.boxResizeChangeFn()
      })
      this.resizeObserver.observe(this.zoomDragWrap!)
      this.$nextTick(() => {
        this.changeZoomDragWrapSize()
      })
    }
  },
  unmounted () {
    if (this.zoomDragWrap) {
      this.resizeObserver?.unobserve(this.zoomDragWrap)
      this.resizeObserver = null
    }
  },
  emits: {
    mouseMoveChange(payload: EmitFnPalyload) {
      // console.log('mouseMoveChange', payload)
      return true
    },
    zoomChange(payload: EmitFnPalyload) {
      // console.log('zoomChange', payload)
      return true
    }
  },
  methods: {
    resetZoomFn () {
      this.zoom = 1
      this.zoomDragContentWidth = this.zoomDragWrapWidth
      this.zoomDragContentHeight = this.zoomDragWrapHeight
      this.zoomDragContentMarginLeft = 0
      this.zoomDragContentMarginTop = 0
      this.zoomDragContent!.style.width = `${this.zoomDragContentWidth}px`
      this.zoomDragContent!.style.transform = `translate3d(0, 0, 0)`

      this.updateViewContent()
      this.$emit('mouseMoveChange', {
        zoom: this.zoom,
        zoomDragContentMarginLeft: this.zoomDragContentMarginLeft,
        zoomDragContentMarginTop: this.zoomDragContentMarginTop,
        zoomDragContentWidth: this.zoomDragContentWidth,
        zoomDragContentHeight: this.zoomDragContentHeight
      })
      this.$emit('zoomChange', {
        zoom: this.zoom,
        zoomDragContentMarginLeft: this.zoomDragContentMarginLeft,
        zoomDragContentMarginTop: this.zoomDragContentMarginTop,
        zoomDragContentWidth: this.zoomDragContentWidth,
        zoomDragContentHeight: this.zoomDragContentHeight
      })
    },
    updateViewContent () {
      const { left: leftContent, top: topContent, width: widthContent, height: heightContent } = this.zoomDragContent!.getBoundingClientRect()

      if (widthContent > 0 && heightContent > 0) {
        this.zoomDragContentWidth = widthContent
        this.zoomDragContentHeight = heightContent

        let zoomDragViewHeight = 50
        let viewZoom = this.zoomDragContentHeight / zoomDragViewHeight
        let zoomDragViewWidth = this.zoomDragContentWidth / viewZoom
        const zoomDragViewMaxWidth = this.zoomDragWrapWidth - 40
        if (zoomDragViewWidth > zoomDragViewMaxWidth) {
          zoomDragViewWidth = zoomDragViewMaxWidth
          viewZoom = this.zoomDragContentWidth / zoomDragViewWidth
          zoomDragViewHeight = this.zoomDragContentHeight / viewZoom
        }
        this.viewZoom = viewZoom
        this.zoomDragViewWidth = zoomDragViewWidth
        this.zoomDragViewHeight = zoomDragViewHeight

        const { left: leftWrap, top: topWrap, width: widthWrap, height: heightWrap } = this.zoomDragWrap!.getBoundingClientRect()
        const leftDiff = leftWrap - leftContent
        const topDiff = topWrap - topContent
        this.viewContentWidth = widthWrap / this.viewZoom
        this.viewContentHeight = heightWrap / this.viewZoom
        this.viewContentLeft = leftDiff / this.viewZoom
        this.viewContentTop = topDiff / this.viewZoom
      }
    },
    changeZoomDragWrapSize () {
      if (this.zoomDragWrap) {
        const { clientWidth, clientHeight } = this.zoomDragWrap
        this.zoomDragWrapWidth = clientWidth
        this.zoomDragWrapHeight = clientHeight
      }
    },
    boxResizeChangeFn () {
      this.changeZoomDragWrapSize()
    },
    mouseDownFn (e: MouseEvent) {
      this.isDragging = true
      const { clientX, clientY } = e
      this.initialX = clientX
      this.initialY = clientY
      this.contentDownMarginLeft = this.zoomDragContentMarginLeft
      this.contentDownMarginTop = this.zoomDragContentMarginTop
      this.zoomDragWrap!.style.cursor = 'grabbing'
    },
    mouseMoveFn (e: MouseEvent) {
      if (this.isDragging) {
        const { clientX, clientY } = e
        let deltaX = clientX - this.initialX
        let deltaY = clientY - this.initialY
        if (e.shiftKey) {
          deltaX = deltaX * 10
          if (this.zoomHeightFlag) {
            deltaY = deltaY * 10
          }
        }
        let zoomDragContentMarginLeft = this.contentDownMarginLeft + deltaX
        let zoomDragContentMarginTop = this.contentDownMarginTop + deltaY
        this.addRestrictionsFn(zoomDragContentMarginLeft, zoomDragContentMarginTop)

        this.updateViewContent()

        this.$emit('mouseMoveChange', {
          zoom: this.zoom,
          zoomDragContentMarginLeft: this.zoomDragContentMarginLeft,
          zoomDragContentMarginTop: this.zoomDragContentMarginTop,
          zoomDragContentWidth: this.zoomDragContentWidth,
          zoomDragContentHeight: this.zoomDragContentHeight
        })
      }
    },
    addRestrictionsFn (zoomDragContentMarginLeft: number, zoomDragContentMarginTop: number) {
      const { width } = this.zoomDragWrap!.getBoundingClientRect()
      const { width: contentWidth, height } = this.zoomDragContent!.getBoundingClientRect()
      const zhengWidth = width - this.intersectionWidth
      const fuWidth = -1 * contentWidth + this.intersectionWidth
      if (zoomDragContentMarginLeft > zhengWidth) {
        zoomDragContentMarginLeft = zhengWidth
      } else if (zoomDragContentMarginLeft < fuWidth) {
        zoomDragContentMarginLeft = fuWidth
      }
      const zhengHeight = height - this.intersectionHeight
      const fuHeight = -1 * height + this.intersectionHeight
      if (zoomDragContentMarginTop > zhengHeight) {
        zoomDragContentMarginTop = zhengHeight
      } else if (zoomDragContentMarginTop < fuHeight) {
        zoomDragContentMarginTop = fuHeight
      }

      this.zoomDragContentMarginLeft = zoomDragContentMarginLeft
      this.zoomDragContentMarginTop = zoomDragContentMarginTop
      this.zoomDragContent!.style.transform = `translate3d(${this.zoomDragContentMarginLeft}px, ${this.zoomDragContentMarginTop}px, 0)`
    },
    mouseUpFn () {
      this.isDragging = false
      this.zoomDragWrap!.style.cursor = 'grab'
    },
    wheelFn (e: WheelEvent) {
      e.preventDefault()
      const { deltaY, clientX, clientY } = e
      let zoom = this.zoom
      let zoomStep = this.zoomStep
      if (e.shiftKey) {
        zoomStep = zoomStep * 10
      }
      if (deltaY > 0) {
        zoom = zoom - zoomStep
        if (zoom <= this.minZoom) zoom = this.minZoom
      } else {
        zoom = zoom + zoomStep
        if (zoom >= this.maxZoom) zoom = this.maxZoom
      }
      this.zoom = zoom
      this.zoomDragContentWidth = this.zoomDragWrapWidth * zoom

      const { left, top } = this.zoomDragWrap!.getBoundingClientRect()
      const { width, height } = this.zoomDragContent!.getBoundingClientRect()
      const contentLeft = clientX - left
      let zoomDragContentMarginLeft = this.zoomDragContentMarginLeft
      let zoomDragContentMarginTop = this.zoomDragContentMarginTop
      zoomDragContentMarginLeft = contentLeft - ((contentLeft - zoomDragContentMarginLeft) / width) * this.zoomDragContentWidth

      this.zoomDragContent!.style.width = `${this.zoomDragContentWidth}px`
      if (this.zoomHeightFlag) {
        this.zoomDragContentHeight = this.zoomDragWrapHeight * zoom
        const contentTop = clientY - top
        zoomDragContentMarginTop = contentTop - ((contentTop - zoomDragContentMarginTop) / height) * this.zoomDragContentHeight
        this.zoomDragContent!.style.height = `${this.zoomDragContentHeight}px`
      }
      this.addRestrictionsFn(zoomDragContentMarginLeft, zoomDragContentMarginTop)

      this.updateViewContent()

      this.$emit('zoomChange', {
        zoom,
        zoomDragContentMarginLeft: this.zoomDragContentMarginLeft,
        zoomDragContentMarginTop: this.zoomDragContentMarginTop,
        zoomDragContentWidth: this.zoomDragContentWidth,
        zoomDragContentHeight: this.zoomDragContentHeight
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.zoom-and-drag {
  position: relative;
  width: 100%;
  height: 100%;
  user-select: none;
  .zoom-and-drag_wrap {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .zoom-and-drag_view {
    position: absolute;
    top: 10px;
    right: 20px;
    z-index: 100;
    background: rgba(0, 0, 0, 0.25);

    .zoom-and-drag_view_content {
      position: absolute;
      background: rgba(255, 255, 255, 0.5);
      z-index: 10;
      border: 1px solid #aaa;
    }
  }
}
</style>
