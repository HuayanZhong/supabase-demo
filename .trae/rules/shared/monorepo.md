---
alwaysApply: false
description: Monorepo 与依赖管理强制约束
scene: monorepo
---

# Monorepo 约束

- 共享代码必须放在 `packages/` 目录下，不得在 `apps/` 中重复定义
- 新增依赖必须通过 pnpm 安装，不得直接修改 `node_modules` 或 lock 文件
- 跨应用共享的依赖版本必须在 `pnpm-workspace.yaml` 的 `catalogs` 中统一管理，不得在各 app 中分别定义
