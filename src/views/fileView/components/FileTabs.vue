<template>
  <div class="file-tabs-box" v-if="fileTabs.length > 0">
    <div class="file-tabs-box-left">
      <TabsScroll
        :model-value="fileTabsValue"
        :tabs="fileTabsList as unknown as Tab[]"
        @tab-change="handleTabsChangeFn"
        @tab-close="handleTabsRemoveFn"
        class="file-tabs"
      >
        <template #tabName="{ data: item }">
          <div class="tab-label-box">
            <el-image :src="`./icons/${item.fileIcon}`" alt="file" class="file-icon">
              <template #placeholder>
                <img :src="`./icons/${defaultFileIcon}`" alt="file" class="file-icon" />
              </template>
              <template #error>
                <img :src="`./icons/${defaultFileIcon}`" alt="file" class="file-icon" />
              </template>
            </el-image>
            <div class="tab-label">{{ item.label }}</div>
            <div v-if="item.editStatus" class="tab-edit-status"></div>
          </div>
        </template>
      </TabsScroll>
    </div>
    <div class="file-tabs-box-right"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useFileTabsStore } from '@/stores/fileView/fileTabsStore'
import { getIconForFile } from 'vscode-icons-js'
import { ElMessageBox } from 'element-plus'
import { emitter } from '@/composables/mitt'
import TabsScroll from '@/components/TabsScroll.vue'
import type { Tab } from '@/types/TabsScrollType.ts'

const defaultFileIcon = ref<string>(getIconForFile('default') as string)

const fileTabsStore = useFileTabsStore()
const { fileTabsValue, fileTabs } = storeToRefs(fileTabsStore)
const { setFileTabsValue, removeFileTab, getFileNodeByKey, saveFileByKey, resetFileByKey } = fileTabsStore

const fileTabsList = computed(() => {
  return fileTabs.value.map(item => {
    return {
      ...item,
      tip: item.key
    }
  })
})

function handleTabsChangeFn(value: Tab) {
  setFileTabsValue(value.key)
  emitter.emit('updateTreeCurent', value.key)
}

async function handleTabsRemoveFn(value: Tab) {
  const fileNode = getFileNodeByKey(value.key)
  if (fileNode!.editStatus) {
    ElMessageBox.confirm(
      '文件已修改，是否保存？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
      .then(async () => {
        await saveFileByKey(value.key)
        removeFileTab(value.key)
      })
      .catch(async () => {
        await resetFileByKey(value.key, () => {
          removeFileTab(value.key)
        })
      })
  } else {
    removeFileTab(value.key)
  }
}
</script>

<style lang="scss" scoped>
.file-tabs-box {
  height: 40px;
  display: flex;
  align-items: stretch;
  .file-tabs-box-left {
    flex: auto;
    min-width: 0;
  }
 .file-tabs-box-right {
    flex-shrink: 0;
  }
}
.tab-label-box {
  display: flex;
  align-items: center;
  .file-icon {
    flex: 0 0 auto;
    width: 18px;
    height: 18px;
    margin-right: 4px;
  }
  .tab-label {
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
 .tab-edit-status {
    flex: 0 0 auto;
    width: 8px;
    height: 8px;
    background-color: var(--el-color-primary);
    border-radius: 50%;
    margin-left: 4px;
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
