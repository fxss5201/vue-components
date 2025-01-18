export interface FileNode {
  key: string
  parentKey: string
  label: string
  leaf: boolean
  fileIcon: string | undefined
  folderIcon: string | undefined
  openFolderIcon: string | undefined
  file?: FileSystemDirectoryHandle | FileSystemFileHandle
  children?: FileNode[]
}

export interface FileAddForm {
  name: string
  type: string
  fileType?: string
}
