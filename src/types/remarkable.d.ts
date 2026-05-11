declare module 'remarkable' {
  export class Remarkable {
    constructor(options?: RemarkableOptions)
    render(source: string): string
  }

  interface RemarkableOptions {
    html?: boolean
    breaks?: boolean
    typographer?: boolean
    highlight?: (str: string, lang: string) => string
    linkify?: boolean
  }
}
