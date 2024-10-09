export async function imgBlobJpgToPng(blob: Blob) {
  const url = URL.createObjectURL(blob)
  return new Promise<Blob>((resolve, reject) => {
    const img = document.createElement('img')
    img.src = url
    img.onload = () => {
      URL.revokeObjectURL(url)
      const width = img.naturalWidth
      const height = img.naturalHeight
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d')?.drawImage(img, 0, 0)
      canvas.toBlob(
        (newBlob) => {
          resolve(newBlob as Blob)
        },
        'image/png',
        1
      )
    }
  })
}
