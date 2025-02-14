<template>
  <div
    v-if="fileTabsCurrent"
    class="file-tool">
    <div class="file-tool-left">
      <el-scrollbar style="width: 100%;" v-wheel="wheelHandler" ref="scrollbarRef" @scroll="scrollFn" always>
        <div class="file-tool-left-wrap">
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
      </el-scrollbar>
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
import { ref, watch, computed, nextTick, onUpdated } from 'vue'
import { storeToRefs } from 'pinia'
import { useFileTabsStore } from '@/stores/fileView/fileTabsStore'
import { ArrowRight } from '@element-plus/icons-vue'
import { getIconForFile } from 'vscode-icons-js'
import { havePreviewFileTypeList } from '@/config/fileConfig'
import { vWheel } from '@/directive/vWheel'
import { ElScrollbar } from 'element-plus'

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
      getScrollLeftMax()
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

const scrollbarRef = ref<typeof ElScrollbar>()
const scrollLeft = ref(0)
const scrollLeftMax = ref(0)
function wheelHandler (e: WheelEvent) {
  e.preventDefault()
  if (e.deltaY > 0) {
    scrollLeft.value += 18
  } else {
    scrollLeft.value -= 18
  }
  if (scrollLeft.value < 0) {
    scrollLeft.value = 0
  } else if (scrollLeft.value > scrollLeftMax.value) {
    scrollLeft.value = scrollLeftMax.value
  }
  scrollbarRef.value?.setScrollLeft(scrollLeft.value)
}

function scrollFn (e: { scrollLeft: number }) {
  scrollLeft.value = e.scrollLeft
}

function getScrollLeftMax () {
  nextTick(() => {
    const scrollbarWrap = scrollbarRef.value?.$el.querySelector('.el-scrollbar__wrap')
    if (!scrollbarWrap) return
    scrollLeftMax.value = scrollbarWrap.scrollWidth - scrollbarWrap.offsetWidth
    scrollLeft.value = scrollLeftMax.value
    scrollbarRef.value?.setScrollLeft(scrollLeft.value)
  })
}

onUpdated(() => {
  getScrollLeftMax()
})
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
  overflow: hidden;

  .file-tool-left,
  .file-tool-left-item,
  .file-key,
  .file-tool-right,
  .file-tool-left-wrap {
    display: flex;
    align-items: center;
  }

  .file-tool-left-wrap {
    height: 36px;
  }

  .file-tool-left {
    overflow: hidden;
    white-space: nowrap;
  }
  .file-tool-right {
    flex-shrink: 0;
    margin-left: 10px;
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
