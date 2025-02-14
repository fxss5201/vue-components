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
      <el-form-item label="名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item v-if="props.addType === 'file'" label="类型" prop="fileType">
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
import type { FileNode, FileAddForm, FileAddDataType } from '@/types/fileView'
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
    addType: 'file' | 'directory'
  }>(),
  {
    visible: false
  }
)

const emit = defineEmits<{
  close: [],
  confirm: [ruleForm: FileAddDataType]
}>()

const dialogTitle = computed(() => {
  return `在目录${props.fileNode.key}下新增${props.addType === 'file' ? '文件' : '文件夹'}`
})

const ruleForm = ref<FileAddForm>({
  name: '',
  fileType: ''
})

const validateFileName = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入名称'))
  } else {
    if (/^[a-zA-Z_\u4e00-\u9fa5.-][a-zA-Z0-9_\u4e00-\u9fa5.-]*(?=\.[^.]+$|$)/.test(value)) {
      callback()
    } else {
      callback(new Error('名称只能包含数字、字母、下划线、中文、点和减号，且不能以数字或点开头或结尾，不需要包含类型后缀'))
    }
  }
}
const rules = reactive<FormRules<FileAddForm>>({
  name: [
    { validator: validateFileName, trigger: 'blur' }
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
      emit('confirm', {
        ...ruleForm.value,
        type: props.addType
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<style lang="scss" scoped></style>
