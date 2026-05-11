import { useCallback } from 'react'
import { invoke } from '@tauri-apps/api/core'
import styles from '../styles/titlebar.module.css'

interface TitleBarProps {
  currentFile?: string
  onToggleSidebar: () => void
  onToggleTransparency: () => void
  onOpenCommandPalette: () => void
  onOpenSettings: () => void
}

export default function TitleBar({
  currentFile,
  onToggleSidebar,
  onToggleTransparency,
  onOpenCommandPalette,
  onOpenSettings,
}: TitleBarProps) {
  const handleClose = useCallback(() => {
    invoke('close_window').catch(() => {})
  }, [])

  const handleMinimize = useCallback(() => {
    invoke('minimize_window').catch(() => {})
  }, [])

  const handleMaximize = useCallback(() => {
    invoke('toggle_maximize').catch(() => {})
  }, [])

  return (
    <div className={styles.titlebar}>
      <div className={styles.dragOverlay} />

      <div className={styles.dots}>
        <button
          className={`${styles.dot} ${styles.close}`}
          onClick={handleClose}
          title="Close"
          aria-label="Close window"
        />
        <button
          className={`${styles.dot} ${styles.minimize}`}
          onClick={handleMinimize}
          title="Minimize"
          aria-label="Minimize window"
        />
        <button
          className={`${styles.dot} ${styles.maximize}`}
          onClick={handleMaximize}
          title="Maximize"
          aria-label="Maximize window"
        />
      </div>

      <div className={styles.title}>
        {currentFile ? `ink — ${currentFile}` : 'Ink Editor'}
      </div>

      <div className={styles.actions}>
        <button onClick={onToggleSidebar} title="Toggle Sidebar (Ctrl+B)">☰</button>
        <button onClick={onToggleTransparency} title="Toggle Transparency (Ctrl+Shift+T)">◐</button>
        <button onClick={onOpenCommandPalette} title="Command Palette (Ctrl+Shift+P)">⌘</button>
        <button onClick={onOpenSettings} title="Settings">⚙</button>
      </div>
    </div>
  )
}
