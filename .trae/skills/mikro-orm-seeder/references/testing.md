# 在测试中使用 Seeder

## 基本用法

```typescript
import { MikroORM } from "@mikro-orm/postgresql";
import { DatabaseSeeder } from "../src/seeders/database.seeder";

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init({
    /* ... */
  });

  // 重置数据库
  await orm.schema.refresh();

  // 运行 seeder
  await orm.seeder.seed(DatabaseSeeder);
});

afterAll(async () => {
  await orm.close();
});
```

## 使用 Factory 创建测试数据

```typescript
import { MikroORM } from "@mikro-orm/postgresql";
import { UserFactory } from "../src/seeders/UserFactory";

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init({
    /* ... */
  });
});

beforeEach(async () => {
  // 清空数据库
  await orm.schema.clearDatabase();
});

afterAll(async () => {
  await orm.close();
});

test("should create user", async () => {
  const em = orm.em.fork();

  // 使用 Factory 创建测试数据
  const user = await new UserFactory(em).createOne({
    name: "Test User",
    email: "test@example.com",
  });

  expect(user.id).toBeDefined();
  expect(user.name).toBe("Test User");
});
```

## 测试最佳实践

1. **隔离测试数据**：每个测试用例前清空数据库
2. **使用 Factory**：避免硬编码测试数据
3. **使用 `em.fork()`**：确保每个测试有独立的 EntityManager
4. **清理资源**：在 `afterAll` 中关闭 ORM 连接

## 注意事项

- 测试环境建议使用独立的数据库或 schema
- 可以使用 `orm.schema.clearDatabase()` 清空所有表
- 使用 `orm.schema.refresh()` 会删除并重建所有表
- Factory 的 `make()` 方法适合创建不持久化的测试数据
- Factory 的 `create()` 方法适合创建需要持久化的测试数据
