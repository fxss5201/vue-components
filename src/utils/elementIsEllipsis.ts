import { getLayoutPadding } from "./getLayout"

/**
 * 检查指定的 HTMLElement 是否需要省略号来显示其内容。
 * 如果元素的内容超出了其容器的宽度或高度，或者如果元素的滚动宽度大于其可见宽度，则返回 true，否则返回 false。
 *
 * @param {HTMLElement} element - 要检查的 HTMLElement。
 * @returns {boolean} 如果需要省略号则返回 true，否则返回 false。
 */
export function elementIsEllipsis(element: HTMLElement): boolean {
  const range = document.createRange()
  range.setStart(element, 0)
  range.setEnd(element, element.childNodes.length)
  let { width: rangeWidth, height: rangeHeight } = range.getBoundingClientRect()
  const offsetWidth = rangeWidth - Math.floor(rangeWidth)
  if (offsetWidth < 0.001) {
    rangeWidth = Math.floor(rangeWidth)
  }
  const offsetHeight = rangeHeight - Math.floor(rangeHeight)
  if (offsetHeight < 0.001) {
    rangeHeight = Math.floor(rangeHeight)
  }
  const { width: elementWidth, height: elementHeight } = element.getBoundingClientRect()
  const { top, left, right, bottom } = getLayoutPadding(element)
  const horizontalPadding = left + right
  const verticalPadding = top + bottom
  if (
    rangeWidth + horizontalPadding > elementWidth ||
    rangeHeight + verticalPadding > elementHeight ||
    element.scrollWidth > elementWidth
  ) {
    return true
  } else {
    return false
  }
}

