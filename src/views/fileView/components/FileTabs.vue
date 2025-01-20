<template>
  <div class="file-tabs-box" v-if="fileTabs.length > 0">
    <div class="file-tabs-box-left">
      <el-tabs
        :model-value="fileTabsValue"
        type="border-card"
        @tab-change="handleTabsChangeFn"
        closable
        @tab-remove="handleTabsRemoveFn"
        class="file-tabs"
      >
        <el-tab-pane
          v-for="item in fileTabs"
          :key="item.key"
          :label="item.label"
          :name="item.key"
        >
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="file-tabs-box-right"></div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useFileTabsStore } from '@/stores/fileView/fileTabsStore'

const fileTabsStore = useFileTabsStore()
const { fileTabsValue, fileTabs } = storeToRefs(fileTabsStore)
const { setFileTabsValue, removeFileTab } = fileTabsStore

const emit = defineEmits<{
  changeFile: [key: string]
}>()

function handleTabsChangeFn(tab: string) {
  setFileTabsValue(tab)
  emit('changeFile', tab)
}

function handleTabsRemoveFn(tab: string) {
  removeFileTab(tab)
}
</script>

<style lang="scss" scoped>
.file-tabs-box {
  height: 40px;
  display: flex;
  align-items: stretch;
  .file-tabs-box-left {
    flex: auto;
  }
 .file-tabs-box-right {
    flex-shrink: 0;
  }
}
</style>
<style lang="scss">
.el-tabs.file-tabs {
  border: none;
  .el-tabs__content {
    display: none;
  }
}
</style>
