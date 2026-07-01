# Entity 骨架

适用：新建 MikroORM 数据库实体

## 输出文件

`apps/backend/src/{domain}/{entity-name}.entity.ts`

## 骨架内容

```typescript
import { Entity, PrimaryKey, Property, /* 按需引入关系装饰器 */ } from '@mikro-orm/core';

@Entity({ tableName: '{table_name}' })
export class {EntityName} {
  @PrimaryKey()
  id!: number;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  // --- 业务字段写在这里 ---
}
```

## 填充规则

| 占位           | 替换为                       |
| -------------- | ---------------------------- |
| `{domain}`     | 所属领域目录名，如 `goals`   |
| `{EntityName}` | PascalCase 实体名，如 `Goal` |
| `{table_name}` | snake_case 表名，如 `goals`  |

## 关系装饰器参考

| 关系   | 装饰器                                     |
| ------ | ------------------------------------------ |
| 一对一 | `@OneToOne(() => RelatedEntity)`           |
| 一对多 | `@OneToMany(() => RelatedEntity, 'field')` |
| 多对一 | `@ManyToOne(() => RelatedEntity)`          |
| 多对多 | `@ManyToMany(() => RelatedEntity)`         |

## 后处理

- 在对应 Module 的 `entities` 数组中注册
- 执行 migration:create 生成迁移文件
