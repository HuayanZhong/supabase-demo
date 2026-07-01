# API 接口设计

## 触发条件

- 任务类型匹配：backend → api
- 关键词：接口设计、端点、路由、API、RESTful

## 准备工作

| 资源                                     | 说明               |
| ---------------------------------------- | ------------------ |
| `rules/project-architecture.md`          | 项目架构概览       |
| `skill/supabase`                         | Supabase 使用指南  |
| `skill/supabase-postgres-best-practices` | Postgres 优化      |
| `skill/turborepo`                        | 构建配置           |
| supabase MCP                             | 查表结构、执行 SQL |

## 执行步骤

### Step 1: 设计接口规范

- 遵循 RESTful 风格，资源名使用复数形式（`/api/users`、`/api/articles`）
- 常见 HTTP 方法与 CRUD 映射：

| 方法   | 路径                 | 行为     |
| ------ | -------------------- | -------- |
| GET    | `/api/resources`     | 列表查询 |
| GET    | `/api/resources/:id` | 查询单个 |
| POST   | `/api/resources`     | 创建     |
| PATCH  | `/api/resources/:id` | 部分更新 |
| DELETE | `/api/resources/:id` | 删除     |

- 查询参数统一风格：
  - 分页：`page`、`limit`（1-based）
  - 排序：`sort`（字段名）、`order`（`asc`/`desc`）
  - 筛选：直接使用查询参数名（如 `?status=active`）
- 参考已有 Controller 的命名模式

### Step 2: 定义 DTO

- 使用 `packages/types/` 中的 Zod schema 定义请求/响应结构
- DTO 文件位置：`packages/types/src/<domain>/`，然后在 `apps/backend/src/types/request.ts` 中引用
- 通过 `ZodValidationPipe` 在 Controller 中自动校验入参
- DTO 分类：
  - `Create<Name>Dto` — 创建请求
  - `Update<Name>Dto` — 更新请求
  - `Query<Name>Dto` — 查询参数
  - `<Name>Response` — 响应结构

### Step 3: 实现端点

- **Controller 定义**：
  - 使用 `@Controller('api/resources')` 定义路由前缀
  - 使用 `@Get()`、`@Post()`、`@Patch()`、`@Delete()` 映射 HTTP 方法
  - 方法名使用动词：`findAll`、`findOne`、`create`、`update`、`remove`
  - 不要在 Controller 中加 try-catch（由全局 AllExceptionsFilter 处理）
  - 返回值直接返回 data 对象，TransformInterceptor 自动包装为 `{code, data, msg}`
- **Service 定义**：
  - 核心业务逻辑在 Service 中
  - 可抛出 `NotFoundException`、`BadRequestException` 等 NestJS 内置异常

### Step 4: 验证

- 编译检查：`pnpm --filter backend build` 或 `tsc --noEmit`
- 确认所有端点响应格式为 `{code, data, msg}`
- 确认错误时返回 `{code, data: null, msg: "错误信息"}`

## 完成检查

- [ ] 编译通过
- [ ] 路由前缀正确（`/api/...`）
- [ ] RESTful 命名规范（资源复数、方法语义正确）
- [ ] 所有端点返回 `{code, data, msg}` 格式
- [ ] Controller 无 try-catch
- [ ] DTO 校验规则通过 Zod schema 定义
- [ ] 错误情况返回合适的 HTTP Status Code

## 输出

- Controller 文件（路由定义）
- Service 文件（业务逻辑）
- DTO schema 文件（在 `packages/types/` 中）
- 如涉及新 Entity，同步走 create workflow
