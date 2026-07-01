# Controller 骨架

适用：新建或扩展 NestJS Controller

## 输出文件

`apps/backend/src/{domain}/{domain}.controller.ts`

## 骨架内容

```typescript
import { Controller, Get, Post, Body, Param, /* 按需引入 */ } from '@nestjs/common';
import { {ServiceName} } from './{domain}.service';

@Controller('{route_prefix}')
export class {ControllerName} {
  constructor(private readonly {serviceInstance}: {ServiceName}) {}

  // --- 业务端点写在这里 ---
}
```

## 端点方法参考

```typescript
@Get()                          // GET /{route_prefix}
@Get(':id')                     // GET /{route_prefix}/:id
@Post()                         // POST /{route_prefix}
@Patch(':id')                   // PATCH /{route_prefix}/:id
@Delete(':id')                  // DELETE /{route_prefix}/:id
```

## 填充规则

| 占位                | 替换为                           |
| ------------------- | -------------------------------- |
| `{domain}`          | 所属领域目录名，如 `goals`       |
| `{ControllerName}`  | PascalCase，如 `GoalsController` |
| `{ServiceName}`     | PascalCase，如 `GoalsService`    |
| `{serviceInstance}` | camelCase，如 `goalsService`     |
| `{route_prefix}`    | kebab-case API 路径，如 `goals`  |

## 响应格式

无需手动包装响应，全局 `TransformInterceptor` 会自动包装为 `{ code, data, msg }`。
