import { defineStore } from 'pinia'
import { getIconForFile, getIconForFolder, getIconForOpenFolder } from 'vscode-icons-js'
import type { FileNode } from '@/types/fileView'
import { ElMessage } from 'element-plus'
import { useCurrentFileStore } from '@/stores/fileView/currentFileStore'
import { needClickLoadDirectory } from '@/config/fileConfig'

export let rootFiles: FileNode[] = []

export const useFileTreeStore = defineStore('fileTreeStore', () => {
  const { setCurrentFile, setImgFileHandles, setEditorPermission } = useCurrentFileStore()

  function resetDirectoryStoreFn () {
    rootFiles = []
    setCurrentFile(null)
    setImgFileHandles([])
  }

  async function selectDirectoryStoreFn() {
    // @ts-ignore
    if (!window.showDirectoryPicker) {
      ElMessage.warning('当前浏览器不支持')
      return
    }
    let dirHandle: FileSystemDirectoryHandle | null = null
    try {
      // @ts-ignore
      dirHandle = await window.showDirectoryPicker()
      if (!dirHandle) {
        return
      }
  
      const editorPermission = await verifyPermission(dirHandle, 'readwrite')
      setEditorPermission(editorPermission)
      if (!editorPermission) {
        ElMessage.warning('当前仅有文件访问权限，如需编辑，请授予文件编辑权限')
      }
  
      rootFiles = [
        {
          key: `/${dirHandle.name}`,
          parentKey: '',
          label: dirHandle.name,
          fileIcon: getFileIcon(dirHandle),
          folderIcon: getIconForFolder(dirHandle.name),
          openFolderIcon: getIconForOpenFolder(dirHandle.name),
          leaf: false,
          file: dirHandle as FileSystemDirectoryHandle,
          children: await getFileList(dirHandle as FileSystemDirectoryHandle, `/${(dirHandle as FileSystemDirectoryHandle).name}`)
        }
      ]
    } catch (error: any) {
      ElMessage.error(error.message)
    }
  }

  return {
    selectDirectoryStoreFn,
    resetDirectoryStoreFn
  }
})

async function verifyPermission(fileHandle: FileSystemDirectoryHandle, withWrite: string = 'read') {
  // read / readwrite
  const opts = {
    mode: withWrite
  }

  // 检查是否已经拥有相应权限，如果是，返回 true。
  // @ts-ignore
  if ((await fileHandle.queryPermission(opts)) === 'granted') {
    return true
  }

  // 为文件请求权限，如果用户授予了权限，返回 true。
  // @ts-ignore
  if ((await fileHandle.requestPermission(opts)) === 'granted') {
    return true
  }

  // 用户没有授权，返回 false。
  return false
}

export function getFileIcon (file: FileSystemDirectoryHandle | FileSystemFileHandle) {
  const fileName = file.name.split('.').pop()
  return fileName ? getIconForFile(fileName) : ''
}

export async function getFileList(dirHandle: FileSystemDirectoryHandle, parentKey: string = '') {
  const currentRankFiles: FileNode[] = []
  // @ts-ignore
  for await (const handelEle of dirHandle.values()) {
    const fileKey = `${parentKey}/${handelEle.name}`
    const curObj: FileNode = {
      key: fileKey,
      parentKey,
      label: handelEle.name,
      fileIcon: getFileIcon(handelEle),
      folderIcon: getIconForFolder(handelEle.name),
      openFolderIcon: getIconForOpenFolder(handelEle.name),
      leaf: handelEle.kind === 'file',
      file: handelEle as FileSystemFileHandle
    }
    if (handelEle.kind === 'directory') {
      let children: FileNode[] = []
      if (!needClickLoadDirectory.includes(handelEle.name)) {
        children = await getFileList(handelEle as FileSystemDirectoryHandle, fileKey)
      }
      curObj.children = children
    }

    currentRankFiles.push(curObj)
  }
  // 按照文件夹在前，文件在后排序
  currentRankFiles.sort((a, b) => {
    if (!a.leaf && b.leaf) {
      return -1
    }
    if (a.leaf && !b.leaf) {
      return 1
    }
    return 0
  })
  return currentRankFiles
}
