---
name: "mikro-orm-docs"
description: "查询 MikroORM 最新文档获取正确的 API 用法。在编写 Entity、Repository、Migration、Query 等 MikroORM 相关代码时自动触发，确保使用正确的装饰器 import 路径和 API 写法。"
---

# MikroORM 文档查询

当编写 MikroORM 相关代码时，使用此 skill 查询最新文档，避免使用过时的 API 写法。

## 何时使用

- 创建或修改 Entity（实体定义、装饰器、关系）
- 编写 Repository（查询方法、自定义 Repository）
- 创建 Migration（数据库迁移）
- 编写复杂查询（QueryBuilder、EntityManager）
- 配置 MikroORM（连接、装饰器类型选择）
- NestJS 集成（模块注册、请求作用域、关闭钩子）

## 文档查询流程

### 1. 确定查询主题

根据任务类型选择对应的文档页面：

| 任务类型        | 文档 URL                                                   |
| --------------- | ---------------------------------------------------------- |
| Entity 定义     | https://mikro-orm.io/docs/using-decorators                 |
| 装饰器类型选择  | https://mikro-orm.io/docs/using-decorators#decorator-types |
| defineEntity    | https://mikro-orm.io/docs/define-entity                    |
| 关系定义        | https://mikro-orm.io/docs/relationships                    |
| Repository 用法 | https://mikro-orm.io/docs/repositories                     |
| EntityManager   | https://mikro-orm.io/docs/entity-manager                   |
| QueryBuilder    | https://mikro-orm.io/docs/query-builder                    |
| 查询条件        | https://mikro-orm.io/docs/query-conditions                 |
| 事务            | https://mikro-orm.io/docs/transactions                     |
| Migration       | https://mikro-orm.io/docs/migrations                       |
| NestJS 集成     | https://mikro-orm.io/docs/usage-with-nestjs                |
| 配置选项        | https://mikro-orm.io/docs/configuration                    |
| Seeding         | https://mikro-orm.io/docs/seeding                          |
| 元数据提供者    | https://mikro-orm.io/docs/metadata-providers               |
| 日志            | https://mikro-orm.io/docs/logging                          |

### 2. 使用 WebFetch 获取文档

```
WebFetch(url: "https://mikro-orm.io/docs/<topic>")
```

## Reference Guide

按需加载详细参考文档：

| 主题                 | Reference                      | 加载时机                     |
| -------------------- | ------------------------------ | ---------------------------- |
| 装饰器与 Entity 定义 | `references/decorators.md`     | 创建/修改 Entity 时          |
| EntityManager 用法   | `references/entity-manager.md` | 编写查询、持久化操作时       |
| Repository 用法      | `references/repository.md`     | 编写自定义 Repository 时     |
| QueryBuilder 用法    | `references/query-builder.md`  | 编写复杂查询、JOIN、子查询时 |
| 事务处理             | `references/transactions.md`   | 需要事务操作时               |
| NestJS 集成          | `references/nestjs.md`         | NestJS 模块注册、注入时      |
| CLI 命令             | `references/cli.md`            | 使用 MikroORM CLI 时         |
| 配置选项             | `references/configuration.md`  | 配置 MikroORM 时             |
| 常见问题             | `references/faq.md`            | 遇到错误或不确定的 API 时    |

## 关键注意事项

### 装饰器 Import 路径

MikroORM v7 支持两种装饰器：

| 类型              | Import 路径                    | TypeScript 配置                |
| ----------------- | ------------------------------ | ------------------------------ |
| Legacy (实验性)   | `@mikro-orm/decorators/legacy` | `experimentalDecorators: true` |
| ES Spec (Stage 3) | `@mikro-orm/decorators/es`     | 无需特殊配置                   |

**本项目使用 Legacy 装饰器**，因为 `tsconfig.json` 配置了 `experimentalDecorators: true`。

### PrimaryKey 类型

- 自增主键：`id!: number`
- UUID 主键：`id!: string`

### NestJS 集成

```typescript
// 正确注入方式
constructor(
  private readonly em: EntityManager,
  @InjectRepository(Entity)
  private readonly repository: EntityRepository<Entity>,
) {}
```

不需要同时注入 `MikroORM` 和 `EntityManager`，`EntityManager` 已包含所有操作能力。

## 约束

### MUST DO

- 使用 `@mikro-orm/decorators/legacy` 导入装饰器
- 使用 `TsMorphMetadataProvider` 作为元数据提供者
- Supabase 项目配置 `schemaGenerator.ignoreSchema` 忽略系统 schema
- 迁移文件存放在 `src/migrations` 目录
- Seeder 文件存放在 `src/seeders` 目录

### MUST NOT DO

- 不要使用 `@mikro-orm/core` 导入装饰器（v7 已移除）
- 不要硬编码数据库连接字符串，使用环境变量
- 不要在生产环境启用 `debug: true`
- 不要手动编辑迁移文件中的 Supabase 系统表 SQL

## 相关 Skills

- **mikro-orm-seeder** - 数据种子与实体工厂
