---
alwaysApply: false
description: 依赖管理规范，涉及添加/升级依赖时生效
---

- 新增依赖必须在 `pnpm-workspace.yaml` 的 `catalog` 中定义版本号，子包 `package.json` 引用 `catalog:*`
- 禁止在子包 `package.json` 中硬编码版本号（如 `"pino": "^9.0.0"` 而非 `"pino": "catalog:logger"`）
- 生产依赖和开发依赖分属不同 catalog 分组（`backend` / `frontend` / `dev` / `test` / `logger`）
- 升级依赖只需改 `pnpm-workspace.yaml` 中对应 catalog 的版本号，然后执行 `pnpm install`
- 移除依赖时，同时清理子包 `package.json` 和 catalog（如无其他子包引用）
- 添加依赖前先检查是否已有同类依赖可用（如同一个日志库、同一个 UI 组件库），避免引入重复功能的包
