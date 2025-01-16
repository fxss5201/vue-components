<template>
  <div class="file-view">
    <div class="file-select">
      <el-button plain @click="selectDirectoryFn">选择文件夹</el-button>
    </div>
    <div ref="fileViewContent" class="file-view-content">
      <Splitpanes :dbl-click-splitter="false" :push-other-panes="false">
        <Pane size="20" min-size="15">
          <div class="file-view__left">
            <el-tree-v2
              ref="fileTreeRef"
              class="file-tree"
              :props="props"
              :icon="ArrowRight"
              highlight-current
              node-key="key"
              @node-click="fileNodeClickFn"
              @node-contextmenu="fileNodeContextmenuFn"
              :height="fileViewContentHeight"
              empty-text="请选择文件夹"
            >
              <template #default="{ node, data }">
                <el-popover
                  placement="right"
                  title=""
                  :width="200"
                  trigger="contextmenu"
                >
                  <template #reference>
                    <div class="file-tree-node">
                      <template v-if="data.leaf">
                        <el-image :src="`./icons/${data.fileIcon}`" alt="file" class="file-icon">
                          <template #placeholder>
                            <img :src="`./icons/${defaultFileIcon}`" alt="file" class="file-icon" />
                          </template>
                          <template #error>
                            <img :src="`./icons/${defaultFileIcon}`" alt="file" class="file-icon" />
                          </template>
                        </el-image>
                      </template>
                      <template v-else>
                        <el-image
                          :src="`./icons/${node.expanded ? data.openFolderIcon : data.folderIcon}`"
                          alt="folder"
                          class="file-icon"
                        >
                          <template #placeholder>
                            <img
                              :src="`./icons/${node.expanded ? defaultOpenFolderIcon : defaultFolderIcon}`"
                              alt="folder"
                              class="file-icon"
                            />
                          </template>
                          <template #error>
                            <img
                              :src="`./icons/${node.expanded ? defaultOpenFolderIcon : defaultFolderIcon}`"
                              alt="folder"
                              class="file-icon"
                            />
                          </template>
                        </el-image>
                      </template>
                      <div class="file-tree-node-label" :title="node.label">{{ node.label }}</div>
                    </div>
                  </template>
                  <template #default>
                    <div>新增文件</div>
                    <div>新增文件夹</div>
                  </template>
                </el-popover>
              </template>
            </el-tree-v2>
          </div>
        </Pane>
        <Pane min-size="30">
          <div class="file-view__right">
            <div class="file-view-body">
              <FileReader
                v-if="currentFile"
                :file="currentFile"
                :imgFileHandles="imgFileHandles"
                :editorPermission="isEditorPermission"
                :fileViewContentHeight="fileViewContentHeight"
              />
              <div v-else class="empty">请选择文件</div>
            </div>
          </div>
        </Pane>
      </Splitpanes>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import { useElementSize } from '@vueuse/core'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { getIconForFile, getIconForFolder, getIconForOpenFolder } from 'vscode-icons-js'
import { ElMessage } from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'
import FileReader from '@/components/FileReader.vue'
import { imgFileTypeList, needClickLoadDirectory } from '@/config/fileConfig'
import { ElTreeV2 } from 'element-plus'
import type { TreeNode, TreeNodeData } from 'element-plus/es/components/tree-v2/src/types.mjs'

const imgFileHandles = ref<FileSystemFileHandle[]>([])
const fileViewContent = ref<HTMLDivElement | null>()
const { height: fileViewContentHeight } = useElementSize(fileViewContent)
const fileTreeRef = ref<typeof ElTreeV2>()

const props = {
  value: 'key',
  label: 'label',
  children: 'children'
}

interface FileNode {
  key: string
  parentKey: string
  label: string
  leaf: boolean
  fileIcon: string | undefined
  folderIcon: string | undefined
  openFolderIcon: string | undefined
  file?: FileSystemDirectoryHandle | FileSystemFileHandle
  children?: FileNode[]
}

const defaultFileIcon = getIconForFile('default')
const defaultFolderIcon = getIconForFolder('default')
const defaultOpenFolderIcon = getIconForOpenFolder('default')
const isEditorPermission = ref(false)

let rootFiles: FileNode[] = []

async function selectDirectoryFn() {
  // @ts-ignore
  if (!window.showDirectoryPicker) {
    ElMessage.warning('当前浏览器不支持')
    return
  }
  let dirHandle: FileSystemDirectoryHandle | null = null
  try {
    rootFiles = []
    currentFile.value = null
    imgFileHandles.value = []
    fileTreeRef.value?.setData(rootFiles)
    // @ts-ignore
    dirHandle = await window.showDirectoryPicker()
    if (!dirHandle) {
      return
    }

    isEditorPermission.value = await verifyPermission(dirHandle, 'readwrite')
    if (!isEditorPermission.value) {
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
    fileTreeRef.value?.setData(rootFiles)
    nextTick(() => {
      fileTreeRef.value?.setExpandedKeys([rootFiles[0].key])
    })
  } catch (error: any) {
    ElMessage.error(error.message)
  }
}

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

async function getFileList(dirHandle: FileSystemDirectoryHandle, parentKey: string = '') {
  const currentRankFiles: FileNode[] = []
  // @ts-ignore
  for await (let handelEle of dirHandle.values()) {
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

const getFileIcon = (file: FileSystemDirectoryHandle | FileSystemFileHandle) => {
  const fileName = file.name.split('.').pop()
  return fileName ? getIconForFile(fileName) : ''
}

const currentFile = ref<FileSystemFileHandle | null>(null)
const fileNodeClickFn = async (data: TreeNodeData) => {
  if (!data.leaf) {
    if (needClickLoadDirectory.includes(data.label) && !data.children.length) {
      const elMessage = ElMessage({
        showClose: true,
        message: `正在加载${data.label}目录下的文件...`,
        duration: 0,
        type: 'info'
      })
      data.children = await getFileList(data.file as FileSystemDirectoryHandle, data.key)
      elMessage.close()
    }
    fileTreeRef.value?.setData(rootFiles)
    return
  }
  currentFile.value = data.file as FileSystemFileHandle
  const parentNode = fileTreeRef.value?.getNode(data.parentKey!)
  const imgListFileHandle: FileSystemFileHandle[] = (parentNode.children as TreeNode[]).filter((item) => {
    const fileType = item.label!.split('.').pop()
    return fileType && imgFileTypeList.includes(fileType)
  }).map(x => x.data.file! as FileSystemFileHandle)
  imgFileHandles.value = imgListFileHandle || []
}
const fileNodeContextmenuFn = (e: Event, data: TreeNodeData) => {
  console.log(e, data)
}
</script>

<style lang="scss" scoped>
.empty {
  margin: 16px 0;
  text-align: center;
}
.file-view-content {
  width: 100%;
  height: calc(100vh - 128px);
}
.file-view__left,
.file-view__right {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.file-view-body {
  margin-left: 16px;
  height: 100%;
}
</style>

<style lang="scss">
.file-tree {
  width: 100%;
  overflow: hidden;
  .el-tree-node,
  .el-tree-node__content {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .el-tree-node__content {
    display: flex;
    align-items: center;
    .el-icon {
      flex: 0 0 auto;
    }
    .file-tree-node {
      flex: auto;
      display: flex;
      align-items: center;
      overflow: hidden;

      .file-icon {
        flex: 0 0 auto;
        width: 18px;
        height: 18px;
        margin-right: 4px;
      }
      .file-tree-node-label {
        flex: auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
