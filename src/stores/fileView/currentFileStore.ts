import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCurrentFileStore = defineStore('currentFileStore', () => {
  const currentFile = ref<FileSystemFileHandle | null>(null)
  function setCurrentFile(file: FileSystemFileHandle | null) {
    currentFile.value = file
  }

  const imgFileHandles = ref<FileSystemFileHandle[]>([])
  function setImgFileHandles(files: FileSystemFileHandle[]) {
    imgFileHandles.value = files
  }

  const editorPermission = ref(false)
  function setEditorPermission(permission: boolean) {
    editorPermission.value = permission
  }

  return {
    currentFile,
    setCurrentFile,
    imgFileHandles,
    setImgFileHandles,
    editorPermission,
    setEditorPermission
  }
})
