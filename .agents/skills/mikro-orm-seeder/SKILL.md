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
- 在测试中使用 seed 数据
- 处理 Factory 之间的关系

## Reference Guide

按需加载详细参考文档：

| 主题         | Reference                     | 加载时机                        |
| ------------ | ----------------------------- | ------------------------------- |
| Seeder 配置  | `references/configuration.md` | 配置 seeder 路径、环境变量时    |
| Seeder 编写  | `references/seeders.md`       | 编写 Seeder、组合多个 Seeder 时 |
| Factory 编写 | `references/factories.md`     | 编写 Factory、处理关系时        |
| CLI 命令     | `references/cli.md`           | 使用 seeder CLI 命令时          |
| 测试使用     | `references/testing.md`       | 在测试中使用 Seeder/Factory 时  |

## 快速开始

### 1. 配置 Seeder

在 `mikro-orm.config.ts` 中注册 `SeedManager`：

```typescript
import { SeedManager } from "@mikro-orm/seeder";

export default defineConfig({
  extensions: [Migrator, SeedManager],
  seeder: {
    path: "dist/seeders",
    pathTs: "src/seeders",
    defaultSeeder: "DatabaseSeeder",
  },
});
```

### 2. 创建 Seeder

```typescript
import { Seeder } from "@mikro-orm/seeder";
import type { EntityManager } from "@mikro-orm/postgresql";
import { User } from "../modules/users/entities/user.entity";

export class UserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    em.create(User, {
      name: "John Snow",
      email: "snow@wall.st",
    });
  }
}
```

### 3. 创建 Factory

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
    };
  }
}
```

### 4. 使用 Factory

```typescript
// 生成 5 条并持久化
await new LocationFactory(em).create(5);

// 覆盖部分字段
await new LocationFactory(em).createOne({ name: "北京" });
```

## CLI 命令

```bash
# 运行默认 seeder
npx mikro-orm seeder:run

# 运行指定 seeder
npx mikro-orm seeder:run --class=BookSeeder

# 创建新的 seeder 文件
npx mikro-orm seeder:create DatabaseSeeder

# 重建数据库并运行 seeder
npx mikro-orm migration:fresh --seed
```

## 约束

### MUST DO

- 使用 `@mikro-orm/seeder` 导入 Seeder 和 Factory
- 在配置中注册 `SeedManager` 扩展
- `@faker-js/faker` 已在 `catalog:backend` 中配置
- Seeder 文件存放在 `src/seeders` 目录

### MUST NOT DO

- 不要在 Seeder 中硬编码大量测试数据，使用 Factory 生成
- 不要手动调用 `em.flush()`，Seeder 完成后会自动 flush
- 不要在生产环境运行 seeder（除非是初始化脚本）

## 相关 Skills

- **mikro-orm-docs** - MikroORM 核心文档
