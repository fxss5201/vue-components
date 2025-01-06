import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import type { Token } from 'markdown-it/index.js'

const md = new MarkdownIt()

const tableStylePlugin = () => {
  md.renderer.rules.table_open = function() {
    return '<table class="my-table">'
  }
  md.renderer.rules.table_close = function() {
    return '</table>'
  }
}

function updateTargetPlugin (arr: Token[]) {
  arr.forEach(token => {
    if (token.children && token.children.length > 0) {
      updateTargetPlugin(token.children)
    } else {
      if (token.type === 'link_open') {
        token.attrs = token.attrs || [];
        token.attrs.push(['target', '_blank']);
        token.attrs.push(['rel', 'noopener noreferrer']);
      }
    }
  })
}

const updatePlugin = () => {
  md.core.ruler.push('update_target', state => {
    updateTargetPlugin(state.tokens)
  })
}

md.use(updatePlugin)
md.use(tableStylePlugin)

export function useMarkdown(content: string) {
  const html = computed(() => {
    return md.render(content)
  })

  return {
    html
  }
}
