<template>
  <div class="file-md-box" v-loading="fileLoading" v-if="havePreviewFileTypeList.includes(fileType)">
    <Splitpanes v-if="!fileClosePreview" :dbl-click-splitter="false" :push-other-panes="false">
      <Pane size="50" min-size="20">
        <div class="full-block">
          <MonacoEditorCard v-if="isMonacoEditor" :key="fileTabsCurrent?.key" :modelValue="fileReader as string" @update:modelValue="updateModelValueFn" @saveFile="saveFileFn" :lang="fileType" :is-editor="editorPermission" :file="fileTabsCurrent!.file as FileSystemFileHandle"></MonacoEditorCard>
          <el-scrollbar v-else ref="scrollbarCodeMdRef">
            <CodeCard :modelValue="fileReader as string" @update:modelValue="updateModelValueFn" @saveFile="saveFileFn" :lang="fileType" :is-editor="editorPermission" :file="fileTabsCurrent!.file as FileSystemFileHandle"></CodeCard>
          </el-scrollbar>
        </div>
      </Pane>
      <Pane size="50" min-size="20">
        <div class="full-block">
          <el-scrollbar ref="scrollbarMdRef">
            <MarkdownCard v-if="fileType === 'md'" :content="(fileReader as string)"></MarkdownCard>
            <JsonView v-else-if="fileType === 'json'" :json="getFileReaderJson(fileReader as string)"></JsonView>
          </el-scrollbar>
        </div>
      </Pane>
    </Splitpanes>
    <template v-else>
      <MonacoEditorCard v-if="isMonacoEditor" :key="fileTabsCurrent?.key" :modelValue="fileReader as string" @update:modelValue="updateModelValueFn" @saveFile="saveFileFn" :lang="fileType" :is-editor="editorPermission" :file="fileTabsCurrent!.file as FileSystemFileHandle"></MonacoEditorCard>
      <el-scrollbar ref="scrollbarCodeMdRef">
        <CodeCard :modelValue="fileReader as string" @update:modelValue="updateModelValueFn" @saveFile="saveFileFn" :lang="fileType" :is-editor="editorPermission" :file="fileTabsCurrent!.file as FileSystemFileHandle"></CodeCard>
      </el-scrollbar>
    </template>
  </div>
  <div class="file-code-box" v-loading="fileLoading" v-else-if="codeFileTypeList.includes(fileType)">
    <MonacoEditorCard v-if="isMonacoEditor" :key="fileTabsCurrent?.key" :modelValue="fileReader as string" @update:modelValue="updateModelValueFn" @saveFile="saveFileFn" :lang="fileType" :is-editor="editorPermission" :file="fileTabsCurrent!.file as FileSystemFileHandle"></MonacoEditorCard>
    <el-scrollbar ref="scrollbarCodeRef">
      <CodeCard :modelValue="fileReader as string" @update:modelValue="updateModelValueFn" @saveFile="saveFileFn" :lang="fileType" :is-editor="editorPermission" :file="fileTabsCurrent!.file as FileSystemFileHandle"></CodeCard>
    </el-scrollbar>
  </div>
  <OfficeFileReader
    v-else-if="officeFileTypeList.includes(fileType)"
    :fileType="fileType"
    :fileReader="fileReader as ArrayBuffer"
    :fileReaderHeight="fileReaderHeight"
  ></OfficeFileReader>
  <div v-else-if="imgFileTypeList.includes(fileType)" class="file-img-box" :style="{ height: `${fileReaderHeight}px` }">
    <el-image
      style="max-width: 100%"
      :src="fileReader"
      :zoom-rate="1.2"
      :max-scale="7"
      :min-scale="0.2"
      :preview-src-list="imgUrlList"
      :initial-index="imgFileIndex"
      :infinite="false"
      fit="cover"
      preview-teleported
      :zIndex="1000"
    />
  </div>
  <div v-else-if="videoFileTypeList.includes(fileType)" class="file-video-box" :style="{ height: `${fileReaderHeight}px` }">
    <video
      controls
      autoplay
      style="max-width: 100%"
      :src="(fileReader as string)"
    >
    </video>
  </div>
  <div v-else>暂不支持.{{ fileType }}后缀类型的文件展示</div>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch, computed } from 'vue'
import MarkdownCard from '@/components/MarkdownCard.vue'
import OfficeFileReader from '@/components/OfficeFileReader.vue'
import { imgFileTypeList, mdFileTypeList, officeFileTypeList, codeFileTypeList, videoFileTypeList, havePreviewFileTypeList, monacoEditorSupportLanguages, monacoEditorSupportLanguagesMap } from '@/config/fileConfig'
import CodeCard from '@/components/CodeCard.vue'
import MonacoEditorCard from '@/components/MonacoEditorCard.vue'
import JsonView from '@/components/JsonView.vue'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { readFileAsText, readFileAsArrayBuffer, readFileAsDataURL } from '@/utils/fileReader'

import { storeToRefs } from 'pinia'
import { useCurrentFileStore } from '@/stores/fileView/currentFileStore'
import { useFileViewLayoutStore } from '@/stores/fileView/fileViewLayoutStore'
import { useFileTabsStore } from '@/stores/fileView/fileTabsStore'
import { getParentFileDataByKey } from '@/stores/fileView/fileTreeStore'
import { ElMessage } from 'element-plus'

