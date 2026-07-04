# frontend

Nuxt 4 前端应用 — Growth OS 个人成长管理系统。

## 技术栈

- **框架：** Nuxt 4 + Vue 3 + `<script setup lang="ts">`
- **UI：** Nuxt UI v4 + Tailwind CSS v4
- **国际化：** `@nuxtjs/i18n`（no_prefix 策略），语言资源由 `@supabase/i18n` 提供
- **图表：** ECharts + `vue-echarts`
- **认证：** Supabase SSR（`@supabase/ssr` + `@supabase/supabase-js`）
- **类型**：由 `@supabase/types` 提供全局共享类型

## 路由

| 路径                  | 页面       | 布局        | 认证 |
| --------------------- | ---------- | ----------- | :--: |
| `/`                   | 登录/注册  | `default`   |  否  |
| `/dashboard/home`     | 仪表盘首页 | `dashboard` |  是  |
| `/dashboard/goals`    | 目标中心   | `dashboard` |  是  |
| `/dashboard/projects` | 项目空间   | `dashboard` |  是  |
| `/dashboard/learn`    | 学习与资料 | `dashboard` |  是  |

## 架构约定

- **组件**：业务组件在 `components/business/{domain}/` 下按目录拆分
- **页面**：`pages/dashboard/{domain}/index.vue` 结构
- **状态**：composable 在 `composables/` 中管理；mock 数据在 `utils/` 中
- **国际化**：模板中使用 `$t()` / `useI18n()`，所有文本必须走 i18n，禁止硬编码
- **类型**：从 `@supabase/types` `import type`，不得重复定义
- **lint**：使用 `@supabase/lint-config/base` + `@supabase/lint-config/frontend`

## 开发

```bash
pnpm dev          # nuxt dev → http://localhost:3000
pnpm check-types  # nuxt typecheck
pnpm test         # vitest
```

## 当前状态

mock 数据阶段。所有业务数据由 `utils/useProjects.ts`、`utils/useLearn.ts` 提供硬编码模拟数据，未连接后端 API。页面结构完整。
