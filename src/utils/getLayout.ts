/**
 * 获取元素的内边距（padding）
 * @param {HTMLElement} el - 要获取内边距的元素
 * @returns {Object} - 包含元素四个方向内边距的对象
 * @property {number} left - 左边内边距
 * @property {number} right - 右边内边距
 * @property {number} top - 顶部内边距
 * @property {number} bottom - 底部内边距
 */
export function getLayoutPadding (el: HTMLElement) {
  const style = window.getComputedStyle(el, null)
  const paddingLeft = Number.parseInt(style.paddingLeft, 10) || 0
  const paddingRight = Number.parseInt(style.paddingRight, 10) || 0
  const paddingTop = Number.parseInt(style.paddingTop, 10) || 0
  const paddingBottom = Number.parseInt(style.paddingBottom, 10) || 0
  return {
    left: paddingLeft,
    right: paddingRight,
    top: paddingTop,
    bottom: paddingBottom,
  }
}

/**
 * 获取浏览器滚动条的宽度
 * @returns {number} 滚动条的宽度（像素）
 */
export function getScrollbarWidth () {
  // 创建一个临时的div元素
  const div = document.createElement('div')
  // 设置div的样式，使其具有滚动条
  div.style.overflowY = 'scroll'
  div.style.width = '50px'
  div.style.height = '50px'
  // 设置div的位置，使其不可见
  div.style.position = 'absolute'
  div.style.top = '-9999px'
  // 将div添加到文档中
  document.body.appendChild(div)
  // 获取div的滚动条宽度
  const scrollbarWidth = div.offsetWidth - div.clientWidth
  // 移除div
  document.body.removeChild(div)
  // 返回滚动条宽度
  return scrollbarWidth
}