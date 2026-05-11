import { ViewPlugin, Decoration, EditorView, ViewUpdate } from '@codemirror/view'
import { syntaxTree } from '@codemirror/language'
import { RangeSetBuilder } from '@codemirror/state'
import type { RangeSet } from '@codemirror/state'

// Markdown syntax characters to hide on non-active lines for WYSIWYG effect
const hiddenMarkTypes = new Set([
  'HeaderMark',
  'EmphasisMark',
  'StrongEmphasisMark',
  'CodeMark',
  'StrikethroughMark',
  'LinkMark',
  'QuoteMark',
])

const hiddenNodeTypes = new Set(['URL'])

const allHidden = new Set([...hiddenMarkTypes, ...hiddenNodeTypes])

// Heading node type → level mapping
function getHeadingLevel(typeName: string): number | null {
  const atx = typeName.match(/^ATXHeading([1-6])$/)
  if (atx) return parseInt(atx[1], 10)
  const setext = typeName.match(/^SetextHeading([12])$/)
  if (setext) return parseInt(setext[1], 10)
  return null
}

const emptySet = new RangeSetBuilder<Decoration>().finish()

function buildDecorations(view: EditorView): RangeSet<Decoration> {
  const { state } = view
  const tree = syntaxTree(state)
  if (!tree) return emptySet

  const builder = new RangeSetBuilder<Decoration>()
  const cursor = state.selection.main.head
  const cursorLine = state.doc.lineAt(cursor)

  tree.iterate({
    enter(node) {
      const typeName = node.type.name

      // Hide syntax marks on non-active lines
      if (allHidden.has(typeName)) {
        const nodeLine = state.doc.lineAt(node.from)
        if (nodeLine.number !== cursorLine.number) {
          builder.add(node.from, node.to, Decoration.replace({}))
        }
      }

      // Enlarge headings on non-active lines (WYSIWYG heading sizing)
      const level = getHeadingLevel(typeName)
      if (level !== null) {
        const line = state.doc.lineAt(node.from)
        if (line.number !== cursorLine.number) {
          builder.add(
            line.from,
            line.from,
            Decoration.line({ attributes: { class: `wysiwyg-h${level}` } }),
          )
        }
      }
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
