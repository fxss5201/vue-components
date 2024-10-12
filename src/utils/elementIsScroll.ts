/**
 * 检查给定的 HTMLElement 是否具有水平或垂直滚动条
 * @param {HTMLElement} element - 要检查的元素
 * @returns {Object} - 一个包含两个布尔值的对象，分别表示元素是否具有水平和垂直滚动条
 */
export function elementIsScroll(element: HTMLElement) {
  const { scrollWidth, clientWidth, scrollHeight, clientHeight } = element
  return {
    x: scrollWidth > clientWidth,
    y: scrollHeight > clientHeight
  }
}

/**
 * 检查给定的 HTMLElement 是否具有水平滚动条
 * @param {HTMLElement} element - 要检查的元素
 * @returns {boolean} - 如果元素具有水平滚动条，则返回 true，否则返回 false
 */
export function elementIsScrollX(element: HTMLElement) {
  const { scrollWidth, clientWidth } = element
  return scrollWidth > clientWidth
}

/**
 * 检查给定的 HTMLElement 是否具有垂直滚动条
 * @param {HTMLElement} element - 要检查的元素
 * @returns {boolean} - 如果元素具有垂直滚动条，则返回 true，否则返回 false
 */
export function elementIsScrollY(element: HTMLElement) {
  const { scrollHeight, clientHeight } = element
  return scrollHeight > clientHeight
}
