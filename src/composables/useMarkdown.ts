import { computed } from 'vue'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

const tableStylePlugin = () => {
  md.renderer.rules.table_open = function() {
    return '<table class="my-table">'
  }
  md.renderer.rules.table_close = function() {
    return '</table>'
  }
}

md.use(tableStylePlugin)

export function useMarkdown(content: string) {
  const html = computed(() => {
    return md.render(content)
  })

  return {
    html
  }
}
