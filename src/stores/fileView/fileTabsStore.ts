import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import type { FileNode } from '@/types/fileView'

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
    } else {
      setFileTabsValue('')
    }
  }

  function updateFileTabsFileContent (key: string, fileContent: string) {
    fileTabs.value = fileTabs.value.map((item) => {
      if (item.key === key) {
        item.fileContent = fileContent
      }
      return item
    })
  }

  function updateFileTabsFileEditStatus (key: string, editStatus: boolean) {
    fileTabs.value = fileTabs.value.map((item) => {
      if (item.key === key) {
        item.editStatus = editStatus
      }
      return item
    })
  }

  function updateFileTabsScroll (key: string, scroll: { left: number, top: number }) {
    fileTabs.value = fileTabs.value.map((item) => {
      if (item.key === key) {
        item.scroll = scroll
      }
      return item
    })
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
    ElMessage.success('保存成功')
  }

  async function resetFileByKey (key: string) {
    const fileNode = getFileNodeByKey(key)
    const file = await (fileNode!.file as FileSystemFileHandle).getFile()
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = () => {
      updateFileTabsFileContent(key, reader.result as string)
      updateFileTabsFileEditStatus(key, false)
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
    updateFileTabsScroll,
    fileTabsCurrent,
    getFileNodeByKey,
    saveFileByKey,
    resetFileByKey
  }
})
