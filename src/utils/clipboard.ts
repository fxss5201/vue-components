export async function copyImageToClipboard(imageUrl: string, mime: string = 'image/png') {
  try {
    if (ClipboardItem.supports(mime)) {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const item = new ClipboardItem({ [blob.type]: blob })
      await navigator.clipboard.write([item])
    } else {
      console.log(`${mime} are not supported by the clipboard.`)
    }
  } catch (err) {
    console.error(err)
  }
}

export async function getClipboardContents() {
  try {
    const res: { type: string, blob: Blob }[] = []
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
