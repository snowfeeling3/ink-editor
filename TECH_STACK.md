# Ink Editor — 技术栈说明

## 总览

| 类别 | 技术 | 版本 | 用途 |
|---|---|---|---|
| 桌面框架 | **Tauri v2** | 2.11 | 跨平台桌面壳、原生窗口控制、打包分发 |
| 系统语言 | **Rust** | 1.95 | 文件 I/O、系统调用、性能敏感操作 |
| 前端框架 | **React** | 19.2 | 声明式 UI 组件 |
| 类型系统 | **TypeScript** | 6.0 | 静态类型检查 |
| 构建工具 | **Vite** | 8.0 | 前端构建、HMR 开发服务器 |
| 包管理 | **pnpm** | 11.0 | 高效依赖管理 |
| 编辑器引擎 | **CodeMirror 6** | 6.42 | 源码编辑、语法高亮、装饰系统 |
| Markdown 解析 | **remarkable** | 2.0 | 高性能 Markdown → HTML 渲染 |
| 代码高亮 | **highlight.js** | 11.11 | 代码块语法高亮 |
| 样式方案 | **CSS Modules** | — | 组件级样式隔离 |

## 技术选型理由

### 为什么选 Tauri v2 而非 Electron？

| 对比维度 | Electron | Tauri v2 |
|---|---|---|
| 安装包体积 | 80-200 MB | **3-5 MB** |
| 内存占用 | 150-300 MB | **25-30 MB** |
| 启动速度 | 3-5 秒 | **< 0.5 秒** |
| IPC 延迟 | 基准 | **降低 40%**（v2 重构） |
| 运行时依赖 | 内置 Chromium + Node.js | 复用系统 WebView2 |

Tauri 的 Rust 后端提供原生文件 I/O 性能，WebView2 负责 UI 渲染，体积和内存优势显著。

### 为什么选 CodeMirror 6 而非 Monaco/Tiptap？

- **CodeMirror 6**：轻量（~100-300KB 模块化），源码编辑优先，装饰系统可实现 Typora 风格的 WYSIWYG。适合 ≤3MB 文件。
- **Monaco**：IDE 级（1.5-5MB），功能强大但过重。适合 IDE 场景，非 Markdown 笔记。
- **Tiptap/ProseMirror**：基于结构化文档模型，适合 Notion 风格块编辑器，不适合 Typora 的"编辑源码→渲染预览"模式。

### 为什么选 remarkable 而非 markdown-it？

remarkable 在 JS Markdown 解析器基准测试中 **~2x 快于 markdown-it**（5,600-7,700 ops/s vs 3,000-4,500 ops/s），对编辑器的实时预览至关重要。

### 为什么选 CSS Modules 而非 Tailwind？

- 零依赖，无需额外构建步骤
- 组件级样式隔离，命名冲突无忧
- 终端风格编辑器需要精细的 CSS 控制（字体、间距、透明度）
- 对于此类 UI 密集型应用，原子类的性价比不高

## 关键依赖

### 前端

```json
{
  "@codemirror/view": "编辑器视图层",
  "@codemirror/state": "编辑器状态管理",
  "@codemirror/lang-markdown": "Markdown 语言支持",
  "@codemirror/commands": "编辑命令（撤销/重做等）",
  "@codemirror/search": "搜索功能",
  "@codemirror/language": "语法高亮 & 语言扩展",
  "remarkable": "Markdown 解析引擎",
  "highlight.js": "代码块语法高亮",
  "@tauri-apps/api": "Tauri 前端 API",
  "@tauri-apps/plugin-dialog": "系统文件对话框",
  "@tauri-apps/plugin-fs": "文件系统访问",
  "@tauri-apps/plugin-shell": "Shell 集成"
}
```

### Rust 后端

```toml
[dependencies]
tauri = "2"              # Tauri 核心
tauri-plugin-dialog = "2" # 系统对话框
tauri-plugin-fs = "2"    # 文件系统
tauri-plugin-shell = "2" # Shell 命令
serde = "1"              # 序列化
serde_json = "1"         # JSON 处理
```

## 性能优化策略

1. **Rust 文件 I/O**：所有文件操作在 Rust 端执行，避免 JS 文件 API 的性能瓶颈
2. **sccache**：Rust 编译缓存加速 60%（开发时建议安装）
3. **CodeMirror 6 虚拟视口**：仅渲染可见行，大文件不卡顿
4. **remarkable 同步解析**：在主线程解析但利用其 C 级优化速度
5. **CSS backdrop-filter**：GPU 加速的模糊和透明效果

## 打包产物

| 格式 | 路径 | 大小 |
|---|---|---|
| 可执行文件 | `src-tauri/target/release/ink-editor.exe` | ~21 MB |
| MSI 安装包 | `src-tauri/target/release/bundle/msi/` | ~7 MB |
| NSIS 安装包 | `src-tauri/target/release/bundle/nsis/` | 需单独构建 |
