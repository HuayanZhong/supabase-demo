---
alwaysApply: false
description: 样式约束，涉及 Tailwind CSS、Nuxt UI 组件、布局时生效
---

- 优先使用 `@nuxt/ui` 的 `<U>` 组件，避免自行封装基础组件
- 样式使用 Tailwind CSS 类名，不使用 `<style scoped>` 或 CSS 文件
- 需要自定义主题时，在 `app.config.ts` / `nuxt.config.ts` 中配置
- 布局使用 `UDashboardPanel` + `UDashboardGroup` 组合
- 图表通过 `vue-echarts` 组件渲染
