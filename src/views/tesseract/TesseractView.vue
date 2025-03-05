<template>
  <div class="tesseract-page">
    <el-form label-width="auto">
      <el-form-item label="选择识别语言">
        <el-select v-model="tesseractLang" placeholder="请选择识别语言">
          <el-option v-for="item in tesseractLangList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="选择识别引擎">
        <el-select v-model="tesseractOem" placeholder="请选择识别引擎">
          <el-option v-for="item in tesseractOemList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="imgList.length">
        <el-button plain @click="clearImgListFn">清空已选图片</el-button>
      </el-form-item>
    </el-form>
    <el-upload
      drag
      ref="uploadRef"
      action=""
      multiple
      :auto-upload="false"
      :on-change="onChangeFn"
      :on-remove="onRemoveFn"
      list-type="text"
      accept="image/*"
      :file-list="imgList"
      :disabled="tesseractLoading"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        把图片拖拽到框内或 <em>点击选择图片</em>
      </div>
      <template #tip>
        <div v-if="tesseractLoading" class="el-upload__tip">{{ tesseractLoadingText }}</div>
      </template>
    </el-upload>
    <div v-if="imgList.length" class="img-list">
      <div class="img-row-item img-row-head">
        <div class="img-box">原始图片</div>
        <div class="text-box">识别结果</div>
      </div>
      <div v-for="(item, index) in imgList" :key="index" class="img-row-item">
        <div class="img-box">
          <el-image
            style="max-width: 100%;"
            :src="item.url"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :preview-src-list="[item.url as string]"
            show-progress
            fit="cover"
          />
        </div>
        <div class="text-box" v-loading="!item.content">
          <el-select-v2 v-model="item.lang" filterable :options="fileTypeListValue" placeholder="请选择语言" class="img-row-select" size="small"></el-select-v2>
          <CodeCard v-model="item.content" :lang="item.lang" style="width: 100%;"></CodeCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElUpload, ElImage } from 'element-plus'
import type { UploadFile, UploadFiles, UploadInstance } from 'element-plus' 
import Tesseract, { createWorker } from 'tesseract.js'
import CodeCard from '@/components/CodeCard.vue'
import { mdFileTypeList, codeFileTypeList } from '@/config/fileConfig'

interface Option {
  label: string
  value: string
}
const fileTypeList = [...mdFileTypeList, ...codeFileTypeList].map(x => {
  return {
    label: x,
    value: x
  }
})
const fileTypeListValue = ref<Option[]>(fileTypeList)

const tesseractLang = ref('chi_sim')
const tesseractLangList = ref([
  {
    label: '简体中文',
    value: 'chi_sim'
  },
  {
    label: 'English',
    value: 'eng'
  },
  {
    label: 'English + 简体中文',
    value: 'eng + chi_sim'
  }
])
const tesseractOem = ref(Tesseract.OEM.LSTM_ONLY)
const tesseractOemList = ref([
  {
    label: 'LSTM_ONLY',
    value: Tesseract.OEM.LSTM_ONLY
  },
  {
    label: 'TESSERACT_ONLY',
    value: Tesseract.OEM.TESSERACT_ONLY
  },
  {
    label: 'TESSERACT_LSTM_COMBINED',
    value: Tesseract.OEM.TESSERACT_LSTM_COMBINED
  },
  {
    label: 'DEFAULT',
    value: Tesseract.OEM.DEFAULT
  }
])
watch(
  () => [tesseractLang.value, tesseractOem.value],
  () => {
    destoryTesseract()
    initTesseract(tesseractLang.value === 'eng + chi_sim' ? ['eng', 'chi_sim'] : [tesseractLang.value])
    imgList.value = []
  }
)

interface ImgItem extends UploadFile {
  content: string;
  lang: string;
}
const imgList = ref<ImgItem[]>([])
function onChangeFn (uploadFile: UploadFile, uploadFiles: UploadFiles) {
  doImgChangeFn(uploadFiles as ImgItem[])
}
function onRemoveFn (uploadFile: UploadFile, uploadFiles: UploadFiles) {
  doImgChangeFn(uploadFiles as ImgItem[])
}
function doImgChangeFn (uploadFiles: ImgItem[]) {
  imgList.value = uploadFiles.map((item: ImgItem) => {
    return {
      ...item,
      url: item.url ||  URL.createObjectURL(item.raw!),
      lang: item.lang || 'txt',
      content: item.content || ''
    }
  }) as ImgItem[]
  tesseractImg()
}

const tesseractLoading = ref(true)
const tesseractLoadingText = ref('Loading ...')
const worker = shallowRef<Tesseract.Worker>()
const tesseractMinUrl = new URL('/tesseract/tesseract.min.js', import.meta.url).href
const tesseractWasmUrl = new URL('/tesseract/tesseract-core-simd-lstm.wasm.js', import.meta.url).href
async function initTesseract (langs?: string[]) {
  worker.value = await createWorker(langs, tesseractOem.value, {
    corePath: tesseractWasmUrl,
    workerPath: tesseractMinUrl,
    langPath: new URL('/tesseract/lang-data', import.meta.url).href,
    logger: m => {
      console.log(m)
      tesseractLoadingText.value = m.status
      if (m.status === 'initializing api' && m.progress === 1) {
        tesseractLoading.value = false
      }
    }
  })
}
async function tesseractImg () {
  for (let idx  = 0; idx < imgList.value.length; idx++) {
    const item = imgList.value[idx]
    if (!item.content) {
      const res = await worker.value?.recognize(item.raw!)
      console.log(res)
      item.content = res?.data.text || ''
      console.log(res?.data.text)
    }
  }
}
async function destoryTesseract () {
  await worker.value?.terminate()
  tesseractLoading.value = true
  tesseractLoadingText.value = 'Loading...'
}

const uploadRef = ref<UploadInstance>()
function clearImgListFn () {
  uploadRef.value?.clearFiles()
  imgList.value = []
}

onMounted(() => {
  initTesseract([tesseractLang.value])
})

onUnmounted(() => {
  destoryTesseract()
})
</script>

<style lang="scss" scoped>
.img-list {
  border-top: 1px solid var(--el-border-color);
  border-left: 1px solid var(--el-border-color);
  .img-row-item {
    display: flex;
    align-items: stretch;
    .img-box {
      padding: 16px;
      flex: 0 0 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid var(--el-border-color);
      border-right: 1px solid var(--el-border-color);
    }
    .text-box {
      flex: 0 0 50%;
      padding: 16px;
      border-bottom: 1px solid var(--el-border-color);
      border-right: 1px solid var(--el-border-color);
      overflow: auto;
    }
    &.img-row-head {
      .img-box,
      .text-box {
        padding: 8px;
        font-weight: 700;
      }
    }
  }
  .img-row-select {
    width: 120px;
    margin-bottom: 8px;
  }
}
</style>
