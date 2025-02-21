<template>
  <div class="page-box">
    <div class="page-head">
      <div style="margin-bottom: 8px;">请先选择项目打开，等项目加载好了之后，进行项目安装，然后正常起项目，成功之后可以在当前页面或者新的Tab页进行预览。</div>
      <el-button v-if="!isSelectFolder" plain @click="openFolderFn">打开项目</el-button>
      <el-button v-else plain @click="reloadPageFn">重新加载</el-button>
      <el-button v-if="serverUrl" plain @click="openPreviewFn">新Tab页预览</el-button>
    </div>
    <div v-if="isSelectFolder" class="page-body">
      <Splitpanes horizontal :dbl-click-splitter="false">
        <Pane size="80" min-size="50">
          <Splitpanes :dbl-click-splitter="false" :push-other-panes="false" style="height: calc(calc(100vh - 176px) * 0.8);">
            <Pane size="25" min-size="20">
              <el-scrollbar height="100%" style="width: 100%;">
                <CodeCard v-model="code" lang="json"></CodeCard>
              </el-scrollbar>
            </Pane>
            <Pane size="75" min-size="30">
              <iframe v-if="serverUrl" :src="serverUrl" style="width: 100%;height: 100%;" frameborder="0"></iframe>
            </Pane>
          </Splitpanes>
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
import CodeCard from '@/components/CodeCard.vue'

const isProd = ref(import.meta.env.PROD)

const mountFiles = ref<FileSystemTree>()
const terminalCardRef = ref<typeof TerminalCard>()
const isSelectFolder = ref(false)
const serverUrl = ref('')
function serverFn (url: string) {
  serverUrl.value = url
}
const code = ref('')

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

function reloadPageFn () {
  window.location.reload()
}

async function readyFn () {
  terminalCardRef.value?.webContainer.mount(mountFiles.value)
  terminalCardRef.value?.terminal.writeln(c.green(`Project loading completed.`))
  code.value = await terminalCardRef.value!.webContainer.fs.readFile('/package.json', 'utf-8')
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
  .page-body {
    flex: auto;
  }
}
</style>
