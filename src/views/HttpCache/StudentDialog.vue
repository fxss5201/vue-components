<template>
  <el-dialog
    :model-value="props.dialogVisible"
    :title="isEditor ? '编辑' : '新增'"
    width="500"
    :before-close="cancleEvent"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="form.age" :min="0" :max="10" controls-position="right" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancleEvent" :disabled="confirmLoading">取消</el-button>
        <el-button type="primary" @click="confirmEvent" :loading="confirmLoading">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { addStudentHttp, getStudentByIdHttp, putStudentHttp } from '@/service/student'
import { ref, reactive, watch } from 'vue'
import { type StudentType } from '@/types/studentType'
import type { FormInstance, FormRules } from 'element-plus'

interface Props {
  dialogVisible: boolean
  isEditor: boolean
  id?: number
}

const props = defineProps<Props>()
const emits = defineEmits(['cancle', 'confirm'])
function cancleEvent() {
  formRef.value?.resetFields()
  emits('cancle')
}
const confirmLoading = ref(false)
async function confirmEvent() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      await addStudentFn()
      formRef.value?.resetFields()
      emits('confirm')
    } else {
      console.log('error submit!', fields)
    }
  })
}
async function addStudentFn() {
  if (confirmLoading.value === true) return
  confirmLoading.value = true
  if (props.id) {
    await putStudentHttp(form.value)
  } else {
    await addStudentHttp(form.value)
  }
  confirmLoading.value = false
}

const formRef = ref<FormInstance>()
const form = ref<StudentType>({
  name: '',
  age: 0
})
const rules = reactive<FormRules<StudentType>>({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }]
})

watch(
  () => props.dialogVisible,
  (newVal) => {
    if (newVal && props.id) {
      getStudentById()
    }
  }
)

async function getStudentById() {
  const res = await getStudentByIdHttp(props.id as number)
  form.value = res.data.result
}
</script>

<style lang="scss" scoped></style>
