<template>
  <div class="file-view-body">
    <FileReader
      v-if="fileTabsValue"
    />
    <div v-else class="empty">请选择文件</div>
  </div>
</template>

<script lang="ts" setup>
import FileReader from '@/views/fileView/components/FileReader.vue'

import { storeToRefs } from 'pinia'
import { useFileTabsStore } from '@/stores/fileView/fileTabsStore'

const fileTabsStore = useFileTabsStore()
const { fileTabsValue } = storeToRefs(fileTabsStore)
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
