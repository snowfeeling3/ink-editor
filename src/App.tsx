import { useState, useCallback, useMemo } from 'react'
import { getCurrentWindow } from '@tauri-apps/api/window'
import TitleBar from './components/TitleBar'
import Sidebar from './components/Sidebar'
import Editor, { EmptyEditor } from './components/Editor'
import StatusBar from './components/StatusBar'
import CommandPalette from './components/CommandPalette'
import SettingsPanel from './components/SettingsPanel'
import { useSettings } from './hooks/useSettings'
import { useFileTree } from './hooks/useFileTree'
import { useEditor } from './hooks/useEditor'
import { useKeyboard } from './hooks/useKeyboard'
import type { Command } from './types'
import styles from './App.module.css'

export default function App() {
  const {
    settings,
    updateSettings,
    toggleSidebar,
    toggleTransparency,
    setMode,
  } = useSettings()

  const {
    rootPath,
    entries,
    loading: fileTreeLoading,
    error: fileTreeError,
    openFolder,
    openSingleFile,
  } = useFileTree()

  const {
    activeTabIndex,
    activeTab,
    editorContent,
    openFile,
    saveFile,
    saveFileAs,
    closeFile,
    updateContent,
  } = useEditor()

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const wordCount = useMemo(() => {
    if (!editorContent) return 0
    return editorContent.trim().split(/\s+/).filter(Boolean).length
  }, [editorContent])

  const lineCount = useMemo(() => {
    if (!editorContent) return 0
    return editorContent.split('\n').length
  }, [editorContent])

  const toggleMode = useCallback(() => {
    const next = settings.mode === 'wysiwyg' ? 'source' : settings.mode === 'source' ? 'preview' : 'wysiwyg'
    setMode(next)
  }, [settings.mode, setMode])

  const handleOpenSingleFile = useCallback(() => {
    openSingleFile(openFile)
  }, [openSingleFile, openFile])

  const commands: Command[] = useMemo(() => [
    { id: 'open-folder', label: 'Open Folder', shortcut: 'Ctrl+O', action: openFolder },
    { id: 'open-file', label: 'Open File', shortcut: 'Ctrl+Shift+O', action: handleOpenSingleFile },
    { id: 'save-file', label: 'Save File', shortcut: 'Ctrl+S', action: saveFile },
    { id: 'save-as', label: 'Save As...', shortcut: 'Ctrl+Shift+S', action: saveFileAs },
    { id: 'toggle-sidebar', label: 'Toggle Sidebar', shortcut: 'Ctrl+B', action: toggleSidebar },
    { id: 'toggle-transparency', label: 'Toggle Transparency', shortcut: 'Ctrl+Shift+T', action: toggleTransparency },
    { id: 'toggle-mode', label: 'Toggle Editor Mode', shortcut: 'Ctrl+E', action: toggleMode },
    { id: 'close-file', label: 'Close File', shortcut: 'Ctrl+W', action: () => activeTabIndex >= 0 && closeFile(activeTabIndex) },
    { id: 'settings', label: 'Open Settings', action: () => setSettingsOpen(true) },
  ], [openFolder, handleOpenSingleFile, saveFile, saveFileAs, toggleSidebar, toggleTransparency, toggleMode, closeFile, activeTabIndex])

  const handleFullscreen = useCallback(async () => {
    const win = getCurrentWindow()
    const isFullscreen = await win.isFullscreen()
    if (isFullscreen) {
      await win.setFullscreen(false)
    } else {
      await win.setFullscreen(true)
    }
  }, [])

  useKeyboard([
    { key: 'o', ctrl: true, handler: openFolder },
    { key: 'o', ctrl: true, shift: true, handler: handleOpenSingleFile },
    { key: 's', ctrl: true, handler: saveFile },
    { key: 's', ctrl: true, shift: true, handler: saveFileAs },
    { key: 'b', ctrl: true, handler: toggleSidebar },
    { key: 't', ctrl: true, shift: true, handler: toggleTransparency },
    { key: 'p', ctrl: true, shift: true, handler: () => setCommandPaletteOpen(true) },
    { key: 'e', ctrl: true, handler: toggleMode },
    { key: 'w', ctrl: true, handler: () => activeTabIndex >= 0 && closeFile(activeTabIndex) },
    { key: 'F11', handler: handleFullscreen },
  ])

  return (
    <div className={styles.app}>
      <TitleBar
        currentFile={activeTab?.name}
        onToggleSidebar={toggleSidebar}
        onToggleTransparency={toggleTransparency}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <div className={styles.main}>
        <Sidebar
          isOpen={settings.showSidebar}
          rootPath={rootPath}
          entries={entries}
          loading={fileTreeLoading}
          error={fileTreeError}
          activeFilePath={activeTab?.path}
          onOpenFile={openFile}
          onOpenFolder={openFolder}
          onOpenSingleFile={handleOpenSingleFile}
        />

        {activeTab ? (
          <Editor
            content={editorContent}
            onChange={updateContent}
            mode={settings.mode}
            fontSize={settings.fontSize}
          />
        ) : (
          <EmptyEditor
            onOpenFolder={openFolder}
            onOpenFile={handleOpenSingleFile}
          />
        )}
      </div>

      <StatusBar
        filePath={activeTab?.path}
        wordCount={wordCount}
        lineCount={lineCount}
        mode={settings.mode}
        transparency={settings.transparency}
        onToggleTransparency={toggleTransparency}
        onToggleMode={toggleMode}
      />

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        commands={commands}
      />

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
      />
    </div>
  )
}
