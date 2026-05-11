# Ink Editor — 软件使用说明

## 简介

Ink Editor 是一个终端风格的 Markdown 编辑器，外观仿 WezTerm 终端模拟器，编辑体验类似 Typora。支持所见即所得（WYSIWYG）模式、源码编辑模式和纯预览模式。

## 安装

### Windows

运行 MSI 安装包：
```
ink-editor\src-tauri\target\release\bundle\msi\Ink Editor_0.1.0_x64_en-US.msi
```

或直接运行可执行文件：
```
ink-editor\src-tauri\target\release\ink-editor.exe
```

### Linux

```bash
# 构建 .deb 包
pnpm tauri build --bundles deb

# 或构建 AppImage
pnpm tauri build --bundles appimage
```

### 从源码运行

```bash
# 克隆项目
cd ink-editor

# 安装依赖
pnpm install

# 开发模式运行
pnpm tauri dev

# 生产构建
pnpm tauri build
```

**前置要求**: Node.js 22+, Rust 1.95+, pnpm 11+

## 界面布局

```
┌─────────────────────────────────────────────────┐
│ ● ● ●   ink — README.md           ☰ ◐ ⌘ ⚙  │ ← 标题栏
├──────────┬──────────────────────────────────────┤
│ EXPLORER │                                      │
│          │  # Hello World                       │
│ ▶ 📁 src │                                      │
│   📝 a.md│  This is a markdown editor           │
│   📝 b.md│  with terminal aesthetics.           │
│          │                                      │
│          │  ## Features                         │
│          │  - WYSIWYG mode                      │
│          │  - Source mode                       │
│          │  - Preview mode                      │
│          │                                      │
├──────────┴──────────────────────────────────────┤
│ E:\docs\README.md    42 lines, 280 words  WYSIWYG ◐ 92% │ ← 状态栏
└─────────────────────────────────────────────────┘
```

- **标题栏**：窗口控制（关闭/最小化/最大化）+ 快捷按钮
- **侧边栏**：文件目录树，单击文件打开
- **编辑区**：Markdown 编辑和渲染主区域
- **状态栏**：文件路径、字数、行数、当前模式、透明度

## 快捷键

### 文件操作

| 快捷键 | 功能 |
|---|---|
| `Ctrl+O` | 打开文件夹（通过系统对话框） |
| `Ctrl+S` | 保存当前文件 |
| `Ctrl+Shift+S` | 另存为 |
| `Ctrl+W` | 关闭当前文件 |

### 视图控制

| 快捷键 | 功能 |
|---|---|
| `Ctrl+B` | 切换侧边栏显示/隐藏 |
| `Ctrl+Shift+T` | 循环透明度：92% → 75% → 55% → 92% |
| `Ctrl+Shift+P` | 打开命令面板 |
| `Ctrl+E` | 切换编辑模式：WYSIWYG → 源码 → 预览 → WYSIWYG |
| `F11` | 切换全屏 |

### 编辑器操作（CodeMirror 标准快捷键）

| 快捷键 | 功能 |
|---|---|
| `Ctrl+Z` | 撤销 |
| `Ctrl+Y` / `Ctrl+Shift+Z` | 重做 |
| `Ctrl+F` | 搜索 |
| `Ctrl+H` | 查找替换 |
| `Ctrl+A` | 全选 |
| `Ctrl+D` | 删除当前行 |
| `Tab` | 缩进 |
| `Shift+Tab` | 减少缩进 |

## 编辑模式

### WYSIWYG 模式（默认）

类似 Typora 的所见即所得体验：
- **光标所在行**：显示完整 Markdown 源码，可编辑
- **其他行**：自动隐藏格式标记（`#` `**` `*` `` ` `` 等），渲染为富文本效果
- 标题以不同颜色和字号显示（H1 红色 → H6 紫色）
- 粗体、斜体、代码、链接、删除线实时渲染
- 引用块以左边框标识

### 源码模式

纯 Markdown 源码编辑，语法高亮保留：
- 所有 Markdown 语法符号可见
- 适合精确控制格式

### 预览模式

只读模式，显示渲染后的文档：
- 标题层级样式
- 代码块语法高亮
- 表格、引用块、分割线

## 命令面板

按 `Ctrl+Shift+P` 打开命令面板，可以搜索并执行所有命令：

- Open Folder → 打开文件夹
- Save File → 保存
- Save As → 另存为
- Toggle Sidebar → 切换侧边栏
- Toggle Transparency → 切换透明度
- Toggle Editor Mode → 切换编辑模式
- Close File → 关闭文件
- Open Settings → 打开设置

在命令面板中，用 `↑↓` 键选择，`Enter` 执行，`Esc` 关闭。

## 设置面板

点击标题栏的 ⚙ 按钮打开设置面板：

- **Transparency**：滑动条调整窗口透明度（50%-100%）
- **Font Size**：编辑区字体大小（12-24px）
- **Default Mode**：默认编辑模式（WYSIWYG / 源码 / 预览）

设置自动保存到浏览器 localStorage，下次启动自动恢复。

## 支持的文件格式

- Markdown（`.md`, `.markdown`, `.mdown`, `.mkd`）
- 纯文本（`.txt`）

## 主题配色

基于 **Everforest Dark** 配色方案：

| 用途 | 色值 | 预览 |
|---|---|---|
| 背景色 | `#2d353b` | 深灰绿 |
| 前景色 | `#d3c6aa` | 暖白 |
| 强调色 | `#a7c080` | 柔绿 |
| 红色 | `#e67e80` | 标题/关闭按钮 |
| 蓝色 | `#7fbbb3` | 链接/引用 |
| 紫色 | `#d699b6` | 斜体 |
| 黄色 | `#dbbc7f` | 列表/最小化按钮 |
| 橙色 | `#e69875` | 粗体 |

## 常见问题

**Q: 侧边栏没有文件？**
A: 点击侧边栏 + 按钮或按 `Ctrl+O` 打开一个文件夹。

**Q: 如何调整透明度？**
A: 按 `Ctrl+Shift+T` 循环切换，或在设置面板中精确调整。

**Q: 窗口没有边框，怎么拖动？**
A: 拖动顶部标题栏区域即可移动窗口。

**Q: 支持图片预览吗？**
A: 当前版本暂不支持图片渲染，后续版本将添加。
