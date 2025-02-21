<template>
  <div v-html="markdown" class="markdown-body"></div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useMarkdown } from '@/composables/useMarkdown'
import { useCodeCopy } from '@/composables/useCodeCopy'

const props = withDefaults(
  defineProps<{
    content?: string
  }>(),
  {
    content: '# 欢迎使用 Markdown Card'
  }
)

const markdown = ref('')
function addToc (val: string) {
  return val.includes('[toc]') ? val : `[toc]\n${val}`
}
markdown.value = useMarkdown(addToc(props.content)).html.value

watch(
  () => props.content,
  () => {
    markdown.value = useMarkdown(addToc(props.content)).html.value
  },
  {
    immediate: true
  }
)

useCodeCopy()
</script>

<style lang="scss">
.markdown-body {
  pre + pre {
    margin-top: 1em;
  }

  .table-of-contents {
    position: fixed;
    right: 24px;
    z-index: 1000;
    background-color: #fff;
    a {
      &:hover {
        color: var(--el-color-primary);
      }
    }
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
  a.blank-link {
    color: var(--el-color-primary);
  }
  a.cur-link {
    &:hover {
      color: var(--el-color-primary);
    }
  }
  h1, h2, h3, h4, h5, h6 {
    &:hover {
      a.cur-link {
        color: var(--el-color-primary);
      }
    }
  }
  .iconfont::before {
    margin-right: 3px;
  }
}
</style>
