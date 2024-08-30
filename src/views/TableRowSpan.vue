<template>
  <div class="page-box">
    <div class="box-title">原始表格：</div>
    <el-table
      :data="testTable"
      border
      style="width: 100%;"
    >
      <el-table-column prop="id" label="ID" width="180" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="subId" label="子 ID" />
      <el-table-column prop="position" label="位置" />
      <el-table-column prop="price" label="价格" />
    </el-table>

    <div class="box-title">根据ID合并表格：</div>
    <el-table
      :data="handleTable1"
      :span-method="arraySpanMethod"
      border
      style="width: 100%;"
    >
      <el-table-column prop="id" label="ID" width="180" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="subId" label="子 ID" />
      <el-table-column prop="position" label="位置" />
      <el-table-column prop="price" label="价格" />
    </el-table>

    <div class="box-title">再根据子ID合并表格：</div>
    <el-table
      :data="handleTable2"
      :span-method="arraySpanMethod"
      border
      style="width: 100%;"
    >
      <el-table-column prop="id" label="ID" width="180" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="subId" label="子 ID" />
      <el-table-column prop="position" label="位置" />
      <el-table-column prop="price" label="价格" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { elTableRowSpan } from 'conversion-library'
import type { TableColumnCtx } from 'element-plus'

interface rowType {
  id: string
  name: string
  subId: string
  position: string
  price: number
}

interface SpanMethodProps {
  row: rowType
  column: TableColumnCtx<rowType>
  rowIndex: number
  columnIndex: number
}

const testTable = ref<rowType[]>([
  {name: '显示器', id: '1', subId: '1-1', position: '一楼101',price: 1000},
  {name: '显示器', id: '1', subId: '1-2', position: '一楼101',price: 1000},
  {name: '显示器', id: '1', subId: '1-2', position: '一楼102',price: 1000},
  {name: '显示器', id: '2', subId: '2-1', position: '一楼102',price: 1000},
  {name: '文化衫', id: '3', subId: '3-1', position: '一楼102',price: 100}
])

const handleTable1 = ref(elTableRowSpan(testTable.value, 'id', [0, 1]))
const handleTable2 = ref(elTableRowSpan(handleTable1.value, 'subId', [2, 3], 1))

const arraySpanMethod = ({
  row,
  rowIndex,
  columnIndex,
}: SpanMethodProps) => {
  return (row as any)[`row${rowIndex}col${columnIndex}`] || [1, 1]
}
</script>

<style lang="scss" scoped>
.page-box {
  padding: 0 20px 20px;
}
.box-title {
  margin: 20px 0 10px;
}
</style>
