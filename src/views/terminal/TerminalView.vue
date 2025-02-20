<template>
  <div class="page-box">
    <div class="page-head">
      <div style="margin-bottom: 8px;">请先选择项目打开，等项目加载好了之后，进行项目安装，然后正常起项目，成功之后可以在当前页面或者新的Tab页进行预览。由于 github page 无法设置 headers，此页面完整体验请去 <a href="https://fxss-vue-components.netlify.app/#/terminalView" class="a-class" target="_blank">终端体验</a> 。</div>
      <el-button plain @click="openFolderFn">打开项目</el-button>
      <el-button v-if="serverUrl" plain @click="openPreviewFn">新Tab页预览</el-button>
    </div>
    <div v-if="isSelectFolder" class="page-body">
      <Splitpanes horizontal :dbl-click-splitter="false">
        <Pane size="80" min-size="50">
          <iframe v-if="serverUrl" :src="serverUrl" style="width: 100%;height: 100%;" frameborder="0"></iframe>
        </Pane>
        <Pane size="20" min-size="18">
          <TerminalCard ref="terminalCardRef" @ready="readyFn" @server="serverFn"></TerminalCard>
        </Pane>
      </Splitpanes>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { readFileAsText } from '@/utils/fileReader'
import TerminalCard from '@/components/TerminalCard.vue'
import { type FileSystemTree } from '@webcontainer/api'
import c from 'chalk'
import { ElMessage } from 'element-plus'

const mountFiles = ref<FileSystemTree>()
const terminalCardRef = ref<typeof TerminalCard>()
const isSelectFolder = ref(false)
const serverUrl = ref('')
function serverFn (url: string) {
  serverUrl.value = url
}

async function openFolderFn () {
  // @ts-ignore
  if (!window.showDirectoryPicker) {
    ElMessage.warning('当前浏览器不支持')
    return
  }
  try {
    // @ts-ignore
    const dir = await window.showDirectoryPicker()
    convertDirectoryHandleToFiles(dir).then(async (files) => {
      isSelectFolder.value = true
      mountFiles.value = files
      terminalCardRef.value?.terminal.writeln(c.green(`Project loading completed.`))
    })
  } catch (error: any) {
    ElMessage.error(error.message)
  }
}

function readyFn () {
  terminalCardRef.value?.webContainer.mount(mountFiles.value)
  terminalCardRef.value?.terminal.writeln(c.green(`Project loading completed.`))
}

function openPreviewFn () {
  window.open(`${location.origin}${location.pathname}#/previewView?serverUrl=${serverUrl.value}`, '_blank')
}

async function convertDirectoryHandleToFiles(directoryHandle: FileSystemDirectoryHandle) {
  const files: FileSystemTree = {}
  // @ts-ignore
  for await (const [name, entry] of directoryHandle.entries()) {
    if (name !== 'node_modules') {
      if (entry.kind === 'directory') {
        // 如果是目录，递归调用 convertDirectoryHandleToFiles
        files[name] = {
          directory: await convertDirectoryHandleToFiles(entry)
        }
      } else if (entry.kind === 'file') {
        // 如果是文件，读取文件内容
        const file = await entry.getFile()
        const fileText = await readFileAsText(file)
        files[name] = {
          file: {
            contents: fileText
          }
        }
      }
    }
  }
  return files
}
</script>

<style lang="scss" scoped>
.page-box {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
  .page-head {
    flex: 0 0 auto;
    height: 80px;
    border-bottom: 1px solid var(--el-border-color);
  }
  .a-class {
    color: var(--el-color-primary);
  }
  .page-body {
    flex: auto;
  }
}
</style>
