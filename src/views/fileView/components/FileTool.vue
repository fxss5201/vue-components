<template>
  <div
    v-if="fileTabsCurrent"
    class="file-tool">
    <div class="file-tool-left">
      <div class="file-tool-left-item" v-for="(item, index) in keysArr" :key="index">
        <el-icon v-if="index > 0" class="file-key-icon"><ArrowRight /></el-icon>
        <div class="file-key">
          <el-image v-if="index === keysArr.length - 1" :src="`./icons/${fileIcon}`" alt="file" class="file-icon">
            <template #placeholder>
              <img :src="`./icons/${defaultFileIcon}`" alt="file" class="file-icon" />
            </template>
            <template #error>
              <img :src="`./icons/${defaultFileIcon}`" alt="file" class="file-icon" />
            </template>
          </el-image>
          <div>{{ item }}</div>
        </div>
      </div>
    </div>
    <div class="file-tool-right">
      <template v-if="havePreviewFileTypeList.includes(fileType)">
        <el-button v-if="!fileClosePreview" type="primary" link @click="changeFileClosePreview(true)">关闭预览</el-button>
        <el-button v-else type="primary" link @click="changeFileClosePreview(false)">开启预览</el-button>
      </template>
    </div>  
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useFileTabsStore } from '@/stores/fileView/fileTabsStore'
import { ArrowRight } from '@element-plus/icons-vue'
import { getIconForFile } from 'vscode-icons-js'
import { havePreviewFileTypeList } from '@/config/fileConfig'

const fileTabsStore = useFileTabsStore()
const { updateFileTabsFileClosePreview } = fileTabsStore
const { fileTabsCurrent } = storeToRefs(fileTabsStore)

const keysArr = ref<string[]>([])
const fileIcon = ref<string>('')
const fileType = ref('')
watch(
  () => fileTabsCurrent.value,
  () => {
    if (!fileTabsCurrent.value) {
      keysArr.value = []
      fileIcon.value = defaultFileIcon.value
    } else {
      fileType.value = fileTabsCurrent.value!.label.split('.').pop() || ''
      keysArr.value = fileTabsCurrent.value!.key.split('/').filter(x => x)
      fileIcon.value = getIconForFile(fileTabsCurrent.value!.label.split('.').pop() as string) as string
    }
  },
  { deep: true }
)
const fileClosePreview = computed(() => {
  return fileTabsCurrent.value?.closePreview
})

const defaultFileIcon = ref<string>(getIconForFile('default') as string)

function changeFileClosePreview (status: boolean) {
  updateFileTabsFileClosePreview(fileTabsCurrent.value!.key, status)
}
</script>

<style lang="scss" scoped>
.file-tool {
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #E1E4E8;
  padding: 0 10px;
  background-color: #24292e;
  border-bottom: 1px dashed #555;

  .file-tool-left,
  .file-tool-left-item,
  .file-key,
  .file-tool-right {
    display: flex;
    align-items: center;
  }

  .file-key-icon {
    margin: 0 4px;
  }

  .file-icon {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
}
</style>
