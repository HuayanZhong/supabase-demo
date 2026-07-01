# 新建模块/服务/Controller

## 触发条件

- 任务类型匹配：backend → create
- 关键词：新建、创建、添加、新模块、新服务、新 Controller

## 准备工作

| 资源                                     | 说明                             |
| ---------------------------------------- | -------------------------------- |
| `skill/supabase`                         | Supabase 使用指南                |
| `skill/supabase-postgres-best-practices` | Postgres 优化                    |
| `skill/turborepo`                        | 构建配置                         |
| supabase MCP                             | 查表结构、执行 SQL               |
| `execution-plan/backend/`                | 规划指引：约束/最佳实践/决策策略 |
| `execution-engine/backend/`              | 执行指引：约束/最佳实践/决策策略 |

## 执行步骤

### Step 1: 确认模块设计

- 阅读 `apps/backend/src/app.module.ts`，了解现有模块注册方式
- 阅读同领域已有 module/service/controller 代码，复制命名和结构约定
- 明确：
  - Entity 定义（字段、关系、索引）
  - DTO 定义（创建/更新/查询参数）
  - Controller 路由（API 前缀 `/api`）
  - 响应格式（统一返回 `{code, data, msg}`）

### Step 2: 生成骨架

- 使用 NestJS CLI 生成 module/service/controller：
  ```bash
  cd apps/backend
  nest g module modules/<name>
  nest g service modules/<name>
  nest g controller modules/<name> --no-spec
  ```
- 或根据项目约定手动创建文件

### Step 3: 实现 Entity

- 使用 MikroORM 装饰器定义 Entity（`@Entity()`, `@Property()`, `@ManyToOne()` 等）
- 在 `apps/backend/src/modules/<name>/entities/` 下创建
- Entity 定义遵循 MikroORM 最佳实践：
  - 使用 `@PrimaryKey()` 或 `@SerializedPrimaryKey()` 定义主键
  - 使用 `@Property()` 定义字段，设置 `type`、`nullable`、`default` 等
  - 使用 `@ManyToOne()` / `@OneToMany()` 定义关系

### Step 4: 实现业务逻辑

- Service 层处理核心业务逻辑
- 使用 `@Injectable()` 装饰，通过构造函数注入依赖
- Controller 层保持轻量，只做参数验证和路由分发
  - Controller 方法不需要 try-catch（由全局 AllExceptionsFilter 托管）
  - 返回值直接返回 data，TransformInterceptor 会自动包装为 `{code, data, msg}`
- DTO 验证使用 `packages/types/` 中的 Zod schema（通过 `apps/backend/src/types/request.ts` 中的 `ZodValidationPipe`）

### Step 5: 注册模块

- 在 `app.module.ts` 的 `imports` 数组中注册新模块
- 如果有跨模块引用，使用 MikroORM 的 `@InjectRepository()` 或通过模块导出

## 完成检查

- [ ] 编译通过（`pnpm --filter backend build` 或 `tsc --noEmit`）
- [ ] 新模块在 `app.module.ts` 中注册
- [ ] API 路由前缀正确（`/api/<name>`）
- [ ] 响应格式符合 `{code, data, msg}` 规范
- [ ] Controller 没有 try-catch（由全局过滤器处理）
- [ ] Entity 定义了正确的索引和关系

## 输出

- 新增的 module/service/controller 文件
- 新增的 Entity 文件
- 修改后的 `app.module.ts`
- 如涉及共享类型，同步更新 `packages/types/`
