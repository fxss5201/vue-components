<template>
  <div v-html="markdown"></div>
</template>

<script lang="ts" setup>
import { useMarkdown } from '@/composables/useMarkdown'

const props = withDefaults(
  defineProps<{
    content?: string
  }>(),
  {
    content: '# 欢迎使用 Markdown Card'
  }
)

const { html: markdown } = useMarkdown(props.content)
</script>

<style lang="scss">
pre {
  margin: 10px 0;
  overflow-x: auto;
  scrollbar-width: thin;
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
</style>
