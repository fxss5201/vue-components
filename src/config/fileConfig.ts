export const imgFileTypeList = ['jpg', 'png', 'gif', 'jpeg', 'webp', 'svg', 'ico']
export const mdFileTypeList = ['md']
export const codeFileTypeList = ['js', 'cjs', 'mjs', 'ts', 'css', 'scss', 'less', 'sass', 'html', 'vue', 'tsx', 'jsx', 'json',
  'xml', 'java', 'py', 'c', 'cpp', 'go', 'php', 'sql', 'yaml', 'yml', 'lock', 'gitignore', 'eslintignore', 'editorconfig',
  'babelrc', 'sample', 'key', 'exclude', 'dev', 'main', 'LICENSE', 'npmignore', 'txt']
export const officeFileTypeList = ['docx', 'xlsx', 'pdf', 'pptx', 'xls']
export const videoFileTypeList = ['mp4', 'webm', 'ogg', 'flv', 'mp3']

export const havePreviewFileTypeList = ['md', 'json']

export const needClickLoadDirectory = ['node_modules', '.git', '.github', '.vscode']

export const monacoEditorSupportLanguages = ['abap', 'apex', 'azcli', 'bat', 'bicep', 'cameligo', 'clojure', 'coffee', 'cpp', 'csharp',
  'csp', 'css', 'cypher', 'dart', 'dockerfile', 'ecl', 'elixir', 'flow9', 'freemarker2', 'fsharp', 'go', 'graphql', 'handlebars', 'hcl',
  'html', 'ini', 'java', 'javascript', 'julia', 'kotlin', 'less', 'lexon', 'liquid', 'lua', 'm3', 'markdown', 'mdx', 'mips', 'msdax',
  'mysql', 'objective-c', 'pascal', 'pascaligo', 'perl', 'pgsql', 'php', 'pla', 'postiats', 'powerquery', 'powershell', 'protobuf', 'pug',
  'python', 'qsharp', 'r', 'razor', 'redis', 'redshift', 'restructuredtext', 'ruby', 'rust', 'sb', 'scala', 'scheme', 'scss', 'shell', 'solidity',
  'sophia', 'sparql', 'sql', 'st', 'swift', 'systemverilog', 'tcl', 'test', 'twig', 'typescript', 'typespec', 'vb', 'wgsl', 'xml', 'yaml',
  'json']

export type monacoEditorSupportLanguagesMapType = {
  [key: string]: string 
}
export const monacoEditorSupportLanguagesMap: monacoEditorSupportLanguagesMapType = {
  js: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  json: 'json',
  md: 'markdown'
}