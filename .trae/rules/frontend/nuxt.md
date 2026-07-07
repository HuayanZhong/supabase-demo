---
alwaysApply: false
description: Nuxt 前端开发规范，涉及组件/页面/路由/数据获取时生效
---

- 组件放在 `components/` 目录，页面放在 `pages/` 目录
- 业务组件按目录组织：`components/business/{domain}/`
- 数据获取优先使用 `useFetch`，不使用 `$fetch` 直接调用
- 状态管理使用 `useState` 或 `useAsyncData`，不引入 Pinia
- 路由中间件放在 `middleware/`，布局放在 `layouts/`
- Dashboard 路由使用 `auth` 中间件做登录鉴权
