export interface FileNode {
  key: string
  parentKey: string
  label: string
  leaf: boolean
  fileIcon: string | undefined
  folderIcon: string | undefined
  openFolderIcon: string | undefined
  file?: FileSystemDirectoryHandle | FileSystemFileHandle
  fileContent?: string
  scroll?: {
    left?: number
    top?: number
  }
  imgListFileNode?: FileNode[]
  editStatus?: boolean
  children?: FileNode[]
  closePreview?: boolean
}

export interface FileAddForm {
  name: string
  type: string
  fileType?: string
}
