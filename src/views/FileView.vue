<template>
  <div class="file-view">
    <div class="file-select">
      <el-button plain @click="selectDirectoryFn">选择文件夹</el-button>
    </div>
    <div v-if="rootFiles.length" class="file-view-content">
      <Splitpanes :dbl-click-splitter="false" :push-other-panes="false">
        <Pane size="20" min-size="15">
          <div class="file-view__left">
            <el-scrollbar>
              <el-tree
                class="file-tree"
                :props="props"
                :load="loadNode"
                :icon="ArrowRight"
                highlight-current
                node-key="key"
                lazy
                :default-expanded-keys="[rootFiles[0].key]"
                @node-click="fileNodeClickFn"
              >
                <template #default="{ node, data }">
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
              </el-tree>
            </el-scrollbar>
          </div>
        </Pane>
        <Pane min-size="30">
          <div class="file-view__right">
            <div class="file-view-body">
              <FileReader
                v-if="currentFile"
                :file="currentFile"
                :imgFileHandles="imgFileHandles"
                boxHeight="calc(100vh - 128px)"
              />
              <div v-else class="empty">请选择文件</div>
            </div>
          </div>
        </Pane>
      </Splitpanes>
    </div>
    <div v-else class="empty">请先选择文件夹</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { getIconForFile, getIconForFolder, getIconForOpenFolder } from 'vscode-icons-js'
import { ElMessage } from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'
import FileReader from '@/components/FileReader.vue'
import { imgFileTypeList } from '@/config/fileConfig'

const imgFileHandles = ref<FileSystemFileHandle[]>([])

interface Tree {
  name: string
  leaf?: boolean
}

const props = {
  label: 'name',
  children: 'children',
  isLeaf: 'leaf'
}

interface FileNode extends Tree {
  key: string
  fileIcon: string | undefined
  folderIcon: string | undefined
  openFolderIcon: string | undefined
  file?: FileSystemDirectoryHandle | FileSystemFileHandle
}

const defaultFileIcon = getIconForFile('default')
const defaultFolderIcon = getIconForFolder('default')
const defaultOpenFolderIcon = getIconForOpenFolder('default')

const loadNode = async (node: Node, resolve: (data: FileNode[]) => void) => {
  if (node.level === 0) {
    return resolve(rootFiles.value)
  }
  const fileList = await getFileList(node.data.file as FileSystemDirectoryHandle, node.data.key)
  resolve(fileList)
}

const rootFiles = ref<FileNode[]>([])

async function selectDirectoryFn() {
  // @ts-ignore
  if (!window.showDirectoryPicker) {
    ElMessage.warning('当前浏览器不支持')
    return
  }
  let dirHandle: FileSystemDirectoryHandle | null = null
  try {
    rootFiles.value = []
    currentFile.value = null
    imgFileHandles.value = []
    // @ts-ignore
    dirHandle = await window.showDirectoryPicker()
    if (!dirHandle) {
      return
    }
    rootFiles.value = [
      {
        key: `/${dirHandle.name}`,
        name: dirHandle.name,
        fileIcon: getFileIcon(dirHandle),
        folderIcon: getIconForFolder(dirHandle.name),
        openFolderIcon: getIconForOpenFolder(dirHandle.name),
        leaf: false,
        file: dirHandle as FileSystemDirectoryHandle
      }
    ]
    // rootFiles.value = await getFileList(dirHandle as FileSystemDirectoryHandle, `/${(dirHandle as FileSystemDirectoryHandle).name}`)
  } catch (error) {
    ElMessage.error('请授予文件访问权限')
  }
}

async function getFileList(dirHandle: FileSystemDirectoryHandle, parentKey: string = '') {
  const currentRankFiles: FileNode[] = []
  const imgListFileHandle: FileSystemFileHandle[] = []
  // @ts-ignore
  for await (let handelEle of dirHandle.values()) {
    const fileKey = `${parentKey}/${handelEle.name}`
    currentRankFiles.push({
      key: fileKey,
      name: handelEle.name,
      fileIcon: getFileIcon(handelEle),
      folderIcon: getIconForFolder(handelEle.name),
      openFolderIcon: getIconForOpenFolder(handelEle.name),
      leaf: handelEle.kind === 'file',
      file: handelEle as FileSystemFileHandle
    })

    if (handelEle.kind === 'file') {
      const fileType = handelEle.name.split('.').pop()
      if (fileType && imgFileTypeList.includes(fileType)) {
        imgListFileHandle.push(handelEle as FileSystemFileHandle)
      }
    }
  }
  imgFileHandles.value = imgListFileHandle
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
const fileNodeClickFn = async (data: FileNode) => {
  if (!data.leaf) {
    return
  }
  currentFile.value = data.file as FileSystemFileHandle
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
