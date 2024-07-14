<template>
  <div class="page-box">
    <div class="mb-12">
      <el-button type="primary" @click="addEvent">新增</el-button>
      <el-button @click="getStudentList">刷新</el-button>
      <el-button @click="getThreeStudentList">多次刷新</el-button>
    </div>
    <el-table :data="tableData" :border="true" style="width: 100%">
      <el-table-column property="id" label="ID" />
      <el-table-column property="name" label="姓名" />
      <el-table-column property="age" label="年龄" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="toDetailEvent(scope.row)"
            >编辑</el-button
          >
          <el-button link type="primary" size="small" @click="delStudentEvent(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <StudentDialog
      :dialogVisible="dialogVisible"
      :isEditor="isEditor"
      :id="editorId"
      @cancle="dialogCancleFn"
      @confirm="dialogConfirmFn"
    />
  </div>
</template>

<script setup lang="ts">
import { studentListHttp, delStudentHttp } from '@/service/student'
import { ref, onMounted } from 'vue'
import { type StudentType } from '@/types/studentType'
import StudentDialog from './StudentDialog.vue'

onMounted(() => {
  getStudentList()
})
const tableData = ref<StudentType[]>([])
async function getStudentList() {
  const res = await studentListHttp()
  tableData.value = res.data.result
  console.log(res.data.result)
}
function getThreeStudentList() {
  getStudentList()
  getStudentList()
  getStudentList()
}
function toDetailEvent(obj: StudentType) {
  editorId.value = obj.id
  isEditor.value = true
  dialogVisible.value = true
}
async function delStudentEvent(obj: StudentType) {
  await delStudentHttp(obj.id as number)
  getStudentList()
}

const dialogVisible = ref(false)
const isEditor = ref(false)
const editorId = ref<number>()
function addEvent() {
  isEditor.value = false
  dialogVisible.value = true
}
function dialogCancleFn() {
  dialogVisible.value = false
}
function dialogConfirmFn() {
  dialogVisible.value = false
  getStudentList()
}
</script>

<style lang="scss" scoped>
.page-box {
  padding: 12px;

  .mb-12 {
    margin-bottom: 12px;
  }
}
</style>
