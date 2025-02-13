import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import type { FileNode } from '@/types/fileView'
import { emitter } from '@/composables/mitt'

export const useFileTabsStore = defineStore('fileTabsStore', () => {
  const fileTabsValue = ref('')

  function setFileTabsValue(val: string) {
    fileTabsValue.value = val
  }

  const fileTabs = ref<FileNode[]>([])

  const fileTabsKeys = computed(() => {
    return fileTabs.value.map((item) => {
      return item.key
    })
  })

  function setFileTabs(val: FileNode[]) {
    fileTabs.value = val
  }

  function addFileTab(val: FileNode) {
    // 如果存在，则直接跳转到该标签页，否则添加
    if (!fileTabsKeys.value.includes(val.key!)) {
      fileTabs.value.push(val)
    }
    setFileTabsValue(val.key!)
  }

  function removeFileTab(key: string) {
    fileTabs.value = fileTabs.value.filter((item) => {
      return item.key !== key
    })
    if (fileTabs.value.length > 0) {
      setFileTabsValue(fileTabs.value[0].key!)
      emitter.emit('updateTreeCurent', fileTabs.value[0].key!)
    } else {
      setFileTabsValue('')
      emitter.emit('updateTreeCurent', '')
    }
  }

  function updateFileTabsFileContent (key: string, fileContent: string) {
    const fileNode = getFileNodeByKey(key)
    fileNode!.fileContent = fileContent
  }

  function updateFileTabsFileEditStatus (key: string, editStatus: boolean) {
    const fileNode = getFileNodeByKey(key)
    fileNode!.editStatus = editStatus
  }

  function updateFileTabsFileClosePreview (key: string, closePreview: boolean) {
    const fileNode = getFileNodeByKey(key)
    fileNode!.closePreview = closePreview
  }

  function updateFileTabsScroll (key: string, scroll: { left: number, top: number }) {
    const fileNode = getFileNodeByKey(key)
    fileNode!.scroll = scroll
  }

  const fileTabsCurrent = computed(() => {
    return fileTabs.value.find((item) => {
      return item.key === fileTabsValue.value
    })
  })

  function getFileNodeByKey (key: string) {
    return fileTabs.value.find((item) => {
      return item.key === key
    })
  }

  async function saveFileByKey (key: string) {
    const fileNode = getFileNodeByKey(key)
    const writable = await (fileNode!.file as FileSystemFileHandle).createWritable()
    await writable.write(fileNode!.fileContent as string)
    await writable.close()
    updateFileTabsFileEditStatus(key, false)
    ElMessage.success('保存成功')
  }

  async function resetFileByKey (key: string, callback?: () => void) {
    const fileNode = getFileNodeByKey(key)
    const file = await (fileNode!.file as FileSystemFileHandle).getFile()
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = () => {
      updateFileTabsFileContent(key, reader.result as string)
      updateFileTabsFileEditStatus(key, false)
      callback && callback()
    }
  }

  return {
    fileTabsValue,
    setFileTabsValue,
    fileTabs,
    fileTabsKeys,
    setFileTabs,
    addFileTab,
    removeFileTab,
    updateFileTabsFileContent,
    updateFileTabsFileEditStatus,
    updateFileTabsFileClosePreview,
    updateFileTabsScroll,
    fileTabsCurrent,
    getFileNodeByKey,
    saveFileByKey,
    resetFileByKey
  }
})
