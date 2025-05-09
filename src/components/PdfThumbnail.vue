<template>
  <el-button plain @click="pefMergeFn" :disabled="loading">合成新的pdf</el-button>
  <div style="height: calc(100vh - 130px);display: flex;">
    <el-scrollbar height="100%"
      :style="{ width: `${pdfThumbnailWidth}px` }"
      class="pdf-thumbnail"
      :noresize="true"
    >
      <div class="pdf-thumbnail-item" v-for="(page, index) in pageCount" :key="index">
        <el-checkbox class="item-checkbox" :model-value="selectArray.includes(index)" @change="(val: boolean) => checkboxChangeFn(val, index)" />
        <canvas class="item-canvas" :id="'pdf-thumbnail-' + index"></canvas>
        <div class="item-page">{{ index + 1 }}</div>
      </div>
    </el-scrollbar>
    <el-scrollbar height="100%" :noresize="true" :always="true" ref="scrollbarRef">
      <div class="img-box"></div>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, shallowRef } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url'
import { PDFDocument } from 'pdf-lib'
import download from 'downloadjs'
import { ElScrollbar } from 'element-plus'

// 设置 worker 路径
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

const pdfUrl = new URL('/aaa.pdf', import.meta.url).href

const pdfThumbnailWidth = ref(0)
const pageCount = ref(0)
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()

const renderThumbnail = async (pdfDoc: PDFDocumentProxy, pageNumber: number, canvasId: string) => {
  try {
    const page = await pdfDoc.getPage(pageNumber + 1)

    // 设置缩略图缩放比例
    const scale = 0.2
    const viewport = page.getViewport({ scale })

    const canvas = document.getElementById(canvasId) as HTMLCanvasElement
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    canvas.width = viewport.width
    canvas.height = viewport.height

    pdfThumbnailWidth.value = viewport.width + 22

    const outputScale = window.devicePixelRatio || 1
    const transform = outputScale !== 1 
      ? [outputScale, 0, 0, outputScale, 0, 0] 
      : undefined

    // 渲染页面到 canvas
    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
      transform
    }
    await page.render(renderContext).promise
    
    const operatorList = await page.getOperatorList()
    const imgIndices: string[] = []
    for (let i = 0; i < operatorList.fnArray.length; i++) {
      if ([pdfjsLib.OPS.paintImageXObject].includes(operatorList.fnArray[i])) {
        console.table(operatorList.argsArray[i])
        imgIndices.push(operatorList.argsArray[i][0])
      }
    }

    for (const imageName of imgIndices) {
      try {
        page.objs.get(imageName, (image: any) => {
          (async function () {
            console.log('image:', image)
            const bmp = image.bitmap
            const { width, height } = bmp
            const canvas = new OffscreenCanvas(width, height)
            const ctx = canvas.getContext('bitmaprenderer')
            ctx!.transferFromImageBitmap(bmp)
            const blob = await canvas.convertToBlob()
            const img = new Image()
            img.width = width
            img.height = height
            img.src = URL.createObjectURL(blob)
            document.querySelector('.img-box')?.appendChild(img)
            scrollbarRef.value?.update()
          }())
        })
      } catch (error) {
        console.error(`获取第 ${pageNumber + 1} 页的图像对象时出错:`, error) 
      }
    }
    const textContent = await page.getTextContent()
    console.log('textContent:', textContent)
  } catch (error) {
    console.error(`渲染第 ${pageNumber + 1} 页缩略图时出错:`, error)
  }
}

const pdfDocLib = shallowRef<PDFDocument>()
const loading = ref(false)

onMounted(async () => {
  try {
    loading.value = true
    const pdfDoc = await pdfjsLib.getDocument(pdfUrl).promise
    pageCount.value = pdfDoc.numPages
    const outline = await pdfDoc.getOutline()
    console.log('outline:', outline)
    if (outline) {
      for (let index = 0; index < outline.length; index++) {
        const item = outline[index]
        const pageIndex = await pdfDoc.getPageIndex(item.dest?.[0])
        console.log('item:', item.title, pageIndex + 1)
      }
    }

    for (let i = 0; i < pageCount.value; i++) {
      const canvasId = `pdf-thumbnail-${i}`
      await renderThumbnail(pdfDoc, i, canvasId)
    }

    const pdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer())
    pdfDocLib.value = await PDFDocument.load(pdfBytes)
    loading.value = false
  } catch (error) {
    console.error('加载 PDF 时出错:', error)
  }
})

const selectArray = ref<number[]>([])
const checkboxChangeFn = (val: boolean, index: number) => {
  if (val) {
    selectArray.value.push(index)
  } else {
    selectArray.value = selectArray.value.filter(item => item !== index)
  }
}
const pefMergeFn = async () => {
  const newPdfDoc = await PDFDocument.create()
  for (let index = 0; index < selectArray.value.length; index++) {
    const element = selectArray.value[index]!
    const [copiedPage] = await newPdfDoc.copyPages(pdfDocLib.value!, [element])
    newPdfDoc.addPage(copiedPage)
  }
  const pdfBytes = await newPdfDoc.save()
  download(pdfBytes, 'newPdf.pdf', 'application/pdf')
  selectArray.value = []
}
</script>

<style lang="scss" scoped>
.pdf-thumbnail {
  flex-shrink: 0;
  padding: 10px;
  border: 1px solid #ddd;
  overflow-x: hidden;
  .pdf-thumbnail-item {
    position: relative;
    .item-canvas {
      box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
    }
    .item-page {
      position: absolute;
      bottom: 5px;
      right: 5px;
      z-index: 10;
      padding: 4px 6px;
      line-height: 12px;
      font-size: 12px;
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 6px;
    }
    .item-checkbox {
      position: absolute;
      top: 5px;
      left: 5px;
      z-index: 10;
      height: 14px;
    }
  }
  .pdf-thumbnail-item + .pdf-thumbnail-item {
    margin-top: 10px;
  }
}
</style>
