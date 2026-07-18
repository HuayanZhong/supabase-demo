---
alwaysApply: false
description: NestJS Platform Agnosticism — 平台无关，涉及切换 Express/Fastify 或跨 HTTP/Microservices/WebSocket 复用代码时生效
---

# Platform Agnosticism — 平台无关

官方文档：[https://docs.nestjs.com/fundamentals/platform-agnosticism](https://docs.nestjs.com/fundamentals/platform-agnosticism)

## 核心概念

Nest 的 Controller/Service/Module 不绑定特定 HTTP 引擎，可以在 Express 和 Fastify 之间切换：

```typescript
// Express（默认）
const app = await NestFactory.create(AppModule);

// Fastify
const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
```

## 更广泛的平台无关

同一套 Provider 和 Module 还可以用于：

- Microservices（不同传输层：TCP、Redis、NATS、MQTT、RabbitMQ、Kafka、gRPC）
- WebSocket Gateways
- GraphQL
- Standalone 应用（CRON 任务、CLI 工具）

## 注意

- 避免在业务代码中直接使用 Express 特有的 API（`@Req()` / `@Res()` 会破坏平台无关性）
- 优先使用 Nest 提供的装饰器（`@Body()`，`@Param()`，`@Query()` 等）
