---
alwaysApply: false
description: NestJS ModuleRef — 模块引用，涉及在运行时从 DI 容器动态获取 Provider 或创建实例时生效
---

# Module Ref — 模块引用

官方文档：[https://docs.nestjs.com/fundamentals/module-ref](https://docs.nestjs.com/fundamentals/module-ref)

## 核心概念

`ModuleRef` 允许在运行时从 DI 容器按需获取 Provider，或动态创建未注册的类。

```typescript
@Injectable()
export class SomeService implements OnModuleInit {
  constructor(private moduleRef: ModuleRef) {}

  async onModuleInit() {
    // 获取已注册的 Provider
    const service = this.moduleRef.get(SomeService);

    // 获取全局模块中的 Provider
    const globalService = this.moduleRef.get(GlobalService, { strict: false });

    // 动态创建未注册的类
    const factory = await this.moduleRef.create(SomeFactory);
  }
}
```

## 与 new 的区别

`moduleRef.get()` 拿到的是 Nest 已实例化、依赖已注入完毕的对象，而不是手动 new 出来的。
