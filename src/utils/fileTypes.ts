// Supported file extensions for the editor
export const SUPPORTED_EXTENSIONS = ['.md', '.txt', '.markdown', '.mdown', '.mkd']

export function isSupportedFile(filename: string): boolean {
  const lower = filename.toLowerCase()
  return SUPPORTED_EXTENSIONS.some(ext => lower.endsWith(ext))
}

export function getFileIcon(filename: string): string {
  const lower = filename.toLowerCase()
  if (lower.endsWith('.md') || lower.endsWith('.markdown') || lower.endsWith('.mdown') || lower.endsWith('.mkd')) {
    return '📝'
  }
  if (lower.endsWith('.txt')) {
    return '📄'
  }
  return '📎'
}

export function getFileName(path: string): string {
  return path.split(/[/\\]/).pop() || path
}
