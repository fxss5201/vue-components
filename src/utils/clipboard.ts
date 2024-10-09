import { imgBlobJpgToPng } from './imgTypeChange'

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
