import { computed } from 'vue'
import markdownIt from 'markdown-it'
import type { Options, Renderer, Token } from 'markdown-it/index.js'
// @ts-ignore
import markdownItSub from 'markdown-it-sub'
// @ts-ignore
import markdownItSup from 'markdown-it-sup'
// @ts-ignore
import markdownItFootnote from 'markdown-it-footnote'
// @ts-ignore
import markdownItDeflist from 'markdown-it-deflist'
// @ts-ignore
import markdownItAbbr from 'markdown-it-abbr'
// @ts-ignore
import { full as emoji } from 'markdown-it-emoji'
// @ts-ignore
import markdownItIns from 'markdown-it-ins'
// @ts-ignore
import markdownItMark from 'markdown-it-mark'
// @ts-ignore
import markdownItLinkAttributes from 'markdown-it-link-attributes'

import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark-dimmed.min.css'
import vueJs from '@shikijs/langs/vue'
import githubDark from '@shikijs/themes/github-dark'
import { createHighlighterCoreSync, type HighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import type MarkdownIt from 'markdown-it/index.js'
import useCodeCard from './useCodeCard'

const md: MarkdownIt = new markdownIt({
  html: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(lang, str, true).value}</code></pre>`
      } catch (__) {
        return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
      }
    } else if (lang === 'vue') {
      const shiki: HighlighterCore = createHighlighterCoreSync({
        themes: [githubDark],
        langs: [vueJs],
        engine: createJavaScriptRegexEngine()
      })
      return shiki.codeToHtml(str, { lang: 'vue', theme: 'github-dark' })
    }

    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  }
} as Options)

md.use(markdownItLinkAttributes, {
  attrs: {
    target: "_blank",
    rel: "noopener",
  },
})
md.use(tableStylePlugin)
md.use(codeStylePlugin)
md.use(markdownItSub)
md.use(markdownItSup)
md.use(markdownItFootnote)
md.use(markdownItDeflist)
md.use(markdownItAbbr)
md.use(emoji)
md.use(markdownItIns)
md.use(markdownItMark)

function tableStylePlugin () {
  md.renderer.rules.table_open = function() {
    return '<table class="my-table">'
  }
  md.renderer.rules.table_close = function() {
    return '</table>'
  }
}

function codeStylePlugin () {
  md.renderer.rules.code_block = function(tokens: Token[], idx: number) {
    const token = tokens[idx]
    const code = token.content
    return code
  }
  md.renderer.rules.fence = function(tokens: Token[], idx: number, options: Options, env: any, self: Renderer) {
    const token = tokens[idx]
    const info = token.info ? md.utils.unescapeAll(token.info).trim() : ''
    let langName = ''
    let langAttrs = ''

    if (info) {
      const arr = info.split(/(\s+)/g)
      langName = arr[0]
      langAttrs = arr.slice(2).join('')
    }

    let highlighted
    if (options.highlight) {
      highlighted = options.highlight(token.content, langName, langAttrs) || md.utils.escapeHtml(token.content)
    } else {
      highlighted = md.utils.escapeHtml(token.content)
    }
    return useCodeCard(highlighted, token.content, langName, true)
  }
}

export function useMarkdown(content: string) {
  const html = computed(() => {
    return md.render(content)
  })

  return {
    html
  }
}
