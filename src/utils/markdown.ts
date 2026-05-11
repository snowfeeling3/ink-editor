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

export function renderInlineMarkdown(source: string): string {
  // For inline rendering, we parse markdown and strip the outer <p> tags
  const html = md.render(source)
  return html
    .replace(/^<p>/, '')
    .replace(/<\/p>\n?$/, '')
}
