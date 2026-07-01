---
description: 前端类型定义强制约束，适用于所有涉及 TypeScript 类型、Zod schema 的场景
alwaysApply: false
scene: frontend_types
---

# 类型定义约束

- 共享类型必须集中在 `packages/types` 子包中定义，禁止在 `apps/` 下重复定义共享类型
- 应用特有的局部类型可以直接放在应用内，但跨模块共享的类型必须放 `packages/types`
- 每个模块文件必须同时导出 Zod schema（运行时）和推断类型（编译时）
- schema 命名使用 `xxxSchema`，类型命名使用 `XxxSchema`（通过 `z.infer`）
- 使用 Zod API 前必须先查询官方文档（https://zod.dev/v4），不得凭记忆写代码
