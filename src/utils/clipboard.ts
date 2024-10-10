import { imgBlobJpgToPng } from './imgTypeChange'

/**
 * 将图片从指定的URL复制到剪贴板
 * 如果图片是JPEG格式，它将被转换为PNG格式
 * @param imageUrl - 要复制的图片的URL
 * @throws {Error} 如果获取图片或写入剪贴板时发生错误
 */
export async function copyImageToClipboard(imageUrl: string) {
  try {
    const response = await fetch(imageUrl)
    let blob = await response.blob()
    if (blob.type === 'image/jpeg') {
      blob = await imgBlobJpgToPng(blob)
    }
    const item = new ClipboardItem({ [blob.type]: blob })
    await navigator.clipboard.write([item])
  } catch (err) {
    console.error(err)
  }
}

/**
 * 从剪贴板获取内容并将其转换为 Blob 对象数组
 * 该函数读取剪贴板中的内容，并将每个内容项转换为一个包含类型和 Blob 的对象
 * 如果读取过程中发生错误，错误将被记录到控制台，但函数不会抛出异常
 * @returns {Promise<{ type: string; blob: Blob }[]>} 一个 Promise，成功时解析为包含剪贴板内容的对象数组
 */
export async function getClipboardContents() {
  try {
    const res: { type: string; blob: Blob }[] = []
    const clipboardItems = await navigator.clipboard.read()
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        const blob = await clipboardItem.getType(type)
        res.push({
          type,
          blob
        })
      }
    }
    return res
  } catch (err) {
    console.error(err)
  }
}
