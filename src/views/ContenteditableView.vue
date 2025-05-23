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
          <div
            class="editor-box"
            ref="editorRef"
            contenteditable="true"
            @keydown.alt="keyupFn"
          ></div>
          <div class="editor-button">
            <el-button type="primary" @click="setClipboardFn">设置剪贴板内容</el-button>
            <el-button type="primary" @click="getClipboardFn">获取剪贴板内容</el-button>
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
import { copyImageToClipboard, getClipboardContents } from '@/utils/clipboard'

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

async function getClipboardFn() {
  const contents = await getClipboardContents()
  contents?.forEach(async (item) => {
    if (item.type === 'text/plain') {
      // const reader = new FileReader()
      // reader.readAsText(item.blob)
      // reader.addEventListener(
      //   'load',
      //   () => {
      //     console.log(reader.result)
      //   },
      //   false,
      // )
      const text = await item.blob.text()
      console.log(text)
    } else {
      const url = URL.createObjectURL(item.blob)
      const aLink = document.createElement('a')
      aLink.href = url
      let type = ''
      if (item.type === 'text/html') {
        type = 'html'
      } else if (item.type === 'image/png') {
        type = 'png'
      }
      aLink.download = `${new Date().getTime()}.${type}`
      aLink.dispatchEvent(new MouseEvent('click'))
      URL.revokeObjectURL(url)
    }
  })
}

async function setClipboardFn() {
  copyImageToClipboard('https://blog.fxss.work/logo.png')
  // copyImageToClipboard('https://blog.fxss.work/hero-197a9d2d.jpg')
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
.editor-box {
  img {
    max-width: 160px;
  }
}
</style>
