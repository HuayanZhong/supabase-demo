---
name: "mikro-orm-docs"
description: "查询 MikroORM 最新文档获取正确的 API 用法。在编写 Entity、Repository、Migration、Query 等 MikroORM 相关代码时自动触发，确保使用正确的装饰器 import 路径和 API 写法。"
---

# MikroORM 文档查询

当编写 MikroORM 相关代码时，使用此 skill 查询最新文档，避免使用过时的 API 写法。

## 何时使用

- 创建或修改 Entity（实体定义、装饰器）
- 编写 Repository（查询方法）
- 创建 Migration（数据库迁移）
- 编写复杂查询（QueryBuilder、EntityManager）
- 配置 MikroORM（连接、装饰器类型选择）

## 文档查询流程

### 1. 确定查询主题

根据任务类型选择对应的文档页面：

| 任务类型        | 文档 URL                                                   |
| --------------- | ---------------------------------------------------------- |
| Entity 定义     | https://mikro-orm.io/docs/using-decorators                 |
| 装饰器类型选择  | https://mikro-orm.io/docs/using-decorators#decorator-types |
| Repository 用法 | https://mikro-orm.io/docs/repositories                     |
| EntityManager   | https://mikro-orm.io/docs/entity-manager                   |
| QueryBuilder    | https://mikro-orm.io/docs/query-builder                    |
| Migration       | https://mikro-orm.io/docs/migrations                       |
| NestJS 集成     | https://mikro-orm.io/docs/usage-with-nestjs                |
| 配置选项        | https://mikro-orm.io/docs/configuration                    |

### 2. 使用 WebFetch 获取文档

```
WebFetch(url: "https://mikro-orm.io/docs/<topic>")
```

### 3. 关键注意事项

#### 装饰器 Import 路径

MikroORM v7 支持两种装饰器：

| 类型              | Import 路径                    | TypeScript 配置                |
| ----------------- | ------------------------------ | ------------------------------ |
| Legacy (实验性)   | `@mikro-orm/decorators/legacy` | `experimentalDecorators: true` |
| ES Spec (Stage 3) | `@mikro-orm/decorators/es`     | 无需特殊配置                   |

**本项目使用 Legacy 装饰器**，因为 `tsconfig.json` 配置了 `experimentalDecorators: true`。

#### PrimaryKey 类型

- 自增主键：`id!: number`
- UUID 主键：`id!: string`

#### NestJS 集成

```typescript
// 正确注入方式
constructor(
  private readonly em: EntityManager,
  @InjectRepository(Entity)
  private readonly repository: EntityRepository<Entity>,
) {}
```

不需要同时注入 `MikroORM` 和 `EntityManager`，`EntityManager` 已包含所有操作能力。

## 示例查询

### 查询 Entity 装饰器用法

```
WebFetch(url: "https://mikro-orm.io/docs/using-decorators")
```

关注：

- `@Entity()` 装饰器
- `@PrimaryKey()` 类型选择
- `@Property()` 选项（type、nullable、unique 等）
- 装饰器 import 路径

### 查询 Repository 用法

```
WebFetch(url: "https://mikro-orm.io/docs/repositories")
```

关注：

- `EntityRepository<T>` 泛型用法
- 自定义 Repository 方法
- `find()`、`findOne()`、`create()` 等方法签名

## CLI 命令参考

所有命令在 `apps/backend` 目录下执行，使用 `npx mikro-orm` 前缀。

### 迁移相关

```bash
# 创建迁移（根据实体变更生成 SQL）
npx mikro-orm migration:create

# 执行迁移（应用所有待执行的迁移）
npx mikro-orm migration:up

# 回滚最近一次迁移
npx mikro-orm migration:down

# 查看所有已执行的迁移
npx mikro-orm migration:list

# 检查是否有待执行的迁移
npx mikro-orm migration:check

# 查看待执行的迁移列表
npx mikro-orm migration:pending

# 清空数据库并重新执行所有迁移
npx mikro-orm migration:fresh

# 标记迁移为已执行（不实际运行）
npx mikro-orm migration:log

# 取消迁移的执行记录（不实际回滚）
npx mikro-orm migration:unlog
```

### Schema 管理

```bash
# 查看 schema 差异（输出 SQL，不执行）
npx mikro-orm schema:update --dump

# 更新数据库 schema（不生成迁移文件）
npx mikro-orm schema:update --run

# 删除数据库 schema
npx mikro-orm schema:drop --dump

# 重建 schema（删除并重建）
npx mikro-orm schema:fresh --run
```

### 调试与缓存

```bash
# 调试配置和连接信息
npx mikro-orm debug

# 清除元数据缓存
npx mikro-orm cache:clear

# 生成元数据缓存
npx mikro-orm cache:generate

# 导出实体发现结果（生成 barrel 文件）
npx mikro-orm discovery:export
```

### 注意事项

- 迁移文件存放在 `src/migrations` 目录
- 执行前确保 `.env` 中的 `DIRECT_URL` 或 `DATABASE_URL` 正确
- Supabase 项目需配置 `schemaGenerator.ignoreSchema` 忽略系统 schema
- 修改实体后工作流：`migration:create` → 检查生成的文件 → `migration:up`

## 常见问题速查

### Q: 为什么 import 报错？

A: 检查装饰器类型。本项目用 `@mikro-orm/decorators/legacy`，不是 `@mikro-orm/core`。

### Q: PrimaryKey 用什么类型？

A: 自增用 `number`，UUID 用 `string`。不要用 `string` 配自增主键。

### Q: 如何查询附近的位置？

A: 使用 PostGIS 扩展 + `ST_DWithin` 函数，或直接用经纬度计算。

### Q: 如何定义可选字段？

A: 使用 `@Property({ nullable: true })` 并声明为 `?: Type`。
