# 事务

## 方式一：通过 EntityManager

```typescript
await em.transactional(async (em) => {
  const user = em.create(User, { name: "John" });
  em.persist(user);
  // 如果抛异常，整个事务回滚
});
```

## 方式二：手动控制

```typescript
const tx = await em.begin();
try {
  // ... 操作
  await em.commit(tx);
} catch (e) {
  await em.rollback(tx);
  throw e;
}
```

## 在 NestJS 中使用

```typescript
@Injectable()
export class UserService {
  constructor(private readonly em: EntityManager) {}

  async createUser(data: CreateUserDto) {
    return this.em.transactional(async (em) => {
      const user = em.create(User, data);
      em.persist(user);
      return user;
    });
  }
}
```
