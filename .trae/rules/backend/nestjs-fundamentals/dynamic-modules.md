---
alwaysApply: false
description: NestJS Dynamic Modules — 动态模块，涉及 CacheModule.register() / forRoot / forFeature / registerAsync 等动态配置模块时生效
---

# Dynamic Modules — 动态模块

官方文档：[https://docs.nestjs.com/fundamentals/dynamic-modules](https://docs.nestjs.com/fundamentals/dynamic-modules)

## 核心概念

静态模块的功能在编译时就固定了；动态模块允许在导入时传入参数来改变行为。

```typescript
// 静态模块
@Module({ providers: [A], exports: [A] })
class StaticModule {}

// 动态模块（传参配置）
CacheModule.register({ ttl: 30 * 60 * 1000, max: 100 });
```

## 命名约定

| 方法                                  | 用途                     |
| ------------------------------------- | ------------------------ |
| `.register(options)`                  | 同步配置                 |
| `.registerAsync({ useFactory: ... })` | 异步配置（配合环境变量） |
| `.forRoot(options)`                   | 全局唯一一次注册         |
| `.forFeature(options)`                | 各子模块独立配置         |

## 项目中的体现

```typescript
CacheModule.register({ ttl: 30 * 60 * 1000, max: 100 });
```
