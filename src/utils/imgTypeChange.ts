/**
 * 将 JPG 格式的 Blob 转换为 PNG 格式的 Blob
 * @param jpgBlob - 要转换的 JPG 格式的 Blob
 * @returns 一个 Promise，成功时解析为转换后的 PNG 格式的 Blob
 * @throws 如果在转换过程中发生错误，则抛出错误
 */
export async function imgBlobJpgToPng(jpgBlob: Blob): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    const url = URL.createObjectURL(jpgBlob)
    const img = document.createElement('img')
    img.onload = () => {
      URL.revokeObjectURL(url)
      const width = img.naturalWidth ?? img.width
      const height = img.naturalHeight ?? img.height
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d')?.drawImage(img, 0, 0)
      canvas.toBlob(
        (pngBlob) => {
          if (pngBlob) {
            resolve(pngBlob)
          } else {
            reject(new Error('Failed to create PNG blob'))
          }
        },
        'image/png',
        1
      )
    }
    img.onerror = (error) => {
      reject(error)
    }
    img.src = url
  })
}
