<template>
  <div
    v-loading="loading"
    :style="{ height: `${props.fileViewContentHeight}px` }"  
  >
    <VueOfficeDocx
      class="file-reader-docs"
      v-if="docxlist.includes(props.fileType)"
      :src="props.fileReader"
      style="height: 100%;"
      @rendered="renderedHandler"
      @error="errorHandler"
    />
    <vue-office-excel
      v-else-if="excelList.includes(props.fileType)"
      :src="props.fileReader"
      :options="excelOptions"
      style="height: 100%;"
      @rendered="renderedHandler"
      @error="errorHandler"
    />
    <vue-office-pptx
      v-else-if="pptList.includes(props.fileType)"
      :src="props.fileReader"
      style="height: 100%;"
      @rendered="renderedHandler"
      @error="errorHandler"
    />
    <vue-office-pdf
      class="file-reader-pdf"
      v-else-if="props.fileType === 'pdf'"
      :src="props.fileReader"
      style="height: 100%;"
      @rendered="renderedHandler"
      @error="errorHandler"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import VueOfficeDocx from '@vue-office/docx'
import '@vue-office/docx/lib/index.css'
import VueOfficeExcel from '@vue-office/excel'
import '@vue-office/excel/lib/index.css'
import VueOfficePdf from '@vue-office/pdf'
import VueOfficePptx from '@vue-office/pptx'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  fileType: string
  fileReader: ArrayBuffer
  fileViewContentHeight: number
}>()

const loading = ref(false)
const docxlist = ref(['docx'])
const excelList = ref(['xlsx', 'xls'])
const pptList = ref(['pptx'])

const excelOptions = computed(() => {
  return {
    xls: props.fileType === 'xls',       // 预览xlsx文件设为false；预览xls文件设为true
    minColLength: 0,  // excel最少渲染多少列，如果想实现xlsx文件内容有几列，就渲染几列，可以将此值设置为0.
    minRowLength: 0,  // excel最少渲染多少行，如果想实现根据xlsx实际函数渲染，可以将此值设置为0.
    widthOffset: 10,  // 如果渲染出来的结果感觉单元格宽度不够，可以在默认渲染的列表宽度上再加 Npx宽
    heightOffset: 10,
    beforeTransformData: (workbookData: any) => {
      workbookData._worksheets.forEach((itemSheet: any) => {
        const worksheet = workbookData.getWorksheet(itemSheet.id)
        if (worksheet.state === 'hidden') {
          workbookData.removeWorksheet(itemSheet.id)
        } else {
          itemSheet._rows.forEach((itemRow: any, idxRow: number) => {
            const rows = worksheet.getRow(idxRow + 1)
            itemRow._cells.forEach((itemCell: any, idxCell: number) => {
              console.log(itemCell)
              const cell = rows.getCell(idxCell + 1)
              if (itemCell.numFmt) {
                // 处理百分比数据，例如：'0.00%'/'0.0%'/'0%'
                if (itemCell.numFmt.indexOf('%') !== -1) {
                  let fmtLength = itemCell.numFmt.length - 2
                  if (itemCell.numFmt.indexOf('0.') !== -1) fmtLength = itemCell.numFmt.length - 3
                  if (!itemCell.text || itemCell.text === '0') {
                    if (itemCell.result === 0) {
                      if (itemCell.numFmt.indexOf('0.') !== -1) {
                        cell.value = `0.${new Array(fmtLength).fill(0).join('')}%`
                      } else {
                        cell.value = `0%`
                      }
                    }
                  } else if (/^(-?\d+)(\.\d+)?$/.test(itemCell.text)) {
                    cell.value = `${(itemCell.text * 100).toFixed(fmtLength)}%`
                  }
                } else if (/^(\d)_ $/.test(itemCell.numFmt)) {
                  // 处理数值小数位数，例如：'0_ '/'2_ '
                  const arr = /^(\d)_ $/.exec(itemCell.numFmt)
                  if (arr) {
                    const leng = arr[1]
                    if (itemCell.text && /^(-?\d+)(\.\d+)?$/.test(itemCell.text)) {
                      cell.value = `${(itemCell.text * 1).toFixed(Number(leng))}`
                    }
                  }
                }

                let cellText = itemCell.text
                // 处理数值，例如：'#,##0.00_ '/'#,##0.0_ '/'#,##0_ '
                if (/#.##/.test(itemCell.numFmt)) {
                  cellText = cellText.replace(/\B(?=(\d{3})+\b)/g, ',')
                  cell.value = cellText
                }
                if (/0.(0+)/.test(itemCell.numFmt)) {
                  const arr = /0.(0+)/.exec(itemCell.numFmt)
                  if (arr) {
                    const leng = arr[1].length
                    if (itemCell.text && /^(-?\d+)(\.\d+)?$/.test(itemCell.text)) {
                      cellText = `${(itemCell.text * 1).toFixed(leng)}`
                      cell.value = cellText
                    }
                  }
                }
              } else {
                const getType = (val: any) => Object.prototype.toString.call(val)
                if (getType(itemCell.value) === '[object Object]') {
                  cell.value = itemCell.text
                }
              }
            })
          })
        }
      })
      return workbookData
    }, // 底层通过exceljs获取excel文件内容，通过该钩子函数，可以对获取的excel文件内容进行修改，比如某个单元格的数据显示不正确，可以在此自行修改每个单元格的value值。
    transformData: (workbookData: any) => {
      console.log(workbookData)
      workbookData.forEach((itemSheet: any) => {
        Object.keys(itemSheet.cols).forEach(itemColKey => {
          const itemCol = itemSheet.cols[itemColKey]
          if (itemCol.width === 0.1) {
            itemCol.width = 0.000001
          }
        })
        Object.keys(itemSheet.rows).forEach(itemRowKey => {
          const itemRow = itemSheet.rows[itemRowKey]
          if (itemRow.height === 0.1) {
            itemRow.height = 0.000001
          }
        })
      })
      return workbookData
    }
  }
})

watch(
  () => props.fileReader,
  () => {
    loading.value = true
  },
  {
    immediate: true,
    deep: true
  }
)

const renderedHandler = () => {
  loading.value = false
}
const errorHandler = (e: any) => {
  loading.value = false
  ElMessage.error(e)
}
</script>

<style lang="scss">
</style>