const { fileReaderHeight } = storeToRefs(useFileViewLayoutStore())
const fileTabsStore = useFileTabsStore()
const { fileTabsCurrent } = storeToRefs(fileTabsStore)
const { updateFileTabsFileContent, updateFileTabsFileEditStatus } = fileTabsStore
const currentFileStore = useCurrentFileStore()
const { editorPermission } = storeToRefs(currentFileStore)

const scrollbarCodeRef = ref()
const scrollbarCodeMdRef = ref()
const scrollbarMdRef = ref()
const fileLoading = ref(false)
const fileType = ref('')
const fileReader = ref<FileReader['result']>('')
const imgFileIndex = ref(0)
const isMonacoEditor = computed(() => {
  return monacoEditorSupportLanguages.includes(monacoEditorSupportLanguagesMap[fileType.value] || fileType.value)
})

const imgUrlList = ref<string[]>([])

watch(
  () => fileTabsCurrent.value,
  async () => {
    fileType.value = fileTabsCurrent.value!.label.split('.').pop() || ''
    nextTick(() => {
      if (scrollbarCodeRef.value) {
        scrollbarCodeRef.value.setScrollTop(0)
        scrollbarCodeRef.value.setScrollLeft(0)
      }
      if (scrollbarCodeMdRef.value) {
        scrollbarCodeMdRef.value.setScrollTop(0)
        scrollbarCodeMdRef.value.setScrollLeft(0)
      }
      if (scrollbarMdRef.value) {
        scrollbarMdRef.value.setScrollTop(0)
        scrollbarMdRef.value.setScrollLeft(0)
      }
    })
    if (imgFileTypeList.includes(fileType.value)) {
      const file = await (fileTabsCurrent.value?.file as FileSystemFileHandle).getFile()
      try {
        fileReader.value = await readFileAsDataURL(file)
      } catch (error) {
        console.log(error)
      }
      const curFileParentData = getParentFileDataByKey(fileTabsCurrent.value!.key)
      if (curFileParentData.imgListFileNode?.length) {
        const imgUrls: string[] = []
        for (let idx = 0; idx < curFileParentData.imgListFileNode.length; idx++) {
          const item = curFileParentData.imgListFileNode[idx]
          if (item.key === fileTabsCurrent.value!.key) {
            imgFileIndex.value = idx
            imgUrls.push(fileReader.value as string)
          } else {
            const file = await (item.file as FileSystemFileHandle).getFile()
            try {
              const fileUrl = await readFileAsDataURL(file)
              imgUrls.push(fileUrl)
            } catch (error) {
              console.log(error)
            }
          }
        }
        imgUrlList.value =  imgUrls
      } else {
        imgFileIndex.value = 0
        imgUrlList.value = []
      }
    } else if (mdFileTypeList.includes(fileType.value) || codeFileTypeList.includes(fileType.value)) {
      if (fileTabsCurrent.value!.fileContent) {
        fileReader.value = fileTabsCurrent.value!.fileContent
      } else {
        fileLoading.value = true
        const file = await (fileTabsCurrent.value?.file as FileSystemFileHandle).getFile()
        try {
          fileReader.value = await readFileAsText(file)
          fileLoading.value = false
          updateFileTabsFileContent(fileTabsCurrent.value!.key, fileReader.value)
        } catch (error) {
          console.log(error)
        }
      }
    } else if (officeFileTypeList.includes(fileType.value)) {
      const file = await (fileTabsCurrent.value?.file as FileSystemFileHandle).getFile()
      try {
        fileReader.value = await readFileAsArrayBuffer(file)
      } catch (error) {
        console.log(error)
      }
    } else if (videoFileTypeList.includes(fileType.value)) {
      const file = await (fileTabsCurrent.value?.file as FileSystemFileHandle).getFile()
      try {
        fileReader.value = await readFileAsDataURL(file)
      } catch (error) {
        console.log(error)
      }
    }
  },
  {
    immediate: true
  }
)
const fileClosePreview = computed(() => {
  return fileTabsCurrent.value?.closePreview
})

function updateModelValueFn (val: string) {
  fileReader.value = val
  if (val !== fileTabsCurrent.value!.fileContent) {
    updateFileTabsFileContent(fileTabsCurrent.value!.key, val)
  }
  updateFileTabsFileEditStatus(fileTabsCurrent.value!.key, true)
}

function saveFileFn () {
  updateFileTabsFileEditStatus(fileTabsCurrent.value!.key, false)
}

const jsonOld = ref()
function getFileReaderJson (val: string) {
  try {
    const json = JSON.parse(val)
    jsonOld.value = json
    return json
  } catch (error) {
    console.log(error)
    ElMessage.error('json文件格式错误')
    return jsonOld.value
  } 
}
</script>

<style lang="scss" scoped>
.file-md-box,
.file-code-box,
.full-block {
  width: 100%;
  height: 100%;
  :deep(.code-card) {
    border-radius: 0;
  }
}
.file-img-box,
.file-video-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
