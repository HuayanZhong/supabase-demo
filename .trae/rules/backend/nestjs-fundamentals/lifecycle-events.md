---
alwaysApply: false
description: NestJS Lifecycle Events — 生命周期钩子，涉及 onModuleInit / onApplicationBootstrap / 应用启动关闭事件时生效
---

# Lifecycle Events — 生命周期钩子

官方文档：[https://docs.nestjs.com/fundamentals/lifecycle-events](https://docs.nestjs.com/fundamentals/lifecycle-events)

## 核心概念

Nest 提供了在应用启动和关闭时执行代码的钩子方法。

### 常用钩子与触发顺序

| 钩子                       | 时机                         | 用途                 |
| -------------------------- | ---------------------------- | -------------------- |
| `onModuleInit()`           | 模块依赖解析完成后           | 预热缓存、初始化连接 |
| `onApplicationBootstrap()` | 所有模块初始化完，开始监听前 | 数据预加载           |
| `onModuleDestroy()`        | 收到终止信号时               | 优雅关闭连接         |
| `onApplicationShutdown()`  | 所有连接关闭后               | 资源清理             |

```typescript
@Injectable()
export class WeathersService implements OnModuleInit {
  async onModuleInit() {
    // 启动时预热缓存、检查上游依赖
  }
}
```

### 异步初始化

钩子方法可以返回 Promise 或使用 async/await，Nest 会等待完成：

```typescript
async onModuleInit(): Promise<void> {
  await this.fetch();
}
```

### 优雅关闭

需要在 `main.ts` 中启用：

```typescript
const app = await NestFactory.create(AppModule);
app.enableShutdownHooks();
await app.listen(3000);
```

Windows 上 SIGTERM 不可用，SIGINT/SIGBREAK 可用。
