# Ink Editor — 项目结构说明

## 目录概览

```
ink-editor/
├── index.html                       # Vite 入口 HTML
├── package.json                     # 前端依赖 & 脚本
├── vite.config.ts                   # Vite 构建配置
├── tsconfig.json                    # TypeScript 根配置
├── pnpm-lock.yaml                   # 依赖锁定文件
│
├── src/                             # React 前端源码
│   ├── main.tsx                     # React 入口
│   ├── App.tsx                      # 根组件（布局编排 & 快捷键 & 命令面板）
│   ├── App.module.css               # 根组件样式（毛玻璃效果）
│   │
│   ├── components/                  # UI 组件
│   │   ├── TitleBar.tsx             # 自定义标题栏（红黄绿三点 + 标题 + 快捷按钮）
│   │   ├── Sidebar.tsx              # 文件树侧边栏（递归目录树 + Open File/Open Folder）
│   │   ├── Editor.tsx               # CodeMirror 6 编辑器核心 + Preview HTML 渲染
│   │   ├── StatusBar.tsx            # 底部状态栏（文件信息 + 模式指示器 + 透明度）
│   │   ├── CommandPalette.tsx       # 命令面板（Ctrl+Shift+P）
│   │   └── SettingsPanel.tsx        # 设置面板（透明度/字体/默认模式）
│   │
│   ├── hooks/                       # React Hooks
│   │   ├── useSettings.ts           # 设置持久化（localStorage）+ 透明度控制
│   │   ├── useFileTree.ts           # 文件树状态管理（Tauri 文件系统调用 + 文件对话框）
│   │   ├── useEditor.ts             # 编辑器状态（打开/保存/标签管理）
│   │   └── useKeyboard.ts           # 全局键盘快捷键绑定
│   │
│   ├── styles/                      # CSS Modules
│   │   ├── global.css               # 全局 CSS 变量 + Everforest 主题 + highlight.js 主题
│   │   ├── titlebar.module.css      # 标题栏样式
│   │   ├── sidebar.module.css       # 侧边栏样式
│   │   ├── editor.module.css        # 编辑器 + 预览 + WYSIWYG 标题样式
│   │   └── statusbar.module.css     # 状态栏样式
│   │
│   ├── utils/                       # 工具函数
│   │   ├── markdown.ts              # Markdown 解析（remarkable + highlight.js）
│   │   ├── wysiwyg.ts               # WYSIWYG 装饰器（隐藏语法标记 + 标题放大）
│   │   ├── highlight.ts             # CodeMirror Everforest 语法高亮主题
│   │   ├── codeLanguages.ts         # 代码块语言映射（30+ 种语言支持）
│   │   └── fileTypes.ts             # 文件类型检测 & 图标映射
│   │
│   └── types/                       # TypeScript 类型
│       ├── index.ts                  # 核心类型定义（DirEntry, FileTab, AppSettings, Command）
│       └── remarkable.d.ts           # remarkable 库类型声明
│
└── src-tauri/                       # Tauri v2 Rust 后端
    ├── Cargo.toml                   # Rust 依赖
    ├── build.rs                     # Tauri 构建脚本
    ├── tauri.conf.json              # Tauri 窗口/打包/插件配置
    ├── capabilities/
    │   └── default.json             # 权限声明（文件系统/对话框）
    ├── icons/                       # 应用图标（多尺寸）
    └── src/
        ├── main.rs                  # Rust 入口
        ├── lib.rs                   # Tauri Builder 配置 & 插件 & 命令注册
        └── commands.rs              # 文件系统命令（read/write/create/list/exists）+ 窗口控制
```

## 架构分层

| 层 | 目录 | 职责 |
|---|---|---|
| 桌面壳 | `src-tauri/` | 原生窗口控制、文件 I/O、系统对话框、打包分发 |
| 前端 UI | `src/components/` | 终端风格界面、标题栏、侧边栏、状态栏、命令面板 |
| 编辑器核心 | `src/components/Editor.tsx` | CodeMirror 6 集成、三种模式切换、HTML 预览渲染 |
| 装饰器 | `src/utils/wysiwyg.ts` | WYSIWYG 语法标记隐藏、标题级别缩放 |
| 语法高亮 | `src/utils/highlight.ts` + `codeLanguages.ts` | Everforest 主题 + 代码块语言映射 |
| 状态管理 | `src/hooks/` | 设置持久化、文件树、编辑器标签、全局快捷键 |
| Markdown | `src/utils/markdown.ts` | remarkable 解析 + highlight.js 代码高亮 |
| 类型层 | `src/types/` | TypeScript 类型定义 |

## 三种编辑模式

| 模式 | CodeMirror | WYSIWYG 插件 | 渲染方式 |
|---|---|---|---|
| **WYSIWYG** | 可编辑 | ✅ 隐藏 #、放大标题 | CodeMirror + 装饰器 |
| **Source** | 可编辑 | ❌ | CodeMirror 原生语法高亮 |
| **Preview** | 只读（隐藏） | ❌ | `renderMarkdown()` → HTML |

## 数据流

```
用户操作 → 快捷键/按钮/命令面板 → Hook → 状态更新 → 组件重渲染
                                    ↓
                             Tauri invoke → Rust 命令 → 文件系统
```

- 设置通过 `useSettings` → `localStorage` 持久化
- 文件操作通过 Tauri IPC → Rust `commands.rs` → 系统文件 API
- Markdown 解析在前端完成（`remarkable` + `highlight.js`）
- 代码块高亮在编辑模式用 `@codemirror/legacy-modes`，预览模式用 `highlight.js`
