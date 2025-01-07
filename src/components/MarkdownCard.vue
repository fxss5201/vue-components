<template>
  <div v-html="markdown" class="markdown-body"></div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useMarkdown } from '@/composables/useMarkdown'

const props = withDefaults(
  defineProps<{
    content?: string
  }>(),
  {
    content: '# 欢迎使用 Markdown Card'
  }
)

const markdown = ref('')
markdown.value = useMarkdown(props.content).html.value

watch(
  () => props.content,
  () => {
    markdown.value = useMarkdown(props.content).html.value
  },
  {
    immediate: true
  }
)
</script>

<style lang="scss">

.markdown-body {
  pre {
    margin: 10px 0;
    overflow-x: auto;
    scrollbar-width: thin;
  }
  :not(pre) > code {
    word-break: break-word;
    border-radius: 2px;
    overflow-x: auto;
    background-color: #fff5f5;
    color: #ff502c;
    font-size: .87em;
    padding: .065em .4em;
  }
  .my-table {
    width: 100%;
    border-top: 1px solid var(--el-menu-border-color);
    border-left: 1px solid var(--el-menu-border-color);
    border-collapse: collapse;
    margin: 12px 0;
    td, th {
      text-align: center;
      border-bottom: 1px solid var(--el-menu-border-color);
      border-right: 1px solid var(--el-menu-border-color);
      padding: 6px 8px;
    }
  }
  a {
    color: var(--el-color-primary);
  }
}
</style>
