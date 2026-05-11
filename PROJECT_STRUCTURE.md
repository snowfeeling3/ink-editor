# Ink Editor — 项目结构说明

## 目录概览

```
ink-editor/
├── index.html                       # Vite 入口 HTML
├── package.json                     # 前端依赖 & 脚本
├── vite.config.ts                   # Vite 构建配置
├── tsconfig.json                    # TypeScript 根配置
├── tsconfig.app.json                # 应用 TypeScript 配置
├── tsconfig.node.json               # Node 端 TypeScript 配置
├── pnpm-lock.yaml                   # 依赖锁定文件
│
├── src/                             # React 前端源码
│   ├── main.tsx                     # React 入口
│   ├── App.tsx                      # 根组件（布局编排 & 快捷键）
│   ├── App.module.css               # 根组件样式
│   │
│   ├── components/                  # UI 组件
│   │   ├── TitleBar.tsx             # 自定义标题栏（三点按钮 + 标题 + 快捷按钮）
│   │   ├── Sidebar.tsx              # 文件树侧边栏（递归目录树）
│   │   ├── Editor.tsx               # CodeMirror 6 编辑器（Markdown 编辑核心）
│   │   ├── StatusBar.tsx            # 底部状态栏（文件信息 + 模式指示器）
│   │   ├── CommandPalette.tsx       # 命令面板（Ctrl+Shift+P）
│   │   └── SettingsPanel.tsx        # 设置面板（透明度/字体/模式）
│   │
│   ├── hooks/                       # React Hooks
│   │   ├── useSettings.ts           # 设置持久化（localStorage）
│   │   ├── useFileTree.ts           # 文件树状态管理（Tauri 文件系统调用）
│   │   ├── useEditor.ts             # 编辑器状态（打开/保存/标签管理）
│   │   └── useKeyboard.ts           # 全局键盘快捷键绑定
│   │
│   ├── styles/                      # CSS Modules
│   │   ├── global.css               # 全局 CSS 变量 & Everforest 主题
│   │   ├── titlebar.module.css      # 标题栏样式
│   │   ├── sidebar.module.css       # 侧边栏样式
│   │   ├── editor.module.css        # 编辑器容器样式
│   │   └── statusbar.module.css     # 状态栏样式
│   │
│   ├── utils/                       # 工具函数
│   │   ├── markdown.ts              # Markdown 解析（remarkable + highlight.js）
│   │   └── fileTypes.ts             # 文件类型检测 & 图标映射
│   │
│   └── types/                       # TypeScript 类型
│       ├── index.ts                  # 核心类型定义
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
        ├── lib.rs                   # Tauri Builder 配置 & 插件注册
        └── commands.rs              # 文件系统命令（read/write/list）
```

## 架构分层

| 层 | 目录 | 职责 |
|---|---|---|
| 桌面壳 | `src-tauri/` | 原生窗口控制、文件 I/O、系统对话框、打包分发 |
| 前端 UI | `src/components/` | 终端风格界面、标题栏、侧边栏、状态栏 |
| 编辑器 | `src/components/Editor.tsx` | CodeMirror 6 集成、语法高亮、模式切换 |
| 状态管理 | `src/hooks/` | 设置持久化、文件树、编辑器状态、快捷键 |
| 工具层 | `src/utils/` | Markdown 解析、文件类型识别 |
| 类型层 | `src/types/` | TypeScript 类型定义 |

## 数据流

```
用户操作 → 快捷键/按钮 → Hook → 状态更新 → 组件重渲染
                           ↓
                    Tauri invoke → Rust 命令 → 文件系统
```

- 设置通过 `useSettings` → `localStorage` 持久化
- 文件操作通过 Tauri IPC → Rust `commands.rs` → 系统文件 API
- Markdown 解析在前端完成（`remarkable` + `highlight.js`）
