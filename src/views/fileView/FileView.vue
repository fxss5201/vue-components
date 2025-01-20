<template>
  <div class="file-view" ref="fileViewRef">
    <FileMenu class="file-head" @selectDirectory="selectDirectoryFn"></FileMenu>
    <div ref="fileViewContent" class="file-view-content">
      <Splitpanes :dbl-click-splitter="false" :push-other-panes="false" class="file-view-Splitpanes">
        <Pane size="20" min-size="15">
          <div class="file-view__left">
            <FileTree ref="fileTreeRef"></FileTree>
          </div>
        </Pane>
        <Pane min-size="30">
          <div class="file-view__right">
            <FileBody></FileBody>
          </div>
        </Pane>
      </Splitpanes>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

import FileMenu from './components/FileMenu.vue'
import FileBody from './components/FileBody.vue'
import FileTree from './components/FileTree.vue'

import { useFileViewLayoutStore } from '@/stores/fileView/fileViewLayoutStore'
import { rootFiles, useFileTreeStore } from '@/stores/fileView/fileTreeStore'

const { setFileViewContentHeight } = useFileViewLayoutStore()
const { selectDirectoryStoreFn, resetDirectoryStoreFn } = useFileTreeStore()

const fileViewRef = ref<HTMLDivElement>()
const fileViewContent = ref<HTMLDivElement | null>()
const { height: fileViewContentHeight } = useElementSize(fileViewContent)
watch(
  () => fileViewContentHeight.value,
  (val) => {
    setFileViewContentHeight(val)
  }
)

const fileTreeRef = ref<typeof FileTree>()

async function selectDirectoryFn() {
  resetDirectoryStoreFn()
  fileTreeRef.value?.elTreeRef.setData(rootFiles)
  await selectDirectoryStoreFn()
  fileTreeRef.value?.elTreeRef.setData(rootFiles)
  nextTick(() => {
    fileTreeRef.value?.elTreeRef.setExpandedKeys([rootFiles[0].key])
  })
}
</script>

<style lang="scss" scoped>
.file-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: #fff;

  .file-head {
    flex-shrink: 0;
  }
}
.file-view-content {
  flex: auto;
  width: 100%;
  min-height: 0;
}
.file-view__left,
.file-view__right {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>

<style lang="scss">
.file-view-Splitpanes {
  height: 100%;
  .splitpanes__pane {
    height: 100%;
  }
}
</style>
