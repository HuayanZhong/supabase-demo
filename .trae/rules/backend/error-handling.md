---
alwaysApply: false
description: 后端异常处理与错误响应规范，涉及 Exception Filter/业务错误码/API 错误响应时生效
---

## 统一错误响应格式

所有 API 错误响应必须使用与成功响应一致的包装结构：

```typescript
// 成功
{ code: 0, data: T, msg: "ok" }

// 失败
{ code: number, data: null, msg: string }
```

- `code`：业务错误码（正数），`0` 表示成功
- `data`：失败时固定为 `null`
- `msg`：人类可读的错误描述，使用中文

## 业务错误码体系

错误码按模块分段，通过枚举集中定义：

| 范围        | 模块     | 示例                               |
| ----------- | -------- | ---------------------------------- |
| `1001-1999` | 通用错误 | `1001` 参数校验失败                |
| `2001-2999` | 用户模块 | `2001` 用户不存在、`2002` 密码错误 |
| `3001-3999` | 项目模块 | `3001` 项目不存在                  |
| `4001-4999` | 文件模块 | `4001` 文件大小超限                |
| `5001-5999` | AI 模块  | `5001` LLM 调用超时                |

- 错误码定义在 `@supabase/types` 或独立的 `errors.ts` 文件中
- 禁止在 Controller/Service 中直接写数字字面量

## Exception Filter

- 使用 NestJS 的 `@Catch()` 装饰器实现全局 Exception Filter
- 至少实现以下 Filter：
  - **全局异常过滤器**：捕获所有未处理的 `Error`，返回 `{ code: 5000, data: null, msg: "服务器内部错误" }`
  - **业务异常过滤器**：捕获自定义 `BusinessException`，返回对应的业务错误码
  - **校验异常过滤器**：捕获 `ValidationError`，返回 `{ code: 1001, data: null, msg: "参数校验失败" }`
  - **HTTP 异常过滤器**：捕获 NestJS 内置 `HttpException`，将 HTTP 状态码映射为业务错误码

## 自定义业务异常

- 创建 `BusinessException` 类，继承 `HttpException`
- 构造函数接受两个参数：`errorCode: number` 和 `message: string`
- 内部统一使用 HTTP 状态码 `400`（业务异常在 HTTP 层面视为 Bad Request）

```typescript
export class BusinessException extends HttpException {
  constructor(errorCode: number, message: string) {
    super({ code: errorCode, data: null, msg: message }, 400);
  }
}
```

## 使用规范

- Service 层抛出 `BusinessException`，不捕获
- Controller 层不处理异常，由全局 Filter 统一拦截
- 不可预见的系统异常（数据库连接失败、文件读写错误等）由全局异常过滤器兜底
- 日志记录通过 `@nestjs/common` 的 `Logger` 或 Pino 完成，不在 Filter 中重复记录
