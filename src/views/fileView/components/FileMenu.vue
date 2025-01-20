<template>
  <div class="file-menu">
    <div class="file-menu-left">
      <el-dropdown placement="bottom-start" trigger="click" @command="handleCommandFn">
        <el-button text size="large">文件</el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="selectDirectory">选择文件夹</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="file-menu-right">
      <!-- <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom-end" effect="light">
        <el-button text size="large" :icon="FullScreen" @click="toggleFullscreenFn"></el-button>
      </el-tooltip> -->
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

const handleCommandFn = (command: string) => {
  if (command === 'selectDirectory') {
    emit(command)
  }
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
