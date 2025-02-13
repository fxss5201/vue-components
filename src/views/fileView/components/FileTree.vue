<template>
  <el-tree-v2
    ref="elTreeRef"
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
  </el-tree-v2>

  <FileAdd
    v-if="fileAddVisible"
    :visible="fileAddVisible"
    :fileNode="(currentContextmenuDirectory as FileNode)"
    @close="fileAddCloseFn"
    @confirm="fuleAddConfirmFn"></FileAdd>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getIconForFile, getIconForFolder, getIconForOpenFolder } from 'vscode-icons-js'

import { ArrowRight } from '@element-plus/icons-vue'
import { ElMessage, ElTreeV2 } from 'element-plus'
import type { TreeNodeData } from 'element-plus/es/components/tree-v2/src/types.mjs'

import FileAdd from './FileAdd.vue'
import type { FileNode, FileAddForm } from '@/types/fileView'

import { storeToRefs } from 'pinia'
import { useFileViewLayoutStore } from '@/stores/fileView/fileViewLayoutStore'
import { useFileTreeStore, getFileList, getFileIcon } from '@/stores/fileView/fileTreeStore'
import { useFileTabsStore } from '@/stores/fileView/fileTabsStore'

import { needClickLoadDirectory } from '@/config/fileConfig'

import { emitter } from '@/composables/mitt'

const { fileViewContentHeight } = storeToRefs(useFileViewLayoutStore())
const { addFileTab } = useFileTabsStore()

const elTreeRef = ref<typeof ElTreeV2>()
defineExpose({
  elTreeRef
})

const props = {
  value: 'key',
  label: 'label',
  children: 'children'
}

const defaultFileIcon = ref<string>(getIconForFile('default') as string)
const defaultFolderIcon = ref<string>(getIconForFolder('default') as string)
const defaultOpenFolderIcon = ref<string>(getIconForOpenFolder('default') as string)
const { rootFiles } = storeToRefs(useFileTreeStore())

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
    elTreeRef.value?.setData(rootFiles.value)
    return
  }
  addFileTab(data as FileNode)
  elTreeRef.value?.setCurrentKey(data.key)
}

let currentContextmenuDirectory = ref<FileNode | null>(null)
const fileNodeContextmenuFn = (e: Event, data: TreeNodeData) => {
  console.log(e, data)
  if (data.leaf) {
    return
  }
  currentContextmenuDirectory.value = data as FileNode
  fileAddVisible.value = true
}

const addFileFn = async (ruleForm: FileAddForm) => {
  if (!currentContextmenuDirectory.value) {
    return
  }
  let fileName = ''
  let fileHandle: FileSystemFileHandle | FileSystemDirectoryHandle | null = null
  if (ruleForm.type === 'file') {
    fileName = `${ruleForm.name}.${ruleForm.fileType}`
    // @ts-ignore
    fileHandle = await currentContextmenuDirectory.value.file?.getFileHandle(fileName, {
      create: true
    })
  } else {
    fileName = `${ruleForm.name}`
    // @ts-ignore
    fileHandle = await currentContextmenuDirectory.value.file?.getDirectoryHandle(fileName, {
      create: true
    })
  }
  const fileNodeKey = `${currentContextmenuDirectory.value.key}/${fileName}`
  const fileNode: FileNode = {
    key: fileNodeKey,
    parentKey: currentContextmenuDirectory.value.key,
    label: fileName,
    fileIcon: getFileIcon(fileHandle!),
    folderIcon: getIconForFolder(fileHandle!.name),
    openFolderIcon: getIconForOpenFolder(fileHandle!.name),
    leaf: ruleForm.type === 'file',
    file: fileHandle!
  }
  if (ruleForm.type === 'file') {
    addFileTab(fileNode as FileNode)
  } else {
    fileNode.children = []
  }
  (currentContextmenuDirectory.value as FileNode | null)?.children?.push(fileNode)
  elTreeRef.value?.setData(rootFiles.value)
  elTreeRef.value?.setCurrentKey(fileNodeKey)
}

const fileAddVisible = ref(false)
function fileAddCloseFn() {
  fileAddVisible.value = false
}
async function fuleAddConfirmFn(ruleForm: FileAddForm) {
  await addFileFn(ruleForm)
  currentContextmenuDirectory.value = null
  fileAddVisible.value = false
}

function updateTreeCurentFn (key: string) {
  elTreeRef.value?.setCurrentKey(key)
}

onMounted(() => {
  emitter.on('updateTreeCurent', updateTreeCurentFn)
})
onUnmounted(() => {
  emitter.off('updateTreeCurent', updateTreeCurentFn)
})
</script>

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
  .el-tree__empty-text {
    color: var(--color-text);
  }
}
</style>
