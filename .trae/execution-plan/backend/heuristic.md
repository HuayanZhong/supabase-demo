# Heuristic — 后端规划最佳实践

## Agent 映射

| 任务类型 | 执行 Agent        | 关注重点                           |
| -------- | ----------------- | ---------------------------------- |
| create   | backend-architect | Entity/Service/Controller 完整链路 |
| modify   | backend-architect | API 兼容性、现有逻辑扩展           |
| fix      | backend-architect | 错误排查、数据库诊断、类型修复     |
| refactor | backend-architect | 模块结构、依赖关系、迁移路径       |
| api      | backend-architect | REST 规范、响应格式、路由注册      |
| data     | backend-architect | 表结构、迁移、查询优化             |

## 扫描先手

1. 新增模块前，先读 `app.module.ts` 了解现有模块注册方式
2. 新增实体前，先用 `supabase MCP → list_tables` 确认 DB 现有表结构
3. 参考同领域已有 module/service/controller 的代码风格和命名约定

## 构建顺序

先底层后上层：

1. **Entity** — 定义字段、关系、索引
2. **Module** — 注册 Entity 和依赖模块
3. **Service** — 实现业务逻辑
4. **Controller** — 暴露 REST 端点

## 路由命名

| 操作     | 命名                       |
| -------- | -------------------------- |
| 列表查询 | `GET /api/<module>`        |
| 单条查询 | `GET /api/<module>/:id`    |
| 新增     | `POST /api/<module>`       |
| 更新     | `PATCH /api/<module>/:id`  |
| 删除     | `DELETE /api/<module>/:id` |

## 数据验证

- 请求 DTO 在 Controller 方法参数中定义类型，不额外创建 class-validator
- 复杂校验逻辑（如唯一性检查）放在 Service 层
- 查询参数使用 NestJS `@Query()` 装饰器，类型由 TypeScript 保证

## 迁移策略

- 开发阶段：`migration:create` + `migration:up` 循环
- 每次只提交一个迁移文件，不合并迁移
- 迁移文件命名清晰反映变更内容（如 `CreateUserTable`）

## 类型联动

- 后端 Entity 的字段类型需与 `packages/types` 中的 Zod schema 对齐
- 新增 API 返回结构时，标注"需同步更新 packages/types"（转 shared 路由）
