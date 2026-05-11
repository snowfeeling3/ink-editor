import { useState } from 'react'
import type { DirEntry } from '../types'
import styles from '../styles/sidebar.module.css'

interface SidebarProps {
  isOpen: boolean
  rootPath: string
  entries: DirEntry[]
  loading: boolean
  error: string | null
  activeFilePath?: string
  onOpenFile: (path: string) => void
  onOpenFolder: () => void
}

export default function Sidebar({
  isOpen,
  rootPath,
  entries,
  loading,
  error,
  activeFilePath,
  onOpenFile,
  onOpenFolder,
}: SidebarProps) {
  if (!isOpen) return null

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>
          {rootPath || 'Explorer'}
        </span>
        <div className={styles.headerActions}>
          <button onClick={onOpenFolder} title="Open Folder">
            +
          </button>
        </div>
      </div>

      <div className={styles.tree}>
        {loading && (
          <div className={styles.entry} style={{ color: 'var(--fg1)' }}>
            Loading...
          </div>
        )}
        {error && (
          <div className={styles.entry} style={{ color: 'var(--red)' }}>
            {error}
          </div>
        )}
        {!loading && !error && entries.length === 0 && (
          <div className={styles.entry} style={{ color: 'var(--fg1)', fontStyle: 'italic' }}>
            No files found. Click + to open a folder.
          </div>
        )}
        {entries.map(entry => (
          <TreeEntry
            key={entry.path}
            entry={entry}
            depth={0}
            activeFilePath={activeFilePath}
            onOpenFile={onOpenFile}
          />
        ))}
      </div>
    </div>
  )
}

interface TreeEntryProps {
  entry: DirEntry
  depth: number
  activeFilePath?: string
  onOpenFile: (path: string) => void
}

function TreeEntry({ entry, depth, activeFilePath, onOpenFile }: TreeEntryProps) {
  const [expanded, setExpanded] = useState(false)

  if (entry.is_dir) {
    const hasChildren = entry.children && entry.children.length > 0
    return (
      <div>
        <div
          className={styles.entry}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
          onClick={() => setExpanded(!expanded)}
        >
          <span className={`${styles.arrow} ${expanded ? styles.arrowOpen : ''}`}>
            ▶
          </span>
          <span className={styles.icon}>
            {expanded ? '📂' : '📁'}
          </span>
          <span className={styles.name}>{entry.name}</span>
        </div>
        {expanded && hasChildren && (
          <div className={styles.children}>
            {entry.children!.map(child => (
              <TreeEntry
                key={child.path}
                entry={child}
                depth={depth + 1}
                activeFilePath={activeFilePath}
                onOpenFile={onOpenFile}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // File entry
  const isActive = activeFilePath === entry.path
  return (
    <div
      className={`${styles.entry} ${isActive ? styles.entryActive : ''}`}
      style={{ paddingLeft: `${12 + depth * 16}px` }}
      onClick={() => onOpenFile(entry.path)}
    >
      <span className={styles.icon} style={{ marginLeft: '14px' }}>
        📝
      </span>
      <span className={styles.name}>{entry.name}</span>
    </div>
  )
}
