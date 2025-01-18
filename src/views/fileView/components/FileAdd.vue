<template>
  <el-dialog
    :model-value="props.visible"
    :title="dialogTitle"
    width="500"
    :before-close="handleCloseFn"
  >
    <el-form
      ref="fileAddFormRef"
      style="width: 100%"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      status-icon
    >
      <el-form-item label="文件/文件夹" prop="type">
        <el-radio-group v-model="ruleForm.type">
          <el-radio value="file">文件</el-radio>
          <el-radio value="directory">文件夹</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item v-if="ruleForm.type === 'file'" label="类型" prop="fileType">
        <el-select-v2 v-model="ruleForm.fileType" filterable :options="fileTypeListValue" placeholder="请选择类型"></el-select-v2>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCloseFn">取消</el-button>
        <el-button type="primary" @click="handleConfirmFn">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { FileNode, FileAddForm } from '@/types/fileView'
import { computed, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
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

const props = withDefaults(
  defineProps<{
    visible: boolean,
    fileNode: FileNode
  }>(),
  {
    visible: false
  }
)

const emit = defineEmits<{
  close: [],
  confirm: [ruleForm: FileAddForm]
}>()

const dialogTitle = computed(() => {
  return `在目录${props.fileNode.key}下新增`
})

const ruleForm = reactive<FileAddForm>({
  name: '',
  type: '',
  fileType: ''
})

const rules = reactive<FormRules<FileAddForm>>({
  type: [
    { required: true, message: '请选择文件/文件夹', trigger: 'change' }
  ],
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' }
  ],
  fileType: [
    { required: true, message: '请选择类型', trigger: 'change' }
  ]
})

const fileAddFormRef = ref<FormInstance>()

function handleCloseFn() {
  fileAddFormRef.value!.resetFields()
  emit('close')
}

async function handleConfirmFn() {
  await fileAddFormRef.value!.validate((valid, fields) => {
    if (valid) {
      emit('confirm', ruleForm)
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<style lang="scss" scoped></style>
