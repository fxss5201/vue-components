<template>
  <MonacoEditor v-model="model" :language="monacoEditorLanguage" :options="monacoEditorOptions" @save="onSaveFn"></MonacoEditor>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MonacoEditor, { type Options } from '@/components/MonacoEditor.vue'
import { ElMessage } from 'element-plus'
import { monacoEditorSupportLanguagesMap } from '@/config/fileConfig'

const model = defineModel({ type: String, default: '' })

const props = defineProps({
  lang: {
    type: String,
    required: true
  },
  isEditor: {
    type: Boolean,
    default: false
  },
  file: {
    type: Object as () => FileSystemFileHandle,
    required: false
  }
})

const monacoEditorLanguage = computed(() => {
  return monacoEditorSupportLanguagesMap[props.lang] || props.lang
})

const monacoEditorOptions = computed<Options>(() => {
  return {
    readOnly: !props.isEditor
  } 
})

const emit = defineEmits<{
  saveFile: []
}>()

async function onSaveFn () {
  if (props.file) {
    const writable = await props.file.createWritable()
    await writable.write(model.value)
    await writable.close()
    ElMessage.success('保存成功')
    emit('saveFile')
  }
}
</script>

<style scoped lang="scss"></style>