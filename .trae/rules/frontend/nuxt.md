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

## API 路径一致性

- **修改后端 API 路由前缀或版本策略后，必须同步检查前端文件中的 API 调用路径**
- 使用 Grep 搜索所有前端文件中的 `$fetch`/`useFetch` 调用，核对路径中的版本号是否匹配后端最新配置
- 示例：后端从 `/api/locations` 改为 `/api/v1/locations` 后，前端 `CalendarWeatherCard.vue` 等组件中的调用路径需同步更新

## 已知坑点

### TS5097：vue-tsc 与 .ts 扩展名

使用 `allowImportingTsExtensions: true` + `noEmit: true` 时，vue-tsc 可能报 `TS5097: An import path can only end with a '.ts' extension when 'allowImportingTsExtensions' is enabled.`

- **根因**：vue-tsc 在检查 workspace 包的 barrel 文件时，对 `.ts` 扩展名的支持不如 tsc 稳定
- **解决**：清理 `.nuxt` 缓存后重新 typecheck
  ```bash
  rm -rf apps/frontend/.nuxt
  pnpm -F frontend check-types
  ```
- **预防**：确保 workspace 包的 `tsconfig.json` 同时配置 `allowImportingTsExtensions: true` 和 `noEmit: true`

## 状态管理

- 页面级状态优先使用 `useState` 或 `useAsyncData`
- 跨路由共享状态使用 `useState` 配合 composable 封装
- 仅当状态需要在完全不相关的页面间深度共享时，引入 Pinia
