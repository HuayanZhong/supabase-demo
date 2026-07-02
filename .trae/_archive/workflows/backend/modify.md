# 修改已有业务逻辑

## 触发条件

- 任务类型匹配：backend → modify
- 关键词：修改、改、更新、变更、调整

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

### Step 1: 理解变更范围

- 读取目标文件及关联文件（Controller → Service → Entity/Repository）
- 理解当前的业务逻辑链路和数据流向
- 阅读该模块的同步修改代码，确认代码风格和命名约定

### Step 2: 分析影响

- 搜索引用链：
  - 该 Controller 方法被哪些前端 API 调用（查前端代码中的 API 调用）
  - 该 Service 方法被哪些其他 Service/Controller 引用（搜索 `import` 引用）
  - 该 Entity 字段被哪些 DTO/查询使用
- 确认修改是否涉及：
  - API 响应格式变化（需通知前端适配）
  - 数据库 schema 变化（需走数据模型 workflow）
  - 共享类型包 `packages/types/` 的变化

### Step 3: 修改

- 遵循 NestJS 模块化风格，保持代码一致性
- 注意：
  - 修改后 API 响应仍为 `{code, data, msg}` 格式
  - 不要在 Controller 中添加 try-catch
  - Service 中可抛出 `HttpException` 或使用自定义异常
  - 保持现有方法签名兼容性（如必须变更，同步更新调用方）
- 如需新增 DTO 字段，同步更新对应的 Zod schema

### Step 4: 验证

- 编译检查：`pnpm --filter backend build` 或 `tsc --noEmit`
- 类型检查：确认前后端类型一致
- 如修改了 API 响应结构或路由，手动确认前端对应调用处

## 完成检查

- [ ] 编译通过
- [ ] 逻辑修改符合预期
- [ ] API 响应格式未破坏（仍为 `{code, data, msg}`）
- [ ] 已搜索所有引用处并同步更新
- [ ] 无需 try-catch 的 Controller 保持干净

## 输出

- 修改的文件列表
- 变更摘要（改了哪里、为什么改）
