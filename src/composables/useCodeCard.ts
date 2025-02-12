import generateHash from '@/utils/generateHash'

const colorStyle = '#e1e4e8'
const borderColorStyle = 'rgba(225, 228, 232, 0.5)'
const bgColorStyle = '#24292e'

function lineNumbersCode(preCode: string) {
  const lines = preCode.split('\n')
  const lineNumbers = lines.map((_, i) => i + 1)
  let html = `<div class="code-line-box" style="color: ${colorStyle};border-right-color: ${borderColorStyle}">`
  lineNumbers.forEach(item => {
    html += `<div class="code-line">${item}</div>`
  })
  html += '</div>'
  return html
}

export default function useCodeCard(codeHtml: string, preCode: string, lang: string = '', lineNumbers: boolean = true) {
  const id = generateHash(preCode)

  let langHtml = ''
  if (lang) {
    langHtml = `<div class="code-lang">${lang}</div>`
  }

  const html = `<div class="code-card" style="background-color: ${bgColorStyle}">
  <div class="code-card-tool" style="color: ${colorStyle}">
    ${langHtml}
    <svg style="display: none;" aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16">
      <path fill="currentColor" d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
    </svg>
    <svg class="copy-btn" data-clipboard-target="#${id}"
      aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" style="cursor: pointer;">
      <path fill="currentColor" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path>
      <path fill="currentColor" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
    </svg>
  </div>
  <div class="code-wrap">
    ${lineNumbers ? lineNumbersCode(preCode) : ''}
    <div class="code-content">
      <div class="code-body">
        <textarea style="position: absolute;z-index: -1;top: -9999999px;left: -9999999px;" id="${id}">${preCode}</textarea>
        <div class="code-text">${codeHtml}</div>
      </div>
    </div>
  </div>
</div>`

  return html
}