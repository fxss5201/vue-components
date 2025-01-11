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
          <textarea v-if="props.isEditor" ref="textareaRef" class="code-input" v-model="model" spellcheck="false"></textarea>
          <div class="code-text" v-html="codeHtml"
            :style="{ paddingBottom: props.isEditor ? '21px' : 0 }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'
import { useClipboard, useElementSize } from '@vueuse/core'

import vueJs from '@shikijs/langs/vue'
import githubDark from '@shikijs/themes/github-dark'
import { createHighlighterCoreSync, type HighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark-dimmed.min.css'

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
  }
})

const codeHtml = computed(() => {
  const lang = props.lang
  const str = model.value
  if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
               hljs.highlight(lang, str, true).value +
               '</code></pre>'
      } catch (__) {
        return '<pre class="hljs"><code>' + str + '</code></pre>'
      }
    } else if (lang === 'vue') {
      const shiki: HighlighterCore = createHighlighterCoreSync({
        themes: [githubDark],
        langs: [vueJs],
        engine: createJavaScriptRegexEngine()
      })
      return shiki.codeToHtml(str, {
        lang: props.lang,
        theme: 'github-dark'
      })
    }

    return '<pre class="hljs"><code>' + str + '</code></pre>'
})

const colorStyle = ref('#e1e4e8')

const borderColorStyle = ref('rgba(225, 228, 232, 0.5)')

const bgColorStyle = ref('#24292e')

const codeLines = computed(() => {
  const lines = model.value.split('\n')
  return [...new Array(lines.length)].map((_, index) => index + 1)
})

const { copy, copied, isSupported } = useClipboard()

const codeBodyRef = ref<HTMLDivElement>()
const { width: codeBodyWidth } = useElementSize(codeBodyRef)
const textareaRef = ref<HTMLTextAreaElement>()
let codeElement = ref<HTMLElement | null>(null)
const codeElementWidth = ref(0)
// const resizeObserver = new ResizeObserver((entries) => {
//   console.log('ResizeObserver callback:', entries)
//   for (const entry of entries) {
//     const codeElementWidth = (entry.target as HTMLElement).offsetWidth
//     console.log('codeElementWidth:', codeElementWidth)
//     textareaRef.value!.style.width = Math.max(codeBodyWidth.value, codeElementWidth) + 'px'
//   }
// })
watch(
  () => codeBodyWidth.value,
  () => {
    if (props.isEditor) {
      textareaRef.value!.style.width = Math.max(codeBodyWidth.value, codeElementWidth.value) + 'px'
    }
  }
)
watch(
  () => codeElementWidth.value,
  () => {
    if (props.isEditor) {
      textareaRef.value!.style.width = Math.max(codeBodyWidth.value, codeElementWidth.value) + 'px'
    }
  }
)
onMounted(() => {
  nextTick(() => {
    if (props.isEditor) {
      codeElement.value = codeBodyRef.value!.querySelector('code')
      codeElementWidth.value = useElementSize(codeElement).width.value
      // resizeObserver!.observe(codeElement.value! as HTMLElement)
    }
  })
})
// onBeforeUnmount(() => {
//   if (props.isEditor) {
//     resizeObserver!.unobserve(codeElement.value! as HTMLElement)
//   }
// })
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
