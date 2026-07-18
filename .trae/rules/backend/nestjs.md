---
alwaysApply: false
description: NestJS 后端开发规范，涉及 Controller/Service/Module/DTO 时生效
---

## Controller

- Controller 只做路由转发，不包含业务逻辑
- Controller 文件命名：`*.controller.ts`
- 使用 `@nestjs/swagger` 装饰器（`@ApiTags`、`@ApiOperation`、`@ApiQuery`、`@ApiBody`）为每个端点添加文档描述
- 响应 Swagger 文档必须使用统一包装装饰器，**禁止直接使用 `@ApiResponse({ type: Entity })`**（因为 TransformInterceptor 会将响应包装为 `{ code, data, msg }`，直接使用会导致生成的 schema 与实际结构不匹配）：
  - **成功响应** → `@ApiDataResponse(Entity, { status, description, isArray })`
  - **错误响应** → `@ApiErrorResponse(HttpStatus.XXX, "描述文本")`
  - 示例：详见 `common/decorators/api-data-response.decorator.ts`
- DTO/VO 的 `@ApiProperty()` 装饰器中，使用 `example` 标注示例值（如 `@ApiProperty({ example: "北京" })`），避免生成的 API 文档出现空值

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
