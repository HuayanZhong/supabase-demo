---
name: mikro-orm-seeder
description: "MikroORM 数据种子（Seeder）与实体工厂（Factory）使用指南。在需要创建测试数据、初始化数据库、编写 Seeder 或 Factory 时触发。"
---

# MikroORM Seeding 与 Entity Factories

当需要为数据库创建种子数据、测试数据或初始化数据时，使用此 skill。

## 何时使用

- 创建 Seeder（数据种子）
- 创建 Factory（实体工厂）
- 配置 seeder 路径
- 生成测试数据

## 配置

在 `mikro-orm.config.ts` 中：

```typescript
import { SeedManager } from "@mikro-orm/seeder";

export default defineConfig({
  extensions: [Migrator, SeedManager],
  seeder: {
    path: "dist/seeders", // 编译后的 JS 文件目录
    pathTs: "src/seeders", // TypeScript 源文件目录
    defaultSeeder: "DatabaseSeeder",
  },
});
```

## Seeder 编写

```typescript
import { Seeder } from "@mikro-orm/seeder";
import type { EntityManager } from "@mikro-orm/core";

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // 调用其他 seeder
    return this.call(em, [LocationSeeder, UserSeeder]);
  }
}
```

## Entity Factory 编写

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
      // ...
    };
  }
}
```

## Factory 使用方式

```typescript
// 创建 1 条（不持久化）
const location = new LocationFactory(em).makeOne();

// 创建 1 条并持久化
const location = await new LocationFactory(em).createOne();

// 创建 5 条并持久化
const locations = await new LocationFactory(em).create(5);

// 覆盖部分字段
const location = await new LocationFactory(em).createOne({ name: "北京" });
```

## 注意事项

- `@faker-js/faker` 已在 `catalog:backend` 中配置
- Factory 的 `definition()` 返回 `Partial<Entity>`，只需定义需要随机化的字段
- Seeder 中通过 `this.call(em, [...])` 组合多个子 seeder
- 文件命名：类名即文件名（`emit: 'ts'`）

## 文档查询

如需更详细的 API 用法，查询官方文档：

```
WebFetch(url: "https://mikro-orm.io/docs/seeding")
```
