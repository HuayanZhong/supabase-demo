---
alwaysApply: false
description: Nuxt 前端开发规范，涉及组件/页面/路由/数据获取时生效
---

## 页面与组件

- 组件放在 `components/` 目录，页面放在 `pages/` 目录
- 业务组件按目录组织：`components/business/{domain}/`
- 组件名使用多字命名（`UserProfileCard` 而非 `Profile`）
- composables 放在 `composables/` 目录，按功能文件拆分
- server routes 放在 `server/api/` 目录

## 数据获取

- 数据获取优先使用 `useFetch`，不使用 `$fetch` 直接调用
- `useAsyncData` 用于非 `$fetch` 的异步数据源（如调用 Service 方法）
- 避免在 `<template>` 中直接使用 `Date.now()`、`Math.random()` 等导致 hydration 不匹配的逻辑

## 状态管理

- 页面级状态优先使用 `useState` 或 `useAsyncData`
- 跨路由共享状态使用 `useState` 配合 composable 封装
- 仅当状态需要在完全不相关的页面间深度共享时，引入 Pinia
