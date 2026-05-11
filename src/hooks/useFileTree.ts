import { useState, useCallback } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { open } from '@tauri-apps/plugin-dialog'
import type { DirEntry } from '../types'

export function useFileTree() {
  const [rootPath, setRootPath] = useState<string>('')
  const [entries, setEntries] = useState<DirEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadDirectory = useCallback(async (path: string) => {
    setLoading(true)
    setError(null)
    try {
      const result: DirEntry[] = await invoke('list_directory', { path })
      setEntries(result)
      setRootPath(path)
    } catch (e) {
      setError(String(e))
      setEntries([])
    } finally {
      setLoading(false)
    }
  }, [])

  const openFolder = useCallback(async () => {
    try {
      const selected = await open({ directory: true, multiple: false })
      if (selected && typeof selected === 'string') {
        await loadDirectory(selected)
      }
    } catch {
      setError('Cannot open folder dialog')
    }
  }, [loadDirectory])

  const refreshTree = useCallback(async () => {
    if (rootPath) await loadDirectory(rootPath)
  }, [rootPath, loadDirectory])

  return { rootPath, entries, loading, error, loadDirectory, openFolder, refreshTree }
}
