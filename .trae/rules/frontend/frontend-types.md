---
description: 前端类型定义规则，适用于所有涉及 TypeScript 类型、Zod schema、数据校验的场景
alwaysApply: false
scene: frontend_types
---

# 类型定义规则

## 类型包结构

所有共享类型定义集中在 `packages/types` 子包中，按功能模块拆分子目录。

### 新增模块检查清单

1. 在 `packages/types/src/<module>/index.ts` 中定义 schema 和类型
2. 在 `packages/types/src/index.ts` 中添加 re-export
3. 在 `packages/types/package.json` 的 `exports` 中添加子路径映射
4. 消费方通过 `@supabase/types` 或 `@supabase/types/<module>` 导入

### 定义规范

- 每个模块文件同时导出 Zod schema（运行时）和推断类型（编译时）
- 命名约定：schema 用 `xxxSchema`，类型用 `XxxSchema`（通过 `z.infer`）
- 类型定义只放在 `packages/types` 中，不在 `apps/` 下重复定义共享类型
- 应用特有的局部类型可以直接放在应用内，但跨模块共享的类型必须放 `packages/types`

## Zod 用法规范

项目使用 **Zod v4**。Zod 4 是从零重写的版本，API 与 v3 有大量差异。

### 查阅文档的强制要求

- **使用任何 Zod API 前，必须先查阅官方文档 https://zod.dev/v4 确认当前版本的正确用法**
- 不能凭记忆或训练数据写代码，Zod API 会随版本更新而变化
- 可通过 tavily MCP 搜索 Zod v4 文档，或直接用 WebFetch 抓取上述 URL
- 如果不确定某个 API 是否废弃或行为改变，先查文档再写代码

### 核心原则

- Zod API 会随版本更新而变化，具体用法以官方文档为准
- 不要假设某个 API 仍然有效或行为未变，先查文档再写代码

### 代码示例

```ts
// packages/types/src/auth/index.ts
import { z } from "zod";

export const authSchema = z.object({
  email: z.email({ error: "Invalid email" }),
  password: z
    .string()
    .min(1, { error: "Password is required" })
    .min(8, { error: "Must be at least 8 characters" }),
});

export type AuthSchema = z.infer<typeof authSchema>;
```
