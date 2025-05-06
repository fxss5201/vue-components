<template>
  <div v-html="markdown" class="markdown-body" ref="markdownBodyRef"></div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
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

const router = useRouter()
function addAClickFn (e: MouseEvent) {
  const target = e.target as HTMLElement
  if (target.tagName === 'A' && target.classList.contains('anchor-link')) {
    e.preventDefault()
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start' 
    })
  } else if (target.tagName === 'A' && target.classList.contains('site-link')) {
    e.preventDefault()
    const href = target.getAttribute('href')?.slice(1)
    if (href) {
      router.push(href)
    }
  }
}
function addTocAClickFn (e: MouseEvent) {
  const target = e.target as HTMLElement
  if (target.tagName === 'A' && (target as HTMLLinkElement).getAttribute('href')?.startsWith('#')) {
    e.preventDefault()
    e.stopPropagation()
    const href = (target as HTMLLinkElement).getAttribute('href')?.slice(1)
    if (href) {
      const el = document.getElementById(href)
      if (el) {
        el.scrollIntoView({
          behavior:'smooth',
          block:'start'
        })
      }
    }
  }
  
}
const markdownBodyRef = ref<HTMLDivElement>()
onMounted(() => {
  nextTick(() => {
    markdownBodyRef.value?.addEventListener('click', addAClickFn)
    const toc: HTMLDivElement | null = document.querySelector('.table-of-contents')
    if (toc) {
      toc.addEventListener('click', addTocAClickFn)
    }
  }) 
})
onUnmounted(() => {
  markdownBodyRef.value?.removeEventListener('click', addAClickFn) 
  const toc: HTMLDivElement | null = document.querySelector('.table-of-contents')
  if (toc) {
    toc.removeEventListener('click', addTocAClickFn)
  }
})
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
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    padding-right: 14px;
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
  a.blank-link,
  a.site-link {
    color: var(--el-color-primary);
  }
  a.anchor-link {
    &:hover {
      color: var(--el-color-primary);
    }
  }
  h1, h2, h3, h4, h5, h6 {
    &:hover {
      a.anchor-link {
        color: var(--el-color-primary);
      }
    }
  }
  .iconfont::before {
    margin-right: 3px;
  }
}
</style>
