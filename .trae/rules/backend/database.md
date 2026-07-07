---
alwaysApply: false
description: 数据库与 MikroORM 规范，涉及 Entity/Repository/迁移/查询时生效
---

- 实体（Entity）使用 MikroORM 装饰器模式定义
- 仓库（Repository）继承 `EntityRepository<T>`，封装通用查询
- 迁移文件放置在 `packages/dal/migrations/`，通过 MikroORM CLI 生成
- 数据库连接信息从 `@supabase/config` 的环境变量读取
- 表名使用 snake_case，实体类名使用 PascalCase
- 避免 N+1 查询，使用 `populate` 或 `join` 预加载关联
