<template>
  <div class="file-md-box" v-loading="fileLoading" v-if="mdFileTypeList.includes(fileType) || codeFileTypeList.includes(fileType)">
    <el-scrollbar ref="scrollbarRef">
      <MarkdownCard v-if="mdFileTypeList.includes(fileType)" :content="fileReader as string"></MarkdownCard>
      <CodeCard v-else v-model="fileReader as string" :lang="fileType" :is-editor="editorPermission" :file="props.file"></CodeCard>
    </el-scrollbar>
  </div>
  <OfficeFileReader
    v-else-if="officeFileTypeList.includes(fileType)"
    :fileType="fileType"
    :fileReader="fileReader as ArrayBuffer"
    :boxHeight="boxHeight"
  ></OfficeFileReader>
  <div v-else-if="imgFileTypeList.includes(fileType)" class="file-img-box" :style="{ height: boxHeight }">
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
  <div v-else-if="videoFileTypeList.includes(fileType)" class="file-video-box" :style="{ height: boxHeight }">
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
import { nextTick, ref, watch } from 'vue'
import MarkdownCard from '@/components/MarkdownCard.vue'
import OfficeFileReader from '@/components/OfficeFileReader.vue'
import { imgFileTypeList, mdFileTypeList, officeFileTypeList, codeFileTypeList, videoFileTypeList } from '@/config/fileConfig'
import CodeCard from '@/components/CodeCard.vue'
import { addCodeCopy } from '@/composables/addCodeCopy'

const props = defineProps<{
  file: FileSystemFileHandle
  imgFileHandles: FileSystemFileHandle[]
  boxHeight: string
  editorPermission: boolean
}>()

const scrollbarRef = ref()
const fileLoading = ref(false)
const fileType = ref('')
const fileReader = ref<FileReader['result']>('')
const imgFileIndex = ref(0)

const imgUrlList = ref<string[]>([])

watch(
  () => props.file,
  async () => {
    const file = await props.file.getFile()
    const reader = new FileReader()
    nextTick(() => {
      if (scrollbarRef.value) {
        scrollbarRef.value.setScrollTop(0)
        scrollbarRef.value.setScrollLeft(0)
      }
    })
    fileType.value = file.name.split('.').pop() || ''
    if (imgFileTypeList.includes(fileType.value)) {
      // reader.readAsDataURL(file)
      // reader.onload = () => {
      //   fileReader.value = reader.result as string
      // }
      fileReader.value = URL.createObjectURL(file)
      const imgUrls: string[] = []
      for (let idx = 0; idx < props.imgFileHandles.length; idx++) {
        const item = props.imgFileHandles[idx]
        if (item.name === file.name) {
          imgFileIndex.value = idx
          imgUrls.push(fileReader.value)
        } else {
          const file = await item.getFile()
          imgUrls.push(URL.createObjectURL(file))
        }
      }
      imgUrlList.value = imgUrls
      return
    } else if (mdFileTypeList.includes(fileType.value)) {
      fileLoading.value = true
      reader.readAsText(file)
      reader.onload = () => {
        fileLoading.value = false
        fileReader.value = reader.result as string
      }
      return
    } else if (codeFileTypeList.includes(fileType.value)) {
      fileLoading.value = true
      reader.readAsText(file)
      reader.onload = () => {
        fileLoading.value = false
        fileReader.value = reader.result as string
      }
      return
    } else if (officeFileTypeList.includes(fileType.value)) {
      reader.readAsArrayBuffer(file)
      reader.onload = () => {
        fileReader.value = reader.result as ArrayBuffer
      }
      return
    } else if (videoFileTypeList.includes(fileType.value)) {
      fileReader.value = URL.createObjectURL(file)
      return
    }
    reader.readAsText(file)
    reader.onload = () => {
      console.log(reader.result) // 读取到的文件内容
    }
  },
  {
    immediate: true
  }
)

addCodeCopy()
</script>

<style lang="scss" scoped>
.file-md-box {
  width: 100%;
  height: 100%;
}
.file-img-box,
.file-video-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
