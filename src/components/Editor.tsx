import { useEffect, useRef, useCallback, useMemo } from 'react'
import { EditorView, keymap, placeholder, drawSelection, highlightActiveLine, lineNumbers } from '@codemirror/view'
import { EditorState, Compartment } from '@codemirror/state'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { searchKeymap } from '@codemirror/search'
import { wysiwygPlugin } from '../utils/wysiwyg'
import { highlightExtension } from '../utils/highlight'
import { renderMarkdown } from '../utils/markdown'
import { getCodeLanguageSync } from '../utils/codeLanguages'
import type { EditorMode } from '../types'
import styles from '../styles/editor.module.css'

interface EditorProps {
  content: string
  onChange: (content: string) => void
  mode: EditorMode
  fontSize: number
}

const everforestTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: 'transparent',
      color: 'var(--fg)',
    },
    '.cm-content': {
      caretColor: 'var(--aqua)',
      fontFamily: 'var(--font-mono)',
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: 'var(--aqua)',
      borderLeftWidth: '2px',
    },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
      backgroundColor: 'var(--selection-bg)',
    },
    '.cm-activeLine': {
      backgroundColor: 'rgba(255,255,255,0.03)',
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'transparent',
      color: 'var(--fg1)',
    },
    '.cm-gutters': {
      backgroundColor: 'transparent',
      color: 'rgba(255,255,255,0.12)',
      border: 'none',
      borderRight: '1px solid var(--border-subtle)',
    },
    '.cm-foldPlaceholder': {
      backgroundColor: 'rgba(255,255,255,0.04)',
      border: '1px solid var(--border-subtle)',
      color: 'var(--fg1)',
    },
    '.cm-meta, .cm-comment': {
      color: 'var(--grey2)',
      fontStyle: 'italic',
    },
    '.cm-heading': {
      fontWeight: '500',
    },
    '.cm-strong': {
      fontWeight: '600',
      color: 'var(--green)',
    },
    '.cm-emphasis': {
      fontStyle: 'italic',
      color: 'var(--purple)',
    },
    '.cm-link': {
      color: 'var(--blue)',
      textDecoration: 'underline',
    },
    '.cm-url': {
      color: 'var(--blue)',
    },
    '.cm-code, .cm-monospace': {
      backgroundColor: 'rgba(255,255,255,0.05)',
      color: 'var(--aqua)',
      borderRadius: '3px',
      padding: '0 4px',
    },
    '.cm-codeBlock': {
      backgroundColor: 'rgba(0,0,0,0.2)',
    },
    '.cm-list': {
      color: 'var(--yellow)',
    },
    '.cm-quote': {
      color: 'var(--fg1)',
      borderLeft: '2px solid var(--blue)',
      paddingLeft: '12px',
    },
    '.cm-hr': {
      color: 'var(--border-subtle)',
    },
    '.cm-strikethrough': {
      textDecoration: 'line-through',
    },
  },
  { dark: true },
)

const fontSizeTheme = (size: number) =>
  EditorView.theme({
    '&': {
      fontSize: `${size}px`,
    },
  })

