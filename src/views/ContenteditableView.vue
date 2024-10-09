<template>
  <div class="content-box">
    <Splitpanes horizontal :dbl-click-splitter="false">
      <Pane size="80" min-size="50">
        <div class="content-list"></div>
      </Pane>
      <Pane size="20" min-size="18">
        <div class="content-editor">
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
      </Pane>
    </Splitpanes>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Crop } from '@element-plus/icons-vue'
import ScreenShot from 'js-web-screen-shot'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

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
</script>

<style lang="scss" scoped>
.content-box {
  height: 100%;
  .content-list {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .content-editor {
    width: 100%;
    height: 100%;
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
.splitpanes {
  &__pane {
    justify-content: center;
    align-items: center;
    display: flex;
  }

  &__splitter {
    background-color: var(--el-menu-border-color);
    position: relative;
  }

  &__splitter:before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    transition: 0.4s;
  }
  &--vertical > &__splitter:before {
    left: -4px;
    right: -4px;
  }
  &--horizontal > &__splitter:before {
    top: -4px;
    bottom: -4px;
  }
  &__splitter:hover:before {
    background-color: rgba(220, 223, 230, 0.3);
  }
}
.editor-box {
  img {
    max-width: 160px;
  }
}
</style>
