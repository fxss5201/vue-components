<template>
  <div class="content-box">
    <div class="content-list"></div>
    <div class="content-driver"></div>
    <div class="content-editor">
      <div class="editor-tool">
        <el-tooltip effect="light" content="截屏" placement="bottom-start">
          <el-button text @click="doScreenEvent">
            <el-icon><Crop /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
      <div class="editor-box" contenteditable></div>
      <div class="editor-button">
        <el-button type="primary">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Crop } from '@element-plus/icons-vue'
import ScreenShot from 'js-web-screen-shot'

const doScreenEvent = () => {
  new ScreenShot({
    enableWebRtc: true
  })
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
    border-top: 1px solid var(--el-menu-border-color);
    height: 0;
    margin: 12px 0;
  }
  .content-editor {
    flex: 0 0 auto;
    overflow-x: hidden;
    overflow-y: auto;
    .editor-tool {
      height: 30px;
      display: flex;
      align-items: center;
    }
    .editor-box {
      height: 88px;
      overflow-y: auto;
      outline: none;
    }
    .editor-button {
      text-align: right;
    }
  }
}
</style>
