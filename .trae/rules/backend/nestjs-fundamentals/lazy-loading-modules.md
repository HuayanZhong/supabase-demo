---
alwaysApply: false
description: NestJS Lazy Loading Modules — 懒加载模块，涉及 Serverless 冷启动优化 / 按需加载模块时生效
---

# Lazy Loading Modules — 懒加载模块

官方文档：[https://docs.nestjs.com/fundamentals/lazy-loading-modules](https://docs.nestjs.com/fundamentals/lazy-loading-modules)

## 核心概念

默认所有模块在应用启动时全部加载（eager loading）。懒加载可以按需加载，主要优化 Serverless 冷启动。

```typescript
const { LazyModule } = await import("./lazy.module");
const moduleRef = await this.lazyModuleLoader.load(() => LazyModule);
```

## 注意

- 懒加载的模块**不支持** Controller/GraphQL Resolver/WebSocket Gateway
- 懒加载的模块**不支持** MiddlewareConsumer
- 一次性加载后会被缓存，后续调用返回缓存实例
- 常规单体应用不需要此功能
