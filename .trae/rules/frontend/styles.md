---
description: 前端样式与响应式相关规则，适用于所有涉及 Tailwind CSS、@nuxt/ui 组件样式、移动端适配的场景
alwaysApply: false
scene: frontend_styles
---

# 样式与响应式规则

> Nuxt UI 组件用法、语义色、主题定制、图标、暗色模式、响应式组件行为等详见 **nuxt-ui skill**（`references/guidelines/design-system.md`、`conventions.md`、`component-selection.md`）。

## 项目约束

- 全局样式只允许在 `app/assets/css/main.css` 中定义，不新增其他全局样式文件
- 全局样式仅用于引入 Tailwind、Nuxt UI 和定义全局 CSS 变量（如 `--font-sans`）
- Google Fonts 已禁用（国内无法访问），字体通过 `@nuxt/fonts` 配置，不在 CSS 中 `@import` 外部字体
- 国旗等特殊图标优先使用 Iconify 图标集（如 `flag:cn-1x1`），不依赖 Unicode emoji（Windows 不渲染旗标 emoji）
- 不要在 JS 中硬编码颜色值，始终使用语义色或 CSS 变量

## 通用原则

- 优先使用 Tailwind utility-first 写法，不在组件内写自定义 CSS
- 优先使用 Nuxt UI 组件，不重复造轮子
- 移动端优先（mobile-first）：基础样式面向最小屏幕，大屏通过 `md:` / `lg:` 叠加
- 布局使用 Flexbox 或 Grid，避免固定像素宽度
