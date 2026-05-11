import { Remarkable } from 'remarkable'
import hljs from 'highlight.js'

const md = new Remarkable({
  html: true,
  breaks: true,
  typographer: true,
  highlight: (str: string, lang: string) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      } catch {
        // fall through
      }
    }
    try {
      return hljs.highlightAuto(str).value
    } catch {
      return ''
    }
  },
})

export function renderMarkdown(source: string): string {
  return md.render(source)
}
