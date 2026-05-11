# Ink Editor

> 终端风格 Markdown 编辑器 — 基于 Tauri v2 + React + CodeMirror 6

Ink Editor 是一款具有 Everforest 暗色主题、毛玻璃透明效果、Typora 风格 WYSIWYG 所见即所得编辑的 Markdown 桌面编辑器。

## 特性

- **三种编辑模式** — WYSIWYG（隐藏标记/放大标题）、Source（语法高亮源码）、Preview（HTML 渲染预览）
- **代码块语法高亮** — 支持 30+ 种编程语言（C/C++、Python、Java、Go、Rust、JS/TS、SQL、YAML 等）
- **终端美学** — Everforest Dark 配色、JetBrains Mono 字体、毛玻璃半透明窗口
- **文件管理** — 侧边栏文件树浏览、单独打开文件、文件保存/另存为
- **快捷键驱动** — 命令面板（Ctrl+Shift+P）、全局快捷键、无标题栏干扰
- **跨平台** — Windows / macOS / Linux（Tauri v2 构建）

## 快捷键

| 快捷键 | 功能 |
|---|---|
| `Ctrl+O` | 打开文件夹 |
| `Ctrl+Shift+O` | 打开文件 |
| `Ctrl+S` | 保存文件 |
| `Ctrl+Shift+S` | 另存为... |
| `Ctrl+B` | 切换侧边栏 |
| `Ctrl+E` | 切换编辑模式 |
| `Ctrl+W` | 关闭当前文件 |
| `Ctrl+Shift+T` | 切换透明度 |
| `Ctrl+Shift+P` | 命令面板 |
| `F11` | 全屏 |

## 技术栈

| 层 | 技术 |
|---|---|
| 桌面壳 | Tauri v2 (Rust) |
| 编辑器核心 | CodeMirror 6 + @codemirror/lang-markdown |
| 语法高亮 | highlight.js + @codemirror/legacy-modes |
| Markdown 解析 | remarkable + WYSIWYG 装饰器 |
| 前端框架 | React 19 + TypeScript |
| 构建工具 | Vite 8 + Rolldown |

## 开发

### 环境要求

- Node.js 20+
- pnpm
- Rust 工具链（rustup + cargo）

### 启动开发服务器

```bash
pnpm install
pnpm tauri dev
```

### 构建 Release

```bash
pnpm tauri build
```

产物输出至 `src-tauri/target/release/`。

## 项目结构

详见 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

## License

MIT
