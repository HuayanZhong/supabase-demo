---
alwaysApply: false
description: NestJS 后端开发规范，涉及 Controller/Service/Module/DTO 时生效
---

## Controller

- Controller 只做路由转发，不包含业务逻辑
- Controller 文件命名：`*.controller.ts`
- 使用 `@nestjs/swagger` 装饰器（`@ApiTags`、`@ApiOperation`、`@ApiParam`、`@ApiBody`、`@ApiResponse`）为每个端点添加文档描述
- `@ApiResponse` 必须标注可能的错误状态码和对应的业务错误码（参考 `error-handling.md`）

## Service

- Service 层通过 `@Injectable()` 注入 Repository，不使用 `new` 实例化
- Service 文件命名：`*.service.ts`
- 使用 MikroORM `EntityManager` 做事务操作

## Module

- Module 使用 `forFeature()` 注册 MikroORM 实体
- 全局模块通过 `@Global()` + `forRoot()` 注册

## DTO 与校验

- DTO 使用 class-validator 装饰器做入参校验
- 统一响应格式 `{ code, data, msg }`，通过全局拦截器包装

## 验证与依赖检查

- 修改 Service/Controller/Entity 后，必须运行 `pnpm -F {包名} check-types` 验证类型安全
- 创建新文件（Service/Guard/Interceptor 等）前，必须检查所需依赖是否已在 `package.json` 中声明，未安装则先安装
- 引入新的第三方包时，确认包名和版本正确，避免引入未安装的包导致编译失败

## Guard 与 Middleware

- 认证 Guard 放在 `common/guards/`，通过 `@UseGuards()` 装饰器应用到 Controller 或路由
- 请求 ID 注入、日志追踪等跨切面逻辑放在 Middleware 中实现
