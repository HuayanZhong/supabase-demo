---
alwaysApply: false
description: NestJS Injection Scopes — 注入作用域 DEFAULT/REQUEST/TRANSIENT，涉及 Provider 生命周期、请求级实例时生效
---

# Injection Scopes — 注入作用域

官方文档：[https://docs.nestjs.com/fundamentals/injection-scopes](https://docs.nestjs.com/fundamentals/injection-scopes)

## 核心概念

Provider 实例的生命周期控制：

| 作用域            | 行为                           | 适用场景                               |
| ----------------- | ------------------------------ | -------------------------------------- |
| `DEFAULT`（默认） | 整个应用一个实例，所有请求共享 | Service、数据库连接等无状态组件        |
| `REQUEST`         | 每个请求新建一个，用完销毁     | 多租户、请求级上下文、GraphQL 请求缓存 |
| `TRANSIENT`       | 每次注入都新建一个             | 有状态工具类                           |

```typescript
@Injectable({ scope: Scope.REQUEST })
export class SomeService {}
```

## 注意

- REST API 场景下，REQUEST 作用域会影响性能（每次请求都要实例化）
- 绝大多数场景用默认 `DEFAULT` 单例即可，不要滥用 scoped provider
