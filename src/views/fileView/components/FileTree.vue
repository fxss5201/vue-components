<template>
  <div v-if="rootFiles.length" class="inpit-box">
    <el-input
      v-model="queryWord"
      placeholder="搜索文件"
      @input="onQueryChanged"
    />
  </div>
  <el-tree-v2
    ref="elTreeRef"
    class="file-tree"
    :props="props"
    :icon="ArrowRight"
    highlight-current
    node-key="key"
    :filter-method="filterMethod"
    @node-click="fileNodeClickFn"
    @node-contextmenu="fileNodeContextmenuFn"
    @node-expand="onNodeExpand"
    @node-collapse="onNodeCollapse"
    :height="fileViewContentHeight - 52"
    empty-text="请选择文件夹"
  >
    <template #default="{ node, data }">
      <div class="file-tree-node" @mouseover="fileTreeNodemouseOverFn">
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

  <el-popover
    ref="popoverRef"
    :virtual-ref="buttonRef"
    trigger="contextmenu"
    title=""
    placement="right-start"
    virtual-triggering
    popper-class="file-tree-popover"
    popper-style="padding: 0px;"
    @show="popoverShowFn"
    @hide="popoverHideFn"
    :hide-after="0"
    :offset="0"
  >
    <ButtonList :list="buttonList" @click="buttonListClickFn"></ButtonList>
  </el-popover>

  <FileAdd
    v-if="fileAddVisible"
    :visible="fileAddVisible"
    :fileNode="(currentContextmenu as FileNode)"
    :addType="currentContextmenuType"
    @close="fileAddCloseFn"
    @confirm="fuleAddConfirmFn"></FileAdd>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getIconForFile, getIconForFolder, getIconForOpenFolder } from 'vscode-icons-js'

import { ArrowRight } from '@element-plus/icons-vue'
import { ElMessage, ElTreeV2, ElMessageBox } from 'element-plus'
import type { TreeNodeData } from 'element-plus/es/components/tree-v2/src/types.mjs'

import FileAdd from './FileAdd.vue'
import type { FileNode, FileAddDataType } from '@/types/fileView'
import ButtonList from '@/components/ButtonList.vue'
import type { ButtonItemProps } from '@/types/ButtonItemProps.ts'

import { storeToRefs } from 'pinia'
import { useFileViewLayoutStore } from '@/stores/fileView/fileViewLayoutStore'
import { useFileTreeStore, getFileList, getFileIcon, getParentFileDataByKey } from '@/stores/fileView/fileTreeStore'
import { useFileTabsStore } from '@/stores/fileView/fileTabsStore'

import { needClickLoadDirectory } from '@/config/fileConfig'

import { emitter } from '@/composables/mitt'

const { fileViewContentHeight } = storeToRefs(useFileViewLayoutStore())
const { addFileTab, removeFileTab } = useFileTabsStore()

