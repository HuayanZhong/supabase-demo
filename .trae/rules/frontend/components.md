---
alwaysApply: false
description: 组件架构，涉及组件提取、拆分、复用时生效
---

## 提取时机

满足以下任一条件时，将模板片段提取为独立组件：

| 条件                             | 示例                                                    |
| -------------------------------- | ------------------------------------------------------- |
| 同一片段在 2+ 个页面/组件中复用  | `AiSuggestions` 被 `AiEmptyState` + `ai/index.vue` 引用 |
| 单文件超过 150 行                | 页面拆为布局骨架 + 多个业务组件                         |
| 片段有独立的 composable 状态依赖 | 侧边栏依赖 `useAi().conversations`                      |

## 提取方式

- 子组件通过 composable 自取状态（如 `useAi()`、`useI18n()`），除非父组件必须显式传参
- 页面保持为布局编排层（10-30 行），具体逻辑下沉到子组件
- 组件名遵循 Nuxt 自动导入规则：路径 `business/{domain}/{Name}.vue` → `<Business{Domain}{Name}>`
