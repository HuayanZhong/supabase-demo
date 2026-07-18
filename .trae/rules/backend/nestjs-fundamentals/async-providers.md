---
alwaysApply: false
description: NestJS Async Providers — 异步提供器，涉及需要等待异步操作完成再启动服务的场景时生效
---

# Async Providers — 异步提供器

官方文档：[https://docs.nestjs.com/fundamentals/async-providers](https://docs.nestjs.com/fundamentals/async-providers)

## 核心概念

有些依赖需要先执行异步操作（如连接数据库）才能被使用。通过 `useFactory` 返回 Promise 来实现。

```typescript
{ provide: 'DB_CONNECTION', useFactory: async () => {
  const conn = await createConnection(options);
  return conn;
}}
```

Nest 会等待 Promise resolve 后才继续启动流程，确保依赖就绪后再接受请求。
