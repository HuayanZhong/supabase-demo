---
alwaysApply: false
description: NestJS Circular Dependency — 循环依赖，涉及 forwardRef / ModuleRef 解决模块或 Provider 之间相互依赖时生效
---

# Circular Dependency — 循环依赖

官方文档：[https://docs.nestjs.com/fundamentals/circular-dependency](https://docs.nestjs.com/fundamentals/circular-dependency)

## 核心概念

A 依赖 B、B 依赖 A，导致 DI 容器无法决定创建顺序。

### 解法一：forwardRef()

```typescript
@Injectable()
export class ServiceA {
  constructor(
    @Inject(forwardRef(() => ServiceB))
    private serviceB: ServiceB,
  ) {}
}
```

### 解法二：ModuleRef（启动完成后获取）

```typescript
constructor(private moduleRef: ModuleRef) {}
async onModuleInit() {
  const serviceB = this.moduleRef.get(ServiceB);
}
```

## 注意

- 模块间的循环依赖也用 `forwardRef()`
- `barrel files`（`index.ts`）容易引发循环依赖，避免在同一个目录下用 barrel import
- 不要在构造函数里调用对方方法，创建顺序不确定
