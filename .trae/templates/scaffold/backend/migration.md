# Migration 骨架

适用：Entity 变更后生成数据库迁移

## 流程

1. 确认 Entity 文件已按 entity.md 骨架规范修改完毕
2. 在项目根目录执行 `pnpm --filter @supabase/backend exec mikro-orm migration:create`
3. 检查生成的 migration 文件内容
4. 执行 `pnpm --filter @supabase/backend exec mikro-orm migration:up` 验证

## 后处理

- 删除 migration 前的备份 Entity（如自动生成的备份文件）
- 在 Module 的 `entities` 数组中注册新实体
- 如果涉及数据迁移（改字段类型/删字段），手动编辑 migration 文件补充 SQL

## 安全规则

| 操作       | 约束                                       |
| ---------- | ------------------------------------------ |
| 新增表     | 无特殊要求                                 |
| 加字段     | 设为 nullable 或提供默认值，不阻塞现有数据 |
| 改字段类型 | 确认无数据丢失，手动编写 cast SQL          |
| 删字段/表  | 标注高风险操作，确认无误后再提交流程       |
