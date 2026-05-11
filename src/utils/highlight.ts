import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'

const everforestHighlightStyle = HighlightStyle.define([
  // Headings — Everforest red
  { tag: tags.heading, color: '#e67e80', fontWeight: '500' },

  // Bold (StrongEmphasis) — Everforest green
  { tag: tags.strong, color: '#a7c080', fontWeight: '600' },

  // Italic (Emphasis) — Everforest purple
  { tag: tags.emphasis, color: '#d699b6', fontStyle: 'italic' },

  // Strikethrough
  { tag: tags.strikethrough, color: '#9da9a0', textDecoration: 'line-through' },

  // Inline code & code blocks — Everforest aqua
  { tag: tags.monospace, color: '#83c092' },

  // Links — Everforest blue
  { tag: tags.link, color: '#7fbbb3', textDecoration: 'underline' },
  { tag: tags.url, color: '#7fbbb3' },

  // List markers — Everforest yellow
  { tag: tags.list, color: '#dbbc7f' },

  // Block quotes
  { tag: tags.quote, color: '#9da9a0' },

  // Horizontal rules
  { tag: tags.contentSeparator, color: 'rgba(255,255,255,0.08)' },

  // HTML / processing instructions
  { tag: tags.processingInstruction, color: '#859289', fontStyle: 'italic' },

  // HTML comments
  { tag: tags.comment, color: '#859289', fontStyle: 'italic' },

  // Task list markers
  { tag: tags.atom, color: '#e69875' },

  // Metadata
  { tag: tags.meta, color: '#859289' },

  // Keyword (used in frontmatter, etc.)
  { tag: tags.keyword, color: '#d699b6' },

  // Strings (used in frontmatter)
  { tag: tags.string, color: '#a7c080' },

  // Numbers
  { tag: tags.number, color: '#e69875' },

  // Labels
  { tag: tags.labelName, color: '#dbbc7f' },
])

export const highlightExtension = syntaxHighlighting(everforestHighlightStyle)
