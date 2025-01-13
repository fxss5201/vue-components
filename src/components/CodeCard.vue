<template>
  <div class="code-card"
    :style="{ backgroundColor: bgColorStyle }">
    <div v-if="!props.isEditor" class="code-card-tool" :style="{ color: colorStyle }">
      <div v-if="props.lang" class="code-lang">{{ props.lang }}</div>
      <template v-if="isSupported">
        <svg v-if="copied" aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16">
          <path fill="currentColor" d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
        </svg>
        <svg v-else @click="copy(model)"
          aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" style="cursor: pointer;">
          <path fill="currentColor" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path>
          <path fill="currentColor" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
        </svg>
      </template>
    </div>
    <div class="code-wrap">
      <div class="code-line-box"
        v-if="props.lineNumbers"
        :style="{ color: colorStyle, borderRightColor: borderColorStyle }">
        <div class="code-line" v-for="item in codeLines" :key="item">{{ item }}</div>
      </div>
      <div class="code-content">
        <div ref="codeBodyRef" class="code-body">
          <textarea v-if="props.isEditor" ref="textareaRef" class="code-input" v-model="model" v-on-key-stroke:c,s="onSaveFileFn" spellcheck="false"></textarea>
          <div class="code-text"
            :style="{ paddingBottom: props.isEditor ? '21px' : 0 }">
            <pre :class="[isVue ? 'shiki github-dark' : 'hljs']" :style="[isVue ? 'background-color:#24292e;color:#e1e4e8' : '']"><code ref="codeRef" v-html="codeHtml"></code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, nextTick, onMounted, watch, onUpdated } from 'vue'
import { useClipboard, useElementSize } from '@vueuse/core'
import { vOnKeyStroke } from '@vueuse/components'

import vueJs from '@shikijs/langs/vue'
import githubDark from '@shikijs/themes/github-dark'
import { createHighlighterCoreSync, type HighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark-dimmed.min.css'
import { ElMessage } from 'element-plus'

const model = defineModel({ type: String, default: '' })

const props = defineProps({
  lang: {
    type: String,
    required: true
  },
  lineNumbers: {
    type: Boolean,
    default: true
  },
  isEditor: {
    type: Boolean,
    default: false
  },
  file: {
    type: Object as () => FileSystemFileHandle,
    required: false
  }
})

const isVue = computed(() => props.lang === 'vue')

const codeHtml = computed(() => {
  const lang = props.lang
  const str = model.value
  if (lang && hljs.getLanguage(lang)) {
    try {
      return hljs.highlight(lang, str, true).value
    } catch (__) {
      return str
    }
  } else if (lang === 'vue') {
    const shiki: HighlighterCore = createHighlighterCoreSync({
      themes: [githubDark],
      langs: [vueJs],
      engine: createJavaScriptRegexEngine()
    })
    const codeHtml = shiki.codeToHtml(str, {
      lang: props.lang,
      theme: 'github-dark'
    })
    const codeStartIndex = codeHtml.indexOf('<code')
    const codeEndIndex = codeHtml.lastIndexOf('</code>')
    return codeHtml.substring(codeStartIndex + 6, codeEndIndex)
  }

  return str
})

const colorStyle = ref('#e1e4e8')

const borderColorStyle = ref('rgba(225, 228, 232, 0.5)')

const bgColorStyle = ref('#24292e')

const codeLines = computed(() => {
  const lines = model.value.split('\n')
  return lines.map((_, i) => i + 1)
})

const { copy, copied, isSupported } = useClipboard()

const codeBodyRef = ref<HTMLDivElement>()
const { width: codeBodyWidth } = useElementSize(codeBodyRef)
const textareaRef = ref<HTMLTextAreaElement>()
const codeRef = ref<HTMLElement>()
watch(
  () => codeBodyWidth.value,
  () => {
    if (props.isEditor) {
      changeTextareaWidth()
    }
  }
)
onMounted(() => {
  nextTick(() => {
    if (props.isEditor) {
      changeTextareaWidth()
    }
  })
})
onUpdated(() => {
  nextTick(() => {
    if (props.isEditor) {
      changeTextareaWidth()
    }
  })
})
function changeTextareaWidth () {
  textareaRef.value!.style.width = Math.max(codeBodyWidth.value, codeRef.value!.offsetWidth) + 'px'
}

async function onSaveFileFn (event: KeyboardEvent) {
  event.preventDefault()
  if (props.file) {
    const writable = await props.file.createWritable()
    await writable.write(model.value)
    await writable.close()
    ElMessage.success('保存成功')
  }
}
</script>

<style lang="scss">
.code-card {
  position: relative;
  overflow: hidden;
  padding: 1em 0;
  font-size: 14px;
  line-height: 1.5;
  border-radius: 6px;
  font-family: DM Mono,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;

  .code-card-tool {
    position: absolute;
    top: 0;
    right: 0.2em;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: auto;

    .code-lang {
      margin-right: 5px;
    }
  }

  .code-wrap {
    display: flex;
    align-items: stretch;
    .code-line-box {
      flex: 0 0 auto;
      text-align: center;
      border-right-width: 1px;
      border-right-style: solid;
      .code-line {
        padding: 0 1em;
      }
    }

    .code-content {
      flex: 1 1 auto;
      margin: 0 1em;
      overflow: auto;
      word-break: break-word;

      .code-body {
        position: relative;
      }

      .code-input {
        padding: 0;
        margin: 0;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        border: 0;
        outline: none;
        resize: none;
        font-size: 14px;
        line-height: 1.5;
        background-color: transparent;
        color: transparent;
        font-family: DM Mono,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;
        overflow: hidden;
        white-space: nowrap;
        caret-color: rgb(156, 163, 175);
        cursor: text;
      }
    }
  }
  
  pre {
    white-space: pre;
    code {
      font-family: DM Mono,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;
    }
  }

  .hljs {
    color: #e1e4e8;
    background-color: #24292e;
  }
}
.code-card + .code-card {
  margin-top: 1em;
}
</style>
