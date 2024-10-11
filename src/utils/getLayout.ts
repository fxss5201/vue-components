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