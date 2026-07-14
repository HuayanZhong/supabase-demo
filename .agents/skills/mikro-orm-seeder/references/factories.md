# Entity Factory 编写

## 基本 Factory

```typescript
import { Factory } from "@mikro-orm/seeder";
import { faker } from "@faker-js/faker";
import { Location } from "../modules/locations/entities/location.entity";

export class LocationFactory extends Factory<Location> {
  model = Location;

  definition(): Partial<Location> {
    return {
      qweatherId: faker.string.numeric(9),
      name: faker.location.city(),
      lat: faker.number.float({ min: -90, max: 90, fractionDigits: 6 }),
      lon: faker.number.float({ min: -180, max: 180, fractionDigits: 6 }),
      adm2: faker.location.county(),
      adm1: faker.location.state(),
      country: "China",
      tz: faker.location.timeZone(),
    };
  }
}
```

> `@faker-js/faker` 需要单独安装（v6 起不再从 seeder 包导出）。

## Factory 使用方式

```typescript
// 创建 1 条（不持久化，只生成实例）
const location = new LocationFactory(em).makeOne();

// 创建 5 条（不持久化）
const locations = new LocationFactory(em).make(5);

// 创建 1 条并持久化
const location = await new LocationFactory(em).createOne();

// 创建 5 条并持久化
const locations = await new LocationFactory(em).create(5);

// 覆盖部分字段
const location = await new LocationFactory(em).createOne({ name: "北京" });
const locations = await new LocationFactory(em).create(5, { country: "Japan" });
```

## make vs create

| 方法       | 说明                           |
| ---------- | ------------------------------ |
| `make()`   | 生成实例，**不**持久化到数据库 |
| `create()` | 生成实例并 `persist` + `flush` |

每种方法都有 `One` 变体：`makeOne()` / `createOne()`。

## Factory 关系处理

### 方式一：通过 `.each()` 链式处理

```typescript
// ManyToOne / OneToOne
const books: Book[] = new BookFactory(em)
  .each((book) => {
    book.author = new AuthorFactory(em).makeOne();
  })
  .make(5);

// OneToMany / ManyToMany
const books: Book[] = new BookFactory(em)
  .each((book) => {
    book.owners.set(new OwnerFactory(em).make(5));
  })
  .make(5);
```

### 方式二：在 `definition()` 中构建嵌套实体

```typescript
export class AuthorFactory extends Factory<
  AuthorEntity,
  EntityData<AuthorEntity> & { booksCount?: number }
> {
  model = AuthorEntity;

  async definition(
    params?: EntityData<AuthorEntity> & { booksCount?: number },
  ): EntityData<AuthorEntity> {
    const name = params.name ?? faker.person.fullName();
    const books =
      params.books ??
      [...Array(params?.booksCount ?? 0)].map((v, i) =>
        new BookFactory(this.em).makeEntity({
          title: `${name} Trilogy - Part ${i + 1}`,
        }),
      );

    return {
      ...params,
      name,
      books,
    };
  }
}

// 使用
new AuthorFactory(em).createOne({ booksCount: 4 });
```

## 注意事项

- `@faker-js/faker` 已在 `catalog:backend` 中配置
- Factory 的 `definition()` 返回 `Partial<Entity>`，只需定义需要随机化的字段
- 文件命名：类名即文件名（`emit: 'ts'` 时）
