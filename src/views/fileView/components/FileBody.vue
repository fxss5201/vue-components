<template>
  <div class="file-view-body">
    <FileReader
      v-if="currentFile"
      :file="currentFile"
      :imgFileHandles="imgFileHandles"
      :editorPermission="editorPermission"
      :fileReaderHeight="fileReaderHeight"
    />
    <div v-else class="empty">请选择文件</div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useCurrentFileStore } from '@/stores/fileView/currentFileStore'
import { useFileViewLayoutStore } from '@/stores/fileView/fileViewLayoutStore'
import FileReader from '@/views/fileView/components/FileReader.vue'

const currentFileStore = useCurrentFileStore()
const { currentFile, imgFileHandles, editorPermission } = storeToRefs(currentFileStore)
const { fileReaderHeight } = storeToRefs(useFileViewLayoutStore())
</script>

<style lang="scss" scoped>
.file-view-body {
  width: 100%;
  height: 100%;
  .empty {
    margin: 16px 0;
    text-align: center;
  }
}
</style>
