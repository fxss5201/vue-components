<template>
  <div class="page-no-top-padding">
    <MarkdownCard :content="ZoomAndDragMd" />
    <div style="width: 100%; height: 680px;border: 1px solid #ccc;">
      <ZoomAndDrag ref="ZoomAndDragRef" :zoomHeightFlag="true" @mouseMoveChange="mouseMoveChangeFn" @zoomChange="zoomChangeFn">
        <div class="row-list-box" :style="{ height: `${boxHeight}px` }">
          <div v-for="row in list" :key="row.rowIndex" class="row-list">
            <div v-for="col in row.children" :key="`${col.rowIndex}-${col.columnIndex}`" class="col-list">
              <div class="col-body" :style="{ backgroundColor: col.backgroundColor }">{{ col.text }}</div>
            </div>
          </div>
        </div>
      </ZoomAndDrag>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue'
import MarkdownCard from '@/components/MarkdownCard.vue'
import ZoomAndDragMd from '@/md/ZoomAndDrag.md?raw'
import ZoomAndDrag from '@/components/ZoomAndDrag.vue'
import type { EmitFnPalyload } from '@/components/ZoomAndDrag.vue'

function getRandomHexColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

const list = ref([...Array.from({ length: 10 })].map((_, rowIndex) => {
  const rows = [...Array.from({ length: 10 })].map((_, columnIndex) => {
    return {
      rowIndex,
      columnIndex,
      backgroundColor: getRandomHexColor(),
      text: `第${rowIndex + 1}行，第${columnIndex + 1}列`
    }
  })
  return {
    rowIndex,
    children: rows
  }
}))

const ZoomAndDragRef = ref<InstanceType<typeof ZoomAndDrag>>()
onMounted(() => {
  nextTick(() => {
    ZoomAndDragRef.value?.resetZoomFn()
  })
})

const boxOldHeight = ref(680)
const boxHeight = ref(680)
function mouseMoveChangeFn(obj: EmitFnPalyload) {
  boxHeight.value = boxOldHeight.value * obj.zoom
  console.log('mouseMoveChangeFn', obj)
}
function zoomChangeFn(obj: EmitFnPalyload) {
  boxHeight.value = boxOldHeight.value * obj.zoom
  console.log('zoomChangeFn', obj)
}
</script>

<style lang="scss" scoped>
.row-list-box {
  .row-list {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 10%;
    overflow: hidden;
  }
  .col-list {
    flex: 1;
    height: calc(100% - 6px);
    overflow: hidden;
    .col-body {
      width: calc(100% - 6px);
      height: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>