---
description: 前端样式与响应式相关规则，适用于所有涉及 Tailwind CSS、@nuxt/ui 组件样式、移动端适配的场景
alwaysApply: false
scene: frontend_styles
---

# 样式与响应式规则

## Tailwind CSS 基本原则

- 优先使用 Tailwind utility-first 写法，不在组件内写自定义 CSS
- 全局样式只允许在 `app/assets/css/main.css` 中定义，不新增其他全局样式文件
- 全局样式仅用于引入 Tailwind、Nuxt UI 和定义全局 CSS 变量（如 `--font-sans`）

## @nuxt/ui 组件样式

- 优先使用 Nuxt UI 组件（`UButton`、`UCard`、`UInput` 等），不重复造轮子
- 样式定制优先通过组件的 `class` prop 或 `ui` prop（如 `ui: { base: '...' }`）完成
- 避免使用 `::v-deep` / `:deep()` 覆盖 Nuxt UI 内部类，这会导致升级时样式丢失
- 如需覆盖主题级样式，使用 `app.config.ts` 中的 `ui` 配置，而非组件级 hack

## 响应式设计

- 使用 Tailwind 断点系统（`sm:` / `md:` / `lg:` / `xl:`），不自定义断点
- 移动端优先（mobile-first）：基础样式面向最小屏幕，大屏通过 `md:` / `lg:` 叠加
- 布局使用 Flexbox 或 Grid，避免固定像素宽度
- Nuxt UI 组件内部已内置响应式逻辑，不要额外包裹一层固定宽度容器

## 图标

- 使用 `UIcon` 组件（基于 `@nuxt/icon`），不直接写 SVG 或 emoji 替代
- 国旗等特殊图标优先使用 Iconify 图标集（如 `flag:cn-1x1`），不依赖 Unicode emoji（Windows 不渲染旗标 emoji）
- 本地安装图标集（`pnpm add -D @iconify-json/<collection>`）以提升 SSR 和加载性能

## 字体

- 项目使用 `@nuxt/fonts`，通过 `nuxt.config.ts` 配置，不在 CSS 中 `@import` 外部字体
- Google Fonts 已禁用（国内无法访问），如有新字体需求需确认 provider 配置
- 字体变量在 `main.css` 的 `@theme` 块中定义（如 `--font-sans`）

## 暗色模式

- Nuxt UI 内置 `colorMode` 支持，无需手动实现
- 如组件需要对暗色模式做样式区分，使用 Tailwind 的 `dark:` 前缀
- 不要在 JS 中硬编码颜色值，始终使用 Tailwind 或 CSS 变量
