import { useState, useCallback } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { save } from '@tauri-apps/plugin-dialog'
import type { FileTab } from '../types'
import { getFileName } from '../utils/fileTypes'

export function useEditor() {
  const [tabs, setTabs] = useState<FileTab[]>([])
  const [activeTabIndex, setActiveTabIndex] = useState<number>(-1)
  const [editorContent, setEditorContent] = useState<string>('')

  const activeTab = activeTabIndex >= 0 ? tabs[activeTabIndex] : null

  const openFile = useCallback(async (path: string) => {
    const existingIndex = tabs.findIndex(t => t.path === path)
    if (existingIndex >= 0) {
      setActiveTabIndex(existingIndex)
      setEditorContent(tabs[existingIndex].content)
      return
    }

    try {
      const content: string = await invoke('read_file', { path })
      const newTab: FileTab = { path, name: getFileName(path), content, isModified: false }
      const nextIndex = tabs.length
      setTabs(prev => [...prev, newTab])
      setActiveTabIndex(nextIndex)
      setEditorContent(content)
    } catch (e) {
      console.error('Failed to open file:', e)
    }
  }, [tabs])

  const saveFile = useCallback(async () => {
    if (!activeTab) return
    try {
      await invoke('write_file', { path: activeTab.path, content: editorContent })
      setTabs(prev =>
        prev.map(t =>
          t.path === activeTab.path ? { ...t, content: editorContent, isModified: false } : t
        )
      )
    } catch (e) {
      console.error('Failed to save file:', e)
    }
  }, [activeTab, editorContent])

  const saveFileAs = useCallback(async () => {
    try {
      const filePath = await save({
        filters: [{ name: 'Markdown', extensions: ['md', 'markdown', 'txt'] }],
      })
      if (filePath && typeof filePath === 'string') {
        await invoke('write_file', { path: filePath, content: editorContent })
        const newTab: FileTab = { path: filePath, name: getFileName(filePath), content: editorContent, isModified: false }
        const nextIndex = tabs.length
        setTabs(prev => [...prev, newTab])
        setActiveTabIndex(nextIndex)
      }
    } catch (e) {
      console.error('Failed to save as:', e)
    }
  }, [editorContent, tabs.length])

  const closeFile = useCallback((index: number) => {
    const filtered = tabs.filter((_, i) => i !== index)
    setTabs(filtered)
    if (activeTabIndex === index) {
      const newIndex = Math.min(index, filtered.length - 1)
      setActiveTabIndex(newIndex)
      setEditorContent(newIndex >= 0 ? filtered[newIndex].content : '')
    } else if (activeTabIndex > index) {
      setActiveTabIndex(prev => prev - 1)
    }
  }, [activeTabIndex, tabs])

  const updateContent = useCallback((content: string) => {
    setEditorContent(content)
    if (activeTab) {
      setTabs(prev =>
        prev.map(t =>
          t.path === activeTab.path ? { ...t, isModified: content !== t.content } : t
        )
      )
    }
  }, [activeTab])

  return {
    tabs, activeTabIndex, activeTab, editorContent,
    openFile, saveFile, saveFileAs, closeFile, updateContent,
    setActiveTabIndex, setEditorContent,
  }
}
