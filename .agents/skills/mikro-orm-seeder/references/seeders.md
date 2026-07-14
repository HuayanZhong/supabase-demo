# Seeder 编写

## 基本 Seeder

```typescript
import { Seeder } from "@mikro-orm/seeder";
import type { EntityManager } from "@mikro-orm/postgresql";
import { User } from "../modules/users/entities/user.entity";

export class UserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // em.create() 在 seeder 中默认启用 persistOnCreate，会自动 persist
    const user = em.create(User, {
      name: "John Snow",
      email: "snow@wall.st",
    });

    // 如果用构造函数创建，需要手动 persist
    // const user = new User();
    // user.name = 'John';
    // em.persist(user);
  }
}
```

> 注意：Seeder 的 `run()` 完成后会自动调用 `flush()` 和 `clear()`。

## 调用其他 Seeder

使用 `this.call()` 组合多个子 seeder，防止单个文件过大：

```typescript
import { Seeder } from "@mikro-orm/seeder";
import type { EntityManager } from "@mikro-orm/postgresql";
import { UserSeeder } from "./user.seeder";
import { BookSeeder } from "./book.seeder";

export class DatabaseSeeder extends Seeder {
  run(em: EntityManager): Promise<void> {
    return this.call(em, [UserSeeder, BookSeeder]);
  }
}
```

## 共享上下文（Shared Context）

当 seeder 之间需要引用彼此创建的实体时，使用第二个参数 `context`：

```typescript
// user.seeder.ts
export class UserSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    // 将实体保存到 context
    context.author = em.create(Author, {
      name: "John Snow",
      email: "snow@wall.st",
    });
  }
}

// book.seeder.ts
export class BookSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    // 使用 context 中的实体
    em.create(Book, {
      title: "My First Book",
      author: context.author,
    });
  }
}
```

`context` 在调用 `this.call()` 时自动创建，并传递给每个子 seeder。

## 使用 Factory 生成数据

```typescript
import { Seeder } from "@mikro-orm/seeder";
import type { EntityManager } from "@mikro-orm/postgresql";
import { AuthorFactory } from "../factories/author.factory";

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // 生成 10 条（不持久化）
    new AuthorFactory(em).make(10);

    // 生成 10 条并持久化
    await new AuthorFactory(em).create(10);
  }
}
```

## 项目中的 Seeder 文件

```
apps/backend/src/seeders/
├── database.seeder.ts       # DatabaseSeeder（入口，调用其他 seeder）
├── location.seeder.ts       # LocationSeeder
├── LocationFactory.ts       # Location 实体工厂
└── ...
```

## 注意事项

- Seeder 中通过 `this.call(em, [...])` 组合多个子 seeder
- Seeder 的 `run()` 完成后自动 `flush()` + `clear()`
- Seeder 中 `em.create()` 默认启用 `persistOnCreate`，无需手动 `persist`
- 共享上下文适合有依赖关系的 seeder（如 Book 依赖 Author）
