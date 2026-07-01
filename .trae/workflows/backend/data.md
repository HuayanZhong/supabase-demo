# 数据模型/实体/Migration

## 触发条件

- 任务类型匹配：backend → data
- 关键词：数据模型、实体、Migration、表结构、字段、索引、关系

## 准备工作

| 资源                                     | 说明                                      |
| ---------------------------------------- | ----------------------------------------- |
| `skill/supabase`                         | Supabase 使用指南                         |
| `skill/supabase-postgres-best-practices` | Postgres 优化指南                         |
| `skill/turborepo`                        | 构建配置                                  |
| supabase MCP                             | **必要**—查表结构、执行 SQL、查看迁移历史 |
| `execution-plan/backend/`                | 规划指引：约束/最佳实践/决策策略          |
| `execution-engine/backend/`              | 执行指引：约束/最佳实践/决策策略          |

## 执行步骤

### Step 1: 设计数据模型

- 明确 Entity 的：
  - **字段**：名称、类型（string/number/boolean/Date/json）、默认值、是否 nullable
  - **主键**：使用 `@PrimaryKey()` 或 `@SerializedPrimaryKey()`
  - **关系**：`@ManyToOne()` / `@OneToMany()` / `@OneToOne()` / `@ManyToMany()`
  - **索引**：`@Index()` 标记查询频繁的字段
  - **唯一约束**：`@Unique()` 标记需要唯一性的字段组合
- 参考现有 Entity 的设计模式（位于 `apps/backend/src/modules/*/entities/`）

### Step 2: 检查现有表结构

使用 supabase MCP 检查数据库当前状态：

- `list_tables` — 查看所有表，确认表名是否已存在
- `list_migrations` — 查看迁移历史，确认当前 schema 版本
- `list_extensions` — 确认所需 Postgres 扩展是否已启用
- `execute_sql` — 执行 `SELECT * FROM information_schema.columns WHERE table_name = '...'` 查看现有列

### Step 3: 修改 Entity

- 使用 MikroORM 装饰器定义/修改 Entity：

  ```typescript
  @Entity({ tableName: "table_name" })
  export class SomeEntity {
    @PrimaryKey()
    id!: number;

    @Property({ type: "string", length: 255 })
    name!: string;

    @Property({ type: "datetime", nullable: true })
    deletedAt?: Date;

    @ManyToOne(() => RelatedEntity)
    related!: RelatedEntity;
  }
  ```

- 多个文件的话使用 barrel exports（`index.ts`）

### Step 4: 同步 Migration

- 生成 Migration：
  ```bash
  cd apps/backend
  npx mikro-orm migration:create --name <描述性名称>
  ```
- 检查生成的 Migration SQL 是否正确（文件位于 `apps/backend/src/migrations/`）
- 应用 Migration：
  ```bash
  npx mikro-orm migration:up
  ```
- 验证：
  - 使用 supabase MCP `execute_sql` 执行以下 SQL 确认表结构：
    ```sql
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_name = '<table_name>'
    ORDER BY ordinal_position;
    ```
  - 使用 supabase MCP `list_migrations` 确认迁移已记录

## 完成检查

- [ ] Entity 定义正确（字段、关系、索引符合设计）
- [ ] 表结构已通过 Migration 同步到数据库
- [ ] Migration SQL 正确无误（无意外 DROP、无破坏性变更）
- [ ] 未启用不必要的 Postgres 扩展
- [ ] 编译通过
- [ ] 相关 Entity 已注册到 MikroORM 配置中

## 输出

- 新增/修改的 Entity 文件
- 新增的 Migration 文件
- 如涉及共享类型，同步更新 `packages/types/`
