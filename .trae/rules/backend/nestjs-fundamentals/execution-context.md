---
alwaysApply: false
description: NestJS Execution Context — 执行上下文，涉及 ArgumentsHost / ExecutionContext / 通用 Guard/Filter/Interceptor 时生效
---

# Execution Context — 执行上下文

官方文档：[https://docs.nestjs.com/fundamentals/execution-context](https://docs.nestjs.com/fundamentals/execution-context)

## 核心概念

Nest 提供 `ArgumentsHost` 和 `ExecutionContext` 两个工具类，用于编写跨 HTTP/Microservices/WebSocket 的通用组件（Guard/Filter/Interceptor）。

### ArgumentsHost

获取当前处理器的底层参数（请求、响应、next 等），支持在不同上下文间切换：

```typescript
// 在 ExceptionFilter 中
catch(exception: unknown, host: ArgumentsHost) {
  if (host.getType() === 'http') {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
  }
}
```

### ExecutionContext

继承自 ArgumentsHost，额外提供当前调用的控制器和方法信息：

```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const controller = context.getClass().name; // "WeathersController"
    const handler = context.getHandler().name; // "getWeather"
    return next.handle();
  }
}
```

## 使用场景

- 写通用的日志拦截器
- 写权限守卫
- 写全局异常过滤器
