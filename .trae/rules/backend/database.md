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
- 实体必须使用 `[OptionalProps]` 标记可选属性（如 `createdAt`、`updatedAt`、`id`），确保 `repository.create()` 类型安全

## Service 层 CRUD 统一写法

**创建实体**：统一使用 `repository.create()` + `em.persist().flush()`

```typescript
// ✅ 正确写法
async create(dto: CreateEntityDto): Promise<Entity> {
  const entity = this.repository.create(dto);
  await this.em.persist(entity).flush();
  return entity;
}

// ❌ 错误写法（不要使用）
const entity = new Entity();
this.em.assign(entity, dto);
await this.em.persist(entity).flush();
```

**更新实体**：使用 `em.assign()` + `em.flush()`

```typescript
async update(id: number, dto: UpdateEntityDto): Promise<Entity> {
  const entity = await this.findOne(id);
  this.em.assign(entity, dto);
  await this.em.flush();
  return entity;
}
```

**删除实体**：使用 `em.remove().flush()`

```typescript
async remove(id: number): Promise<{ deleted: true }> {
  const entity = await this.findOne(id);
  await this.em.remove(entity).flush();
  return { deleted: true };
}
```

**查询实体**：使用 `repository.findOne(id)` 直接传 ID

```typescript
async findOne(id: number): Promise<Entity> {
  const entity = await this.repository.findOne(id);
  if (!entity) {
    throw new NotFoundException(`实体 #${id} 不存在`);
  }
  return entity;
}
```

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
