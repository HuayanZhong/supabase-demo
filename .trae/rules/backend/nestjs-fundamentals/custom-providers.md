---
alwaysApply: false
description: NestJS Custom Providers — useValue/useFactory/useExisting 等自定义提供器，涉及 @Inject 或非标准 Provider 注入时生效
---

# Custom Providers — 自定义提供器

官方文档：[https://docs.nestjs.com/fundamentals/custom-providers](https://docs.nestjs.com/fundamentals/custom-providers)

## 核心概念

DI 容器不仅支持类注入（`@Injectable()`），还支持多种 Provider 定义方式：

| 方式                        | 适用场景                           |
| --------------------------- | ---------------------------------- |
| `useValue` — 注入固定值     | 配置对象、常量                     |
| `useFactory` — 工厂函数创建 | 需要运行时条件决定如何创建         |
| `useExisting` — 别名        | 将现有 Provider 映射为另一个 token |

## 示例

```typescript
// 工厂注入
{ provide: 'DB_CONNECTION', useFactory: () => createConnection() }

// 值注入
{ provide: 'MAX_RETRY', useValue: 3 }
```

## 项目中的体现

`@Inject(CACHE_MANAGER)` 是一个 Custom Provider——`CACHE_MANAGER` 是 token，实例由 `CacheModule.register()` 注册到 DI 容器。
