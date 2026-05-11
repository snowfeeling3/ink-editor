import { useState, useCallback, useEffect } from 'react'
import { getCurrentWindow } from '@tauri-apps/api/window'
import type { AppSettings, EditorMode } from '../types'

const SETTINGS_KEY = 'ink-editor-settings'

const defaultSettings: AppSettings = {
  transparency: 0.92,
  fontSize: 14,
  showSidebar: true,
  mode: 'wysiwyg',
}

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) }
  } catch { /* corrupted */ }
  return { ...defaultSettings }
}

function saveSettings(settings: AppSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings)

  useEffect(() => { saveSettings(settings) }, [settings])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--app-opacity', String(settings.transparency))
    root.style.setProperty('--app-blur', settings.transparency < 1.0 ? '12px' : '0px')
    getCurrentWindow().setBackgroundColor(
      `rgba(45, 53, 59, ${settings.transparency})`
    ).catch(() => {})
  }, [settings.transparency])

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...patch }))
  }, [])

  const toggleSidebar = useCallback(() => {
    setSettings(prev => ({ ...prev, showSidebar: !prev.showSidebar }))
  }, [])

  const toggleTransparency = useCallback(() => {
    setSettings(prev => {
      const next = prev.transparency >= 0.92 ? 0.75
        : prev.transparency >= 0.75 ? 0.55
        : 0.92
      return { ...prev, transparency: next }
    })
  }, [])

  const setMode = useCallback((mode: EditorMode) => {
    setSettings(prev => ({ ...prev, mode }))
  }, [])

  return { settings, updateSettings, toggleSidebar, toggleTransparency, setMode }
}