export default function Editor({ content, onChange, mode, fontSize }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const isUpdatingRef = useRef(false)
  const editableCompartment = useRef(new Compartment())
  const fontSizeCompartment = useRef(new Compartment())
  const wysiwygCompartment = useRef(new Compartment())

  const handleChange = useCallback(
    (doc: string) => {
      if (isUpdatingRef.current) return
      onChange(doc)
    },
    [onChange],
  )

  const renderedHtml = useMemo(() => {
    if (mode !== 'preview') return ''
    return renderMarkdown(content)
  }, [mode, content])

  // Initialize editor
  useEffect(() => {
    if (!editorRef.current || viewRef.current) return

    const updateListener = EditorView.updateListener.of(update => {
      if (update.docChanged) {
        const value = update.state.doc.toString()
        handleChange(value)
      }
    })

    const state = EditorState.create({
      doc: content,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        drawSelection(),
        history(),
        markdown({ base: markdownLanguage, codeLanguages: getCodeLanguageSync }),
        highlightExtension,
        everforestTheme,
        fontSizeCompartment.current.of(fontSizeTheme(fontSize)),
        editableCompartment.current.of(EditorView.editable.of(true)),
        wysiwygCompartment.current.of(wysiwygPlugin),
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap,
          ...searchKeymap,
        ]),
        placeholder('Start writing...'),
        updateListener,
        EditorView.lineWrapping,
        EditorState.tabSize.of(2),
      ],
    })

    const view = new EditorView({
      state,
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
      viewRef.current = null
    }
  }, [])

  // Update content when it changes externally (file switch)
  useEffect(() => {
    if (!viewRef.current) return
    const currentContent = viewRef.current.state.doc.toString()
    if (content !== currentContent) {
      isUpdatingRef.current = true
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: currentContent.length,
          insert: content,
        },
      })
      isUpdatingRef.current = false
    }
  }, [content])

  // Update font size
  useEffect(() => {
    if (!viewRef.current) return
    viewRef.current.dispatch({
      effects: fontSizeCompartment.current.reconfigure(fontSizeTheme(fontSize)),
    })
  }, [fontSize])

  // Handle mode changes
  useEffect(() => {
    if (!viewRef.current) return
    const isReadOnly = mode === 'preview'
    const isWysiwyg = mode === 'wysiwyg'
    viewRef.current.dispatch({
      effects: [
        editableCompartment.current.reconfigure(EditorView.editable.of(!isReadOnly)),
        wysiwygCompartment.current.reconfigure(isWysiwyg ? wysiwygPlugin : []),
      ],
    })
  }, [mode])

  // Force CodeMirror to measure when its container changes visibility
  useEffect(() => {
    if (!viewRef.current) return
    const timer = setTimeout(() => {
      viewRef.current?.requestMeasure()
    }, 50)
    return () => clearTimeout(timer)
  }, [mode])

  const isPreview = mode === 'preview'

  return (
    <div className={styles.editorContainer}>
      <div
        className={`${styles.editor} ${isPreview ? styles.editorHidden : ''}`}
        ref={editorRef}
      />
      {isPreview && (
        <div
          className={styles.preview}
          style={{ fontSize: `${fontSize}px` }}
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
      )}
    </div>
  )
}

interface EmptyEditorProps {
  onOpenFolder: () => void
  onOpenFile: () => void
}

export function EmptyEditor({ onOpenFolder, onOpenFile }: EmptyEditorProps) {
  return (
    <div className={styles.editorContainer}>
      <div className={styles.emptyState}>
        <h1>Ink Editor</h1>
        <p>A terminal-styled markdown editor</p>
        <div className={styles.shortcuts}>
          <kbd>Ctrl+O</kbd><span>Open Folder</span>
          <kbd>Ctrl+Shift+O</kbd><span>Open File</span>
          <kbd>Ctrl+B</kbd><span>Toggle Sidebar</span>
          <kbd>Ctrl+Shift+T</kbd><span>Transparency</span>
          <kbd>Ctrl+Shift+P</kbd><span>Command Palette</span>
          <kbd>Ctrl+E</kbd><span>Toggle Mode</span>
          <kbd>Ctrl+S</kbd><span>Save File</span>
          <kbd>F11</kbd><span>Fullscreen</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button
            onClick={onOpenFolder}
            style={{
              padding: '8px 20px',
              background: 'var(--bg2)',
              color: 'var(--fg)',
              border: '1px solid var(--grey0)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
            }}
          >
            Open Folder
          </button>
          <button
            onClick={onOpenFile}
            style={{
              padding: '8px 20px',
              background: 'var(--bg2)',
              color: 'var(--fg)',
              border: '1px solid var(--grey0)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
            }}
          >
            Open File
          </button>
        </div>
      </div>
    </div>
  )
}
