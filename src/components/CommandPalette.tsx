import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import type { Command } from '../types'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  commands: Command[]
}

export default function CommandPalette({ isOpen, onClose, commands }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    if (!query.trim()) return commands
    const lower = query.toLowerCase()
    return commands.filter(
      c =>
        c.label.toLowerCase().includes(lower) ||
        c.id.toLowerCase().includes(lower)
    )
  }, [query, commands])

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [isOpen])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, filtered.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action()
          onClose()
        }
      }
    },
    [filtered, selectedIndex, onClose]
  )

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '15vh',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: '520px',
          maxHeight: '400px',
          background: 'var(--bg1)',
          border: '1px solid var(--grey0)',
          borderRadius: '8px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--grey0)' }}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              color: 'var(--fg)',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
          {filtered.length === 0 && (
            <div style={{ padding: '16px', textAlign: 'center', color: 'var(--fg1)', fontSize: '13px' }}>
              No commands found
            </div>
          )}
          {filtered.map((cmd, i) => (
            <div
              key={cmd.id}
              onClick={() => {
                cmd.action()
                onClose()
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 16px',
                cursor: 'pointer',
                background: i === selectedIndex ? 'var(--bg2)' : 'transparent',
                color: i === selectedIndex ? 'var(--fg)' : 'var(--fg1)',
                fontSize: '13px',
              }}
            >
              <span>{cmd.label}</span>
              {cmd.shortcut && (
                <kbd
                  style={{
                    background: 'var(--bg0)',
                    padding: '1px 6px',
                    borderRadius: '3px',
                    border: '1px solid var(--grey0)',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {cmd.shortcut}
                </kbd>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
