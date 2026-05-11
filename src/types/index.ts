// Type definitions for Ink Editor

export interface DirEntry {
  name: string
  path: string
  is_dir: boolean
  children: DirEntry[] | null
}

export interface FileTab {
  path: string
  name: string
  content: string
  isModified: boolean
}

export interface AppSettings {
  transparency: number // 0.0 - 1.0
  fontSize: number
  showSidebar: boolean
  mode: 'wysiwyg' | 'source' | 'preview'
}

export interface Command {
  id: string
  label: string
  shortcut?: string
  action: () => void
}

export type EditorMode = 'wysiwyg' | 'source' | 'preview'