const elTreeRef = ref<typeof ElTreeV2>()
defineExpose({
  elTreeRef,
  setTreeData
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
  if (queryWord.value) {
    queryWord.value = ''
    onQueryChanged(queryWord.value)
    elTreeRef.value?.scrollToNode(data.key)
  }
}

const currentContextmenu = ref<FileNode | null>(null)
const currentContextmenuCopy = ref<FileNode | null>(null)
const currentContextmenuType = ref<'file' | 'directory'>('file')
const buttonRef = ref()
const popoverRef = ref()
const fileTreePopoverShow = ref(false)
const buttonList = ref<ButtonItemProps[]>([])
const fileButtonList = ref<ButtonItemProps[]>([
  {
    key: 'addFile',
    name: '在同级新增文件'
  },
  {
    key: 'addDirectory',
    name: '在同级新增文件夹'
  },
  {
    key: 'deleteFile',
    name: '删除文件'
  }
])
const directoryButtonList = ref<ButtonItemProps[]>([
  {
    key: 'addFile',
    name: '新增文件'
  },
  {
    key: 'addDirectory',
    name: '新增文件夹'
  },
  {
    key: 'deleteDirectory',
    name: '删除文件夹'
  }
])
const fileNodeContextmenuFn = (e: Event, data: TreeNodeData) => {
  console.log(data)
  if (data.leaf) {
    buttonList.value = fileButtonList.value
    currentContextmenu.value = getParentFileDataByKey(data.key) as FileNode
  } else {
    buttonList.value = directoryButtonList.value
    currentContextmenu.value = data as FileNode
  }
  currentContextmenuCopy.value = data as FileNode
}
const fileTreeNodemouseOverFn = (e: MouseEvent) => {
  if (fileTreePopoverShow.value) popoverRef.value?.hide()
  buttonRef.value = e.currentTarget || e.target
}
const popoverShowFn = () => {
  fileTreePopoverShow.value = true
}
const popoverHideFn = () => {
  fileTreePopoverShow.value = false
}
function buttonListClickFn (item: ButtonItemProps) {
  switch (item.key) {
    case 'addFile':
      currentContextmenuType.value = 'file'
      fileAddVisible.value = true
      break
    case 'addDirectory':
      currentContextmenuType.value = 'directory'
      fileAddVisible.value = true
      break
    case 'deleteFile':
    case 'deleteDirectory':
      deleteFileBeforeFn()
      break
  }
}

function deleteFileBeforeFn () {
  const filekey = currentContextmenuCopy.value!.key
  const fileName = currentContextmenuCopy.value!.label
  const fileType = currentContextmenuCopy.value!.leaf ? '文件' : '文件夹 及其子内容'
  ElMessageBox.confirm(
    `此操作将永久删除 ${filekey}${fileType} , 是否继续删除 ${fileName}${fileType} ？`,
    '删除提示',
    {
      type: 'warning',
    }
  )
    .then(() => {
      deleteFileFn()
    })
    .catch(() => {})
}

async function deleteFileFn () {
  if (!currentContextmenuCopy.value) return
  const fileHandle = currentContextmenuCopy.value.file
  if (!fileHandle) return
  try {
    // @ts-ignore
    if (fileHandle.remove) {
      if (currentContextmenuCopy.value.leaf) {
        // @ts-ignore
        await fileHandle.remove()
      } else {
        // @ts-ignore
        await fileHandle.remove({ recursive: true })
      }
    } else {
      const parentFileNode = getParentFileDataByKey(currentContextmenuCopy.value.key) as FileNode
      if (!parentFileNode) return
      if (currentContextmenuCopy.value.leaf) {
        // @ts-ignore
        await parentFileNode.file.removeEntry(fileHandle.name)
      } else {
        // @ts-ignore
        await parentFileNode.file.removeEntry(fileHandle.name, { recursive: true })
      }
    }
  } catch (error) {
    console.log(error)
  }
  const parentFileNode = getParentFileDataByKey(currentContextmenuCopy.value.key) as FileNode
  if (!parentFileNode) return
  const findIndex = parentFileNode.children?.findIndex(x => x.key === currentContextmenuCopy.value!.key)
  if (findIndex !== undefined && findIndex > -1) {
    parentFileNode.children?.splice(findIndex, 1)
  }
  if (currentContextmenuCopy.value.leaf) {
    removeFileTab(currentContextmenuCopy.value.key)
  } else {
    deepRemoveFileTab(currentContextmenuCopy.value)
  }
  elTreeRef.value?.setData(rootFiles.value)
  currentContextmenuCopy.value = null
}

function deepRemoveFileTab (fileNode: FileNode) {
  if (!fileNode.children) return
  fileNode.children.forEach((item) => {
    if (item.leaf) {
      removeFileTab(item.key)
    } else {
      deepRemoveFileTab(item)
    }
  })
}

const addFileFn = async (ruleForm: FileAddDataType) => {
  if (!currentContextmenu.value) {
    return
  }
  let fileName = ''
  let fileHandle: FileSystemFileHandle | FileSystemDirectoryHandle | null = null
  if (ruleForm.type === 'file') {
    fileName = `${ruleForm.name}.${ruleForm.fileType}`
    // @ts-ignore
    fileHandle = await currentContextmenu.value.file?.getFileHandle(fileName, {
      create: true
    })
  } else {
    fileName = `${ruleForm.name}`
    // @ts-ignore
    fileHandle = await currentContextmenu.value.file?.getDirectoryHandle(fileName, {
      create: true
    })
  }
  const fileNodeKey = `${currentContextmenu.value.key}/${fileName}`
  const fileNode: FileNode = {
    key: fileNodeKey,
    parentKey: currentContextmenu.value.key,
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
  (currentContextmenu.value as FileNode | null)?.children?.push(fileNode)
  elTreeRef.value?.setData(rootFiles.value)
  elTreeRef.value?.setCurrentKey(fileNodeKey)
  expandedKeys.value = [...new Set<string>([...expandedKeys.value, currentContextmenu.value.key])]
  setExpandedKeysAndScrollToNode(fileNodeKey)
}

const fileAddVisible = ref(false)
function fileAddCloseFn() {
  fileAddVisible.value = false
}
async function fuleAddConfirmFn(ruleForm: FileAddDataType) {
  await addFileFn(ruleForm)
  currentContextmenu.value = null
  fileAddVisible.value = false
}

const queryWord = ref('')
const onQueryChanged = (query: string) => {
  elTreeRef.value!.filter(query)
}
const filterMethod = (query: string, node: TreeNodeData) => node.label!.toLowerCase().includes(query.toLowerCase())

function updateTreeCurentFn (key: string) {
  elTreeRef.value?.setCurrentKey(key)
  setExpandedKeysAndScrollToNode(key)
}

function setExpandedKeysAndScrollToNode (key: string) {
  const nowExpandedKeys = [...new Set([...expandedKeys.value, ...getExpandedKeys(key)])]
  elTreeRef.value?.setExpandedKeys(nowExpandedKeys)
  elTreeRef.value?.scrollToNode(key)
}

const expandedKeys = ref<string[]>([])
function setTreeData (data: FileNode[]) {
  if (!data.length) expandedKeys.value = []
  elTreeRef.value?.setData(data)
}
function onNodeExpand (data: TreeNodeData) {
  if (data.leaf) return
  if (!expandedKeys.value.includes(data.key)) {
    expandedKeys.value.push(data.key)
  }
}
function onNodeCollapse (data: TreeNodeData) {
  expandedKeys.value = expandedKeys.value.filter(x => x !== data.key)
}

function getExpandedKeys (key: string) {
  const keys = key.split('/').filter(x => x).slice(0, -1)
  const result = []
  for (let i = 0; i < keys.length; i++) {
    result.push(`/${keys.slice(0, i + 1).join('/')}`)
  }
  return result
}

onMounted(() => {
  emitter.on('updateTreeCurent', updateTreeCurentFn)
})
onUnmounted(() => {
  emitter.off('updateTreeCurent', updateTreeCurentFn)
})
</script>

<style lang="scss">
.inpit-box {
  padding: 10px;
  width: 100%;
  .el-input {
    width: 100%;
  }
}
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
