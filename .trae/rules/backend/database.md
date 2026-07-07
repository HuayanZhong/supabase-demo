---
alwaysApply: false
description: 数据库与 MikroORM 规范，涉及 Entity/Repository/迁移/查询时生效
---

## 实体与仓库

- 实体（Entity）使用 MikroORM 装饰器模式定义
- 仓库（Repository）继承 `EntityRepository<T>`，封装通用查询
- 迁移文件放置在 `packages/dal/migrations/`，通过 MikroORM CLI 生成
- 数据库连接信息从 `@supabase/config` 的环境变量读取
- 表名使用 snake_case，实体类名使用 PascalCase
- 避免 N+1 查询，使用 `populate` 或 `join` 预加载关联

## 数据库变更与回滚

- 所有 DDL 变更（建表、加列、加索引）必须通过 MikroORM 迁移文件完成，禁止手动执行 SQL
- 每次迁移前创建数据库快照或导出当前结构的备份 SQL（`pg_dump --schema-only`）
- 迁移文件必须提供 `up()` 和 `down()` 方法，确保可回滚
- 回滚步骤：
  1. 执行迁移的 `down()` 方法还原表结构
  2. 通过备份 SQL 恢复被删除的数据（如需）
  3. 清理对应的迁移记录
- 数据迁移（DML，如批量更新、数据转换）必须在事务中执行，失败时完全回滚
- 涉及 `DROP TABLE`、`TRUNCATE`、`ALTER COLUMN DROP` 的迁移，执行前必须向用户展示 SQL 内容并获确认
