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
