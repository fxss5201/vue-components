<template>
  <el-scrollbar ref="scrollbarRef" v-if="mdFileTypeList.includes(fileType)">
    <MarkdownCard :content="fileReader as string"></MarkdownCard>
  </el-scrollbar>
  <OfficeFileReader
    v-if="officeFileTypeList.includes(fileType)"
    :fileType="fileType"
    :fileReader="fileReader as ArrayBuffer"
    :boxHeight="boxHeight"
  ></OfficeFileReader>
  <div class="file-img-box" :style="{ height: boxHeight }">
    <el-image
      style="max-width: 100%"
      :src="fileReader"
      :zoom-rate="1.2"
      :max-scale="7"
      :min-scale="0.2"
      :preview-src-list="imgUrlList"
      fit="cover"
      preview-teleported
      :zIndex="1000"
    />
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue'
import MarkdownCard from '@/components/MarkdownCard.vue'
import OfficeFileReader from '@/components/OfficeFileReader.vue'

const props = defineProps<{
  file: FileSystemFileHandle
  imgFileHandles: FileSystemFileHandle[]
  boxHeight: string
}>()

const scrollbarRef = ref()

const imgFileTypeList = ['jpg', 'png', 'gif', 'jpeg']
const mdFileTypeList = ['md']
const codeFileTypeList = ['js', 'ts', 'css', 'html', 'vue']
const officeFileTypeList = ['docx', 'xlsx', 'pdf']

const fileType = ref('')
const fileReader = ref<FileReader['result']>('')

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
        const file = await item.getFile()
        imgUrls.push(URL.createObjectURL(file))
      }
      imgUrlList.value = imgUrls
      return
    } else if (mdFileTypeList.includes(fileType.value)) {
      reader.readAsText(file)
      reader.onload = () => {
        fileReader.value = reader.result as string
      }
      return
    } else if (codeFileTypeList.includes(fileType.value)) {
      reader.readAsText(file)
      reader.onload = () => {
        console.log(reader.result) // 读取到的文件内容
      }
      return
    } else if (officeFileTypeList.includes(fileType.value)) {
      reader.readAsArrayBuffer(file)
      reader.onload = () => {
        fileReader.value = reader.result as ArrayBuffer
      }
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
</script>

<style lang="scss" scoped>
.file-img-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
