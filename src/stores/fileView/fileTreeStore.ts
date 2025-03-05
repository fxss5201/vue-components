import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getIconForFile, getIconForFolder, getIconForOpenFolder } from 'vscode-icons-js'
import { ElMessage } from 'element-plus'
import { readFileAsText } from '@/utils/fileReader'
import { mdFileTypeList, codeFileTypeList } from '@/config/fileConfig'

import { useCurrentFileStore } from '@/stores/fileView/currentFileStore'
import { useFileTabsStore } from '@/stores/fileView/fileTabsStore'

import { needClickLoadDirectory, imgFileTypeList } from '@/config/fileConfig'
import type { FileNode } from '@/types/fileView'

export const useFileTreeStore = defineStore('fileTreeStore', () => {
  const { setCurrentFile, setImgFileHandles, setEditorPermission } = useCurrentFileStore()
  const { setFileTabsValue, setFileTabs } = useFileTabsStore()

  const rootFiles = ref<FileNode[]>([])

  function resetDirectoryStoreFn () {
    rootFiles.value = []
    setCurrentFile(null)
    setImgFileHandles([])
    setFileTabsValue('')
    setFileTabs([])
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
  
      rootFiles.value = [
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
    rootFiles,
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
      const imgListFileNode = (children as FileNode[]).filter((item) => {
        const fileType = item.label!.split('.').pop()
        return fileType && imgFileTypeList.includes(fileType)
      })
      if (imgListFileNode.length > 0) {
        curObj.imgListFileNode = imgListFileNode
      }
    } else {
      const fileType = handelEle.name.split('.').pop() || ''
      if (mdFileTypeList.includes(fileType) || codeFileTypeList.includes(fileType)) {
        const file = await (handelEle as FileSystemFileHandle).getFile()
        let fileReader: FileReader['result']
        try {
          fileReader = await readFileAsText(file)
          curObj.fileContent = fileReader
        } catch (error) {
          console.log(error)
        }
      }
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

export function getFileDataByKey (key: string): FileNode {
  const keyArr = key.split('/').filter(x => x)
  let curObj = {} as unknown as FileNode
  for (let i = 0; i < keyArr.length; i++) {
    if (i === 0) {
      curObj = useFileTreeStore().rootFiles.find((item) => {
        return item.key === `/${keyArr.slice(0, i + 1).join('/')}`
      }) as FileNode
    } else {
      curObj = curObj.children?.find((item) => {
        return item.key === `/${keyArr.slice(0, i + 1).join('/')}`
      }) as FileNode
    }
  }
  return curObj
}

export function getParentFileDataByKey (key: string): FileNode {
  const keyArr = key.split('/')
  return getFileDataByKey(keyArr.slice(0, -1).join('/'))
}
