import type { AppSettings } from '../types'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  settings: AppSettings
  onUpdateSettings: (patch: Partial<AppSettings>) => void
}

export default function SettingsPanel({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}: SettingsPanelProps) {
  if (!isOpen) return null

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: '420px',
          background: 'var(--bg1)',
          border: '1px solid var(--grey0)',
          borderRadius: '8px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
          padding: '24px',
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--fg)' }}>Settings</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--fg1)',
              cursor: 'pointer',
              fontSize: '18px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            ✕
          </button>
        </div>

        {/* Transparency */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: 'var(--fg1)' }}>
            <span>Transparency</span>
            <span>{Math.round(settings.transparency * 100)}%</span>
          </label>
          <input
            type="range"
            min="50"
            max="100"
            value={Math.round(settings.transparency * 100)}
            onChange={e => {
              onUpdateSettings({ transparency: Number(e.target.value) / 100 })
            }}
            style={{
              width: '100%',
              accentColor: 'var(--aqua)',
              cursor: 'pointer',
            }}
          />
        </div>

        {/* Font Size */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: 'var(--fg1)' }}>
            <span>Font Size</span>
            <span>{settings.fontSize}px</span>
          </label>
          <input
            type="range"
            min="12"
            max="24"
            value={settings.fontSize}
            onChange={e => {
              const fontSize = Number(e.target.value)
              onUpdateSettings({ fontSize })
              document.documentElement.style.setProperty('--font-size', `${fontSize}px`)
            }}
            style={{
              width: '100%',
              accentColor: 'var(--aqua)',
              cursor: 'pointer',
            }}
          />
        </div>

        {/* Default Mode */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--fg1)' }}>
            Default Mode
          </label>
          <select
            value={settings.mode}
            onChange={e => {
              onUpdateSettings({ mode: e.target.value as AppSettings['mode'] })
            }}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'var(--bg0)',
              color: 'var(--fg)',
              border: '1px solid var(--grey0)',
              borderRadius: '4px',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            <option value="wysiwyg">WYSIWYG (Typora style)</option>
            <option value="source">Source Code</option>
            <option value="preview">Preview Only</option>
          </select>
        </div>

        <div style={{ fontSize: '11px', color: 'var(--fg1)', marginTop: '24px', borderTop: '1px solid var(--grey0)', paddingTop: '16px' }}>
          Ink Editor v0.1.0 — Terminal-styled markdown editor
        </div>
      </div>
    </div>
  )
}
