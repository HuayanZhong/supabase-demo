---
alwaysApply: false
description: NestJS 后端开发规范，涉及 Controller/Service/Module/DTO 时生效
---

- Controller 只做路由转发，不包含业务逻辑
- Service 层通过 `@Injectable()` 注入 Repository，不使用 `new` 实例化
- Module 使用 `forFeature()` 注册 MikroORM 实体
- DTO 使用 class-validator 装饰器做入参校验
- 统一响应格式 `{ code, data, msg }`，通过全局拦截器包装
- Controller 文件放在 `*.controller.ts`，Service 放在 `*.service.ts`
- 使用 `@nestjs/swagger` 装饰器（`@ApiTags`、`@ApiOperation`、`@ApiParam`、`@ApiBody`、`@ApiResponse`）为每个端点添加文档描述
- `@ApiResponse` 必须标注可能的错误状态码和对应的业务错误码（参考 `error-handling.md`）
