import { ViewPlugin, Decoration, EditorView, ViewUpdate } from '@codemirror/view'
import { syntaxTree } from '@codemirror/language'
import { RangeSetBuilder } from '@codemirror/state'
import type { RangeSet } from '@codemirror/state'

// Markdown syntax characters to hide on non-active lines for WYSIWYG effect
const hiddenMarkTypes = new Set([
  'HeadingMark',
  'EmphasisMark',
  'StrongEmphasisMark',
  'CodeMark',
  'StrikethroughMark',
  'LinkMark',
  'QuoteMark',
])

// Extra node types whose entire range should be hidden on non-active lines
const hiddenNodeTypes = new Set([
  'URL',
])

const allHidden = new Set([...hiddenMarkTypes, ...hiddenNodeTypes])

const emptySet = new RangeSetBuilder<Decoration>().finish()

function buildDecorations(view: EditorView): RangeSet<Decoration> {
  const { state } = view
  const tree = syntaxTree(state)
  if (!tree) return emptySet

  const builder = new RangeSetBuilder<Decoration>()

  // Find the active line from primary cursor
  const cursor = state.selection.main.head
  const cursorLine = state.doc.lineAt(cursor)

  tree.iterate({
    enter(node) {
      if (!allHidden.has(node.type.name)) return

      // Keep marks visible on the cursor line (source-editing mode)
      const nodeLine = state.doc.lineAt(node.from)
      if (nodeLine.number === cursorLine.number) return

      builder.add(node.from, node.to, Decoration.replace({}))
    },
  })

  return builder.finish()
}

export const wysiwygPlugin = ViewPlugin.fromClass(
  class {
    decorations: RangeSet<Decoration>
    private lastTree: unknown = null

    constructor(view: EditorView) {
      this.decorations = buildDecorations(view)
      this.lastTree = syntaxTree(view.state)
    }

    update(update: ViewUpdate) {
      const tree = syntaxTree(update.view.state)
      if (
        update.docChanged ||
        update.selectionSet ||
        update.viewportChanged ||
        tree !== this.lastTree
      ) {
        this.lastTree = tree
        this.decorations = buildDecorations(update.view)
      }
    }
  },
  {
    decorations: (v) => v.decorations,
  },
)
