---
description: 前端样式与响应式强制约束，适用于所有涉及 Tailwind CSS、Nuxt UI 组件、移动端适配的场景
alwaysApply: false
scene: frontend_styles
---

# 样式约束

- 全局样式只允许在 `app/assets/css/main.css` 中定义，禁止新增其他全局样式文件
- 字体必须通过 Fontsource npm 包自托管，禁止使用外部 CDN（国内无法访问 Google Fonts）
- 组件中必须使用语义色（`primary`、`neutral`），禁止硬编码色值
- 禁止创建 `app.config.ts` 覆盖 Nuxt UI 默认颜色
- 禁止在 CSS 中覆盖 `--ui-primary` 等 UI 变量
- 图标必须使用 Lucide 图标集（`i-lucide-*`），通过 `UIcon` 组件渲染
- 国旗等特殊图标必须使用 Iconify 图标集（如 `flag:cn-1x1`），禁止依赖 Unicode emoji
- 禁止在组件内写自定义 CSS，必须优先使用 Tailwind utility-first 写法
- 布局必须使用 Flexbox 或 Grid，禁止固定像素宽度
- 认证页面必须使用居中卡片布局，禁止分栏、大面积纯色背景等过度装饰
