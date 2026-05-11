import type { EditorMode } from '../types'
import styles from '../styles/statusbar.module.css'

interface StatusBarProps {
  filePath?: string
  wordCount: number
  lineCount: number
  mode: EditorMode
  transparency: number
  onToggleTransparency: () => void
  onToggleMode: () => void
}

export default function StatusBar({
  filePath,
  wordCount,
  lineCount,
  mode,
  transparency,
  onToggleTransparency,
  onToggleMode,
}: StatusBarProps) {
  const modeLabel = {
    wysiwyg: 'WYSIWYG',
    source: 'SOURCE',
    preview: 'PREVIEW',
  }[mode]

  const modeClass = {
    wysiwyg: styles.modeWysiwyg,
    source: styles.modeSource,
    preview: styles.modePreview,
  }[mode]

  const opacityPercent = Math.round(transparency * 100)

  return (
    <div className={styles.statusbar}>
      <div className={styles.item}>
        {filePath || 'No file open'}
      </div>
      <div className={styles.spacer} />
      <div className={styles.item}>
        {lineCount} lines, {wordCount} words
      </div>
      <div className={styles.item}>
        <span
          className={`${styles.modeIndicator} ${modeClass}`}
          onClick={onToggleMode}
          title="Click to change mode (Ctrl+E)"
        >
          {modeLabel}
        </span>
      </div>
      <div
        className={`${styles.item} ${styles.transparency}`}
        onClick={onToggleTransparency}
        title="Click to change transparency (Ctrl+Shift+T)"
      >
        ◐ {opacityPercent}%
      </div>
    </div>
  )
}
