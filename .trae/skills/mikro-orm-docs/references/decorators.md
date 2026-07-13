# 装饰器与 Entity 定义

## 装饰器 Import 路径

MikroORM v7 支持两种装饰器：

| 类型              | Import 路径                    | TypeScript 配置                |
| ----------------- | ------------------------------ | ------------------------------ |
| Legacy (实验性)   | `@mikro-orm/decorators/legacy` | `experimentalDecorators: true` |
| ES Spec (Stage 3) | `@mikro-orm/decorators/es`     | 无需特殊配置                   |

**本项目使用 Legacy 装饰器**，因为 `tsconfig.json` 配置了 `experimentalDecorators: true`。

> v6 → v7 迁移：装饰器从 `@mikro-orm/core` 移到了 `@mikro-orm/decorators/legacy`。

## 元数据提供者

| 提供者                    | 特点                                         | 适用场景   |
| ------------------------- | -------------------------------------------- | ---------- |
| `TsMorphMetadataProvider` | 从 TS 源码推断类型，DRY，较慢                | 本项目使用 |
| `ReflectMetadataProvider` | 需要 `emitDecoratorMetadata`，快但需显式声明 | 大型项目   |

本项目使用 `TsMorphMetadataProvider`（来自 `@mikro-orm/reflection`），可自动推断 nullable、关系目标类型、Ref wrapper 等。

## 基本装饰器

```typescript
import { Entity, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ unique: true })
  email!: string;

  @Property({ nullable: true })
  age?: number;

  @Property({ type: "text" })
  bio!: string;

  @Property({ type: "decimal", precision: 10, scale: 6 })
  latitude!: number;

  @Property({ default: "active" })
  status!: string;

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ onUpdate: () => new Date() })
  updatedAt!: Date;
}
```

## PrimaryKey 类型

- 自增主键：`id!: number`
- UUID 主键：`id!: string`（配合 `@PrimaryKey({ type: 'uuid' })` 或使用 `uuid_v4`）

## 关系装饰器

```typescript
import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  OneToOne,
  ManyToMany,
  Collection,
} from "@mikro-orm/decorators/legacy";

@Entity()
export class Author {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  // ManyToOne：多对一
  @ManyToOne(() => Publisher, { nullable: true })
  publisher?: Publisher;

  // OneToMany：一对多（必须声明为 Collection）
  @OneToMany(() => Book, (book) => book.author)
  books = new Collection<Book>(this);

  // OneToOne：一对一
  @OneToOne(() => Profile, { owner: true, nullable: true })
  profile?: Profile;

  // ManyToMany：多对多
  @ManyToMany(() => Tag)
  tags = new Collection<Tag>(this);
}
```

**关键规则**：

- `OneToMany` 和 `ManyToMany` 必须初始化为 `new Collection(this)`
- `ManyToOne` 和 `OneToOne` 可以直接赋值实体或引用
- ts-morph 模式下可省略 `() => Entity` 和 `{ nullable: true }`，自动推断

## Ref Wrapper（类型安全关系）

```typescript
import { Ref } from "@mikro-orm/core";

@Entity()
export class Book {
  @ManyToOne(() => Author, { ref: true })
  author!: Ref<Author>;
}

// 使用
book.author.unwrap(); // 获取原始实体
book.author.id; // 直接访问主键
```
