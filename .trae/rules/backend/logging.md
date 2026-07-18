---
name: backend-logging
alwaysApply: false
description: 后端日志规范，涉及日志记录/日志级别/结构化日志时生效
---

## 日志库

- 使用 `pino` 作为日志框架，通过 `@supabase/config` 的环境变量配置日志级别
- 在 NestJS 中使用 `@nestjs/common` 的 `Logger` 或直接使用 Pino 实例
- 禁止使用 `console.log` / `console.error` 输出日志

## 日志级别

| 级别    | 使用场景                                   | 示例                         |
| ------- | ------------------------------------------ | ---------------------------- |
| `error` | 不可恢复的错误、异常捕获、外部服务调用失败 | 数据库连接失败、LLM 调用超时 |
| `warn`  | 可恢复的异常、非预期但非致命的情况         | 请求参数格式异常、重试操作   |
| `info`  | 关键业务流程节点、请求进出、状态变更       | 用户创建成功、订单状态变更   |
| `debug` | 开发调试信息，生产环境关闭                 | SQL 查询参数、中间件执行顺序 |
| `trace` | 详细追踪信息，仅在定位问题时临时开启       | 函数调用栈、循环迭代详情     |

## 结构化日志

- 所有日志必须使用结构化格式（JSON 对象），禁止字符串拼接
- 每个日志条目包含：`{ level, time, msg, reqId?, module?, ...context }`

## 请求追踪

- 使用 NestJS 中间件为每个请求注入唯一 `requestId`（UUID）
- `requestId` 通过 `cls-hooked` 或 `AsyncLocalStorage` 在请求链路中透传
- 所有与该请求相关的日志必须携带 `reqId` 字段

## 日志位置

- 开发环境：输出到控制台（`pino-pretty` 格式化）
- 生产环境：输出到 stdout，由容器运行时/PaaS 负责收集
- 禁止直接写日志到文件系统
