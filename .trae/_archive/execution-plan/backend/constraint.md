# Constraint — 后端规划硬约束

## 模块约束

- 新增模块必须遵循标准 NestJS 结构：`entity → module → controller → service`
- 所有 API 路由前缀必须为 `/api`，统一响应格式 `{code, data, msg}`
- Controller 层不得包含业务逻辑，只做路由和请求响应分发
- 不得自行 try-catch，全局异常由 AllExceptionsFilter 托管

## 数据约束

- 新增实体前，必须通过 `supabase MCP → list_tables` 确认表结构中是否已有对应表
- 涉及表结构变更时，必须通过 `supabase MCP → list_migrations` 查看当前迁移状态
- 新增 Migration 必须使用 MikroORM Migrator，不得手写 SQL
- 实体字段类型必须与数据库列类型对齐（通过 `execute_sql` 验证）

## 依赖约束

- 新增模块若依赖其他模块的 Entity，必须先确认目标模块已导出了对应 Entity
- 跨模块引用 Entity 必须通过 Module 的 `exports` 导出，不得直接 import Entity 文件

## 范围约束

- 不得修改 `apps/frontend/` 下的代码
- 不得直接修改 `packages/types/` 下的类型定义（需报 shared 路由处理）
- 不得在前端直接使用后端 API 的原始响应（应通过 composable 或 API 层封装）
