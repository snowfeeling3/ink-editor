import { StreamLanguage } from '@codemirror/language'
import type { Language } from '@codemirror/language'

// Preload common languages for code block highlighting
import { javascript } from '@codemirror/legacy-modes/mode/javascript'
import { python } from '@codemirror/legacy-modes/mode/python'
import { go } from '@codemirror/legacy-modes/mode/go'
import { rust } from '@codemirror/legacy-modes/mode/rust'
import { css } from '@codemirror/legacy-modes/mode/css'
import { xml } from '@codemirror/legacy-modes/mode/xml'
import { sql } from '@codemirror/legacy-modes/mode/sql'
import { yaml } from '@codemirror/legacy-modes/mode/yaml'
import { shell } from '@codemirror/legacy-modes/mode/shell'
import { ruby } from '@codemirror/legacy-modes/mode/ruby'
import { swift } from '@codemirror/legacy-modes/mode/swift'
import { lua } from '@codemirror/legacy-modes/mode/lua'
import { r } from '@codemirror/legacy-modes/mode/r'
import { perl } from '@codemirror/legacy-modes/mode/perl'
import { dockerFile } from '@codemirror/legacy-modes/mode/dockerfile'
import { toml } from '@codemirror/legacy-modes/mode/toml'
import { diff } from '@codemirror/legacy-modes/mode/diff'
import { clike } from '@codemirror/legacy-modes/mode/clike'
import { julia } from '@codemirror/legacy-modes/mode/julia'
import { haskell } from '@codemirror/legacy-modes/mode/haskell'
import { powerShell } from '@codemirror/legacy-modes/mode/powershell'

const preloaded: Record<string, Language> = {}

function add(name: string, mode: unknown) {
  preloaded[name] = StreamLanguage.define(mode as any)
}

// JavaScript family
add('javascript', javascript)
add('js', javascript)
add('typescript', javascript)
add('ts', javascript)
add('jsx', javascript)
add('tsx', javascript)
add('json', javascript)

// Python
add('python', python)
add('py', python)

// C family (C, C++, Java, C#, Kotlin, Scala, etc.)
add('c', clike)
add('cpp', clike)
add('c++', clike)
add('java', clike)
add('csharp', clike)
add('cs', clike)
add('kotlin', clike)
add('scala', clike)
add('php', clike)

// Go
add('go', go)
add('golang', go)

// Rust
add('rust', rust)
add('rs', rust)

// Web
add('css', css)
add('xml', xml)
add('html', xml)
add('svg', xml)

// Shell
add('bash', shell)
add('sh', shell)
add('shell', shell)
add('zsh', shell)

// Database
add('sql', sql)

// Config / Data
add('yaml', yaml)
add('yml', yaml)
add('toml', toml)

// Other languages
add('ruby', ruby)
add('rb', ruby)
add('swift', swift)
add('lua', lua)
add('r', r)
add('perl', perl)
add('julia', julia)
add('haskell', haskell)

// Infrastructure
add('dockerfile', dockerFile)
add('docker', dockerFile)
add('powershell', powerShell)
add('ps1', powerShell)

// Diff
add('diff', diff)

export function getCodeLanguageSync(info: string): Language | null {
  if (!info) return null
  const lang = info.split(/\s+/)[0]!.toLowerCase()
  return preloaded[lang] || null
}
