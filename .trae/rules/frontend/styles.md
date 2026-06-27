---
description: 前端样式与响应式相关规则，适用于所有涉及 Tailwind CSS、@nuxt/ui 组件样式、移动端适配的场景
alwaysApply: false
scene: frontend_styles
---

# 样式与响应式规则

> Nuxt UI 组件用法、语义色、主题定制、图标、暗色模式、响应式组件行为等详见 **nuxt-ui skill**（`references/guidelines/design-system.md`、`conventions.md`、`component-selection.md`）。

## 项目约束

- 全局样式只允许在 `app/assets/css/main.css` 中定义，不新增其他全局样式文件
- 全局样式用于引入 Tailwind、Nuxt UI、Fontsource 字体和定义 CSS 变量
- **字体方案**：通过 Fontsource npm 包自托管，零外部 CDN 依赖
  - 无衬线字体：`@fontsource-variable/public-sans` → CSS font-family 为 `"Public Sans Variable"`
  - 等宽字体：`@fontsource/jetbrains-mono` → CSS font-family 为 `"JetBrains Mono"`
  - 在 `main.css` 中 `@import` 字体 CSS，在 `@theme` 中设置 `--font-sans` / `--font-mono`
- **颜色**：使用 Nuxt UI v4 默认语义色，不做额外配置
  - 组件中始终使用语义色（`color="primary"`、`color="neutral"`、`text-default`、`bg-muted` 等），不硬编码色值
  - 不创建 `app.config.ts` 覆盖颜色，也不在 CSS 中覆盖 `--ui-primary` 等变量
- Google Fonts 已禁用（国内无法访问）
- 图标使用 Lucide 图标集（`i-lucide-*`），通过 Nuxt UI 的 `UIcon` 组件渲染
- 国旗等特殊图标优先使用 Iconify 图标集（如 `flag:cn-1x1`），不依赖 Unicode emoji（Windows 不渲染旗标 emoji）

## 通用原则

- 优先使用 Tailwind utility-first 写法，不在组件内写自定义 CSS
- 优先使用 Nuxt UI 组件，不重复造轮子
- 移动端优先（mobile-first）：基础样式面向最小屏幕，大屏通过 `md:` / `lg:` 叠加
- 布局使用 Flexbox 或 Grid，避免固定像素宽度

## 设计原则

- 登录/注册页等认证页面采用居中卡片布局，不搞分栏、大面积纯色背景等过度装饰
- 头部品牌标识用图标 + 文字，不用色块字母、毛玻璃等花哨效果
- 保持简洁克制，让 Nuxt UI 组件的默认样式说话
