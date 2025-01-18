<template>
  <div class="file-menu">
    <div class="file-menu-left">
      <el-button @click="selectDirectoryFn" text size="large">选择文件夹</el-button>
    </div>
    <div class="file-menu-right">
      <el-button text size="large" :icon="FullScreen" :title="isFullscreen ? '退出全屏' : '全屏'" @click="toggleFullscreenFn"></el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { FullScreen } from '@element-plus/icons-vue'
import screenfull from 'screenfull'

const isFullscreen = ref(false)
const toggleFullscreenFn = () => {
  const el = document.querySelector('.file-view')
  if (el) {
    if (screenfull.isEnabled) {
      screenfull.toggle(el)
      isFullscreen.value = !isFullscreen.value
    }
  }
}

const emit = defineEmits(['selectDirectory'])

const selectDirectoryFn = () => {
  emit('selectDirectory')
}
</script>

<style lang="scss" scoped>
.file-menu {
  height: 41px;
  display: flex;
  align-items: stretch;
  border-bottom: 1px solid var(--el-menu-border-color);

  .file-menu-left,
  .file-menu-right {
    display: flex;
    align-items: center;
  }
  .file-menu-left {
    flex: auto;
  }
  .file-menu-right {
    flex-shrink: 0;
  }
}
</style>
