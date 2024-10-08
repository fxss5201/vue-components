<template>
  <div class="content-box">
    <div class="content-list"></div>
    <div class="content-driver" @mousedown="driverMousedownFn">
      <div class="content-driver-top"></div>
      <div class="content-driver-bottom"></div>
    </div>
    <div class="content-editor" ref="editorBoxRef" :style="{ height: `${editorHeight}px` }">
      <div class="editor-tool">
        <el-tooltip effect="light" content="截屏" placement="bottom-start">
          <el-button text @click="doScreenEvent">
            <el-icon><Crop /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
      <div class="editor-box" ref="editorRef" contenteditable="true" @keydown.alt="keyupFn"></div>
      <div class="editor-button">
        <el-button type="primary">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Crop } from '@element-plus/icons-vue'
import ScreenShot from 'js-web-screen-shot'
import { useWindowSize } from '@vueuse/core'

const editorBoxRef = ref<HTMLDivElement>()
const editorRef = ref<HTMLInputElement>()
const editorImgs = ref<string[]>([])
const keyupFn = (e: KeyboardEvent) => {
  if (e.key === 'x') {
    doScreenEvent()
  }
}
const doScreenEvent = () => {
  new ScreenShot({
    enableWebRtc: true,
    level: 99999,
    clickCutFullScreen: true,
    wrcReplyTime: 500,
    wrcWindowMode: true,
    completeCallback: ({ base64 }) => {
      ;(editorRef.value as HTMLInputElement).innerHTML =
        editorRef.value?.innerHTML + `<img src="${base64}" alt>`
      editorImgs.value.push(base64)
      editorRef.value?.focus()
      const range = window.getSelection()
      range?.selectAllChildren(editorRef.value as Node)
      range?.collapseToEnd()
    }
  })
}

const { height: windowHeight } = useWindowSize()
const halfWindowHeight = windowHeight.value / 2
const editorBoxMinHeight = 150
const editorHeight = ref(editorBoxMinHeight)
let mouseDownFlag = ref(false)
const mouseUpFn: (this: Document, ev: MouseEvent) => void = () => {
  mouseDownFlag.value = false
  document.removeEventListener('mousemove', mouseMoveFn)
  document.removeEventListener('mouseup', mouseUpFn)
}
let mouseMoveFn: (this: Document, ev: MouseEvent) => void
const driverMousedownFn = (e: MouseEvent) => {
  let startY = e.clientY
  mouseDownFlag.value = true
  mouseMoveFn = (ev: MouseEvent) => {
    if (mouseDownFlag.value) {
      const currentY = ev.clientY
      const deltaY = startY - currentY
      console.log(deltaY)
      let height = editorHeight.value + deltaY
      console.log(height)

      if (height < editorBoxMinHeight) {
        height = editorBoxMinHeight
      } else if (height > halfWindowHeight) {
        height = halfWindowHeight
      }

      editorHeight.value = height
      ;(editorBoxRef.value as HTMLDivElement).style.height = `${editorHeight.value}px`
      startY = currentY
    }
  }

  document.addEventListener('mousemove', mouseMoveFn)
  document.addEventListener('mouseup', mouseUpFn)
}
</script>

<style lang="scss" scoped>
.content-box {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  .content-list {
    flex: auto;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .content-driver {
    height: 5px;
    background-color: var(--el-menu-border-color);
    padding: 2px 0;
    margin: 10px 0;
    position: relative;
    cursor: row-resize;
    &:hover {
      .content-driver-top,
      .content-driver-bottom {
        background-color: #ebe8e8d1;
      }
    }
    .content-driver-top {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: 2px;
      background-color: #f9f9f9;
    }
    .content-driver-bottom {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 2px;
      background-color: #f9f9f9;
    }
  }
  .content-editor {
    flex: 0 0 auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    .editor-tool {
      flex: 0 0 auto;
      height: 30px;
      display: flex;
      align-items: center;
    }
    .editor-box {
      overflow-y: auto;
      outline: none;
      flex: auto;
    }
    .editor-button {
      margin-top: 8px;
      height: 32px;
      flex: 0 0 auto;
      text-align: right;
    }
  }
}
</style>
<style lang="scss">
.editor-box {
  img {
    max-width: 160px;
  }
}
</style>
