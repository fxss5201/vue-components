<template>
  <div ref="editorRef" :style="{ width: props.width, height: props.height }" v-on-key-stroke:c,s="onSaveFileFn"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { vOnKeyStroke } from '@vueuse/components'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    return new editorWorker()
  }
}

export type Theme = 'vs' | 'hc-black' | 'vs-dark'
export type FoldingStrategy = 'auto' | 'indentation'
export type RenderLineHighlight = 'all' | 'line' | 'none' | 'gutter'
export interface Options {
  automaticLayout?: boolean 
  foldingStrategy?: FoldingStrategy 
  renderLineHighlight?: RenderLineHighlight 
  selectOnLineNumbers?: boolean 
  minimap?: {
    enabled?: boolean
  }
  readOnly?: boolean 
  fontSize?: number 
  scrollBeyondLastLine?: boolean 
  overviewRulerBorder?: boolean 
}

const model = defineModel({ type: String, default: '' })
const props = withDefaults(
  defineProps<{
    width?: string
    height?: string
    language?: string
    theme?: Theme
    options?: Options
  }>(),
  {
    width: '100%',
    height: '100%',
    language: 'javascript',
    theme: 'vs-dark',
    options: () => {
      return {
        automaticLayout: true,
        foldingStrategy: 'auto',
        renderLineHighlight: 'all',
        selectOnLineNumbers: true,
        minimap: {
          enabled: true,
        },
        readOnly: false,
        fontSize: 14,
        scrollBeyondLastLine: false,
        overviewRulerBorder: false
      }
    }
  }
)

const emit = defineEmits<{
  editorMounted: [editor: monaco.editor.IStandaloneCodeEditor]
  change: [value: string]
  save: []
}>()

const editorRef = ref<HTMLElement>()
let codeEditor = shallowRef<monaco.editor.IStandaloneCodeEditor>()

onMounted(() => {
  // validation settings
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false,
  })

  // compiler options
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2015,
    allowNonTsExtensions: true,
  })

  codeEditor.value = monaco.editor.create(editorRef.value!, {
    ...props.options,
    value: model.value,
    language: props.language,
    theme: props.theme
  })
  codeEditor.value.onDidChangeModelContent(() => {
    model.value = codeEditor.value?.getValue() || ''
    emit('change', model.value)
  })

  emit('editorMounted', codeEditor.value)
})

onUnmounted(() => {
  codeEditor.value?.dispose() 
})

// watch(
//   () => model.value,
//   (newValue) => {
//     const value = codeEditor.value?.getValue()
//     if (!value) {
//       codeEditor.value?.setValue(newValue)
//     }
//   }
// )

watch(
  () => props.language,
  (newValue) => {
    monaco.editor.setModelLanguage(
      codeEditor.value?.getModel()!,
      newValue
    )
  }
)

watch(
  () => props.theme,
  (newValue) => {
    monaco.editor.setTheme(newValue)
  }
)

watch(
  () => props.options,
  (newValue) => {
    codeEditor.value?.updateOptions(newValue)
  },
  {
    deep: true
  }
)

useResizeObserver(editorRef, (entries) => {
  const entry = entries[0]
  const { width, height } = entry.contentRect
  codeEditor.value?.layout({
    width,
    height 
  })
})

const onSaveFileFn = (e: KeyboardEvent) => {
  e.preventDefault()
  emit('save')
}
</script>

<style lang="scss" scoped>
</style>
