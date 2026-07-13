# Repository 用法

## 基本用法

```typescript
// 获取 Repository
const userRepo = em.getRepository(User);

// 查询
const users = await userRepo.find({ age: { $gt: 18 } });

// 创建
const user = userRepo.create({ name: "John", email: "john@example.com" });
```

## 自定义 Repository

```typescript
import { EntityRepository } from "@mikro-orm/postgresql";

export class CustomUserRepository extends EntityRepository<User> {
  async findActive(): Promise<User[]> {
    return this.find({ active: true });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email });
  }
}
```

在 Entity 中注册：

```typescript
import { EntityRepositoryType } from "@mikro-orm/core";

@Entity({ repository: () => CustomUserRepository })
export class User {
  [EntityRepositoryType]?: CustomUserRepository;
  // ...
}
```

## 泛型基础 Repository

```typescript
import { EntityRepository, EntityManager } from "@mikro-orm/postgresql";

export class BaseRepository<Entity extends object> extends EntityRepository<Entity> {
  async exists(where: FilterQuery<Entity>): Promise<boolean> {
    const count = await this.count(where);
    return count > 0;
  }

  async findOrCreate(
    where: FilterQuery<Entity>,
    data: RequiredEntityData<Entity>,
  ): Promise<Entity> {
    let entity = await this.findOne(where);
    if (!entity) {
      entity = this.create(data);
      await this.em.flush();
    }
    return entity;
  }
}
```

全局注册：

```typescript
MikroORM.init({
  entityRepository: BaseRepository,
});
```

> v6 起 Repository 移除了 `persist`、`persistAndFlush`、`remove`、`removeAndFlush`、`flush` 方法，需通过 `em` 或 `repository.getEntityManager()` 操作。
