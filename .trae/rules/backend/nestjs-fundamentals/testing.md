---
alwaysApply: false
description: NestJS Testing — 单元测试与 e2e 测试，涉及 @nestjs/testing / Test.createTestingModule / 测试编写时生效
---

# Testing — 测试

官方文档：[https://docs.nestjs.com/fundamentals/testing](https://docs.nestjs.com/fundamentals/testing)

## 核心概念

Nest 提供 `@nestjs/testing` 包，可以创建隔离的测试模块来运行单元测试。

```typescript
import { Test } from "@nestjs/testing";

const moduleRef = await Test.createTestingModule({
  providers: [WeathersService],
}).compile();

const service = moduleRef.get(WeathersService);
```

## Mock 依赖

测试时可以替换真实依赖：

```typescript
const moduleRef = await Test.createTestingModule({
  providers: [WeathersService, { provide: QWeatherApiService, useValue: mockApiService }],
}).compile();
```

## 覆盖测试类型

| 类型     | 用途                        | 默认工具         |
| -------- | --------------------------- | ---------------- |
| 单元测试 | 测试单个 Service/Controller | Jest             |
| e2e 测试 | 测试完整 HTTP 请求链路      | Jest + Supertest |
