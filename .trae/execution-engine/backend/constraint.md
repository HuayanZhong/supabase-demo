# Constraint — 后端执行阶段硬约束

## 执行前约束

- 开始前必须先读取对应 `workflows/backend/{task-type}.md` 了解执行步骤
- 开始前必须先读取 `execution-plan/backend/` 了解规划阶段的约束/启发/策略
- 开始前必须先通过 `runtime/backend/router.md` 确认分配的资源（rules、skills、MCP）

## 数据库与 MCP 约束

- 涉及 Supabase 数据库表结构查询时，必须使用 `supabase MCP → list_tables / execute_sql`，不得使用 psql 命令
- 确认列类型等信息时，必须通过 `information_schema.columns` 查询（`execute_sql`），不得猜测
- 涉及表结构变更前，必须先通过 `supabase MCP → list_migrations` 查看当前迁移状态
- 调用 MCP 前必须先通过 Read 读取对应的工具描述文件，确认参数后再调用
- 不得直接调用未在 workflow 资源表中列出的 MCP 或 skill

## 实体与类型约束

- Entity 变更后必须验证 MikroORM 装饰器（`@Entity`、`@Property`、`@OneToMany` 等）的正确性
- 实体字段类型必须与数据库列类型对齐，通过 `execute_sql` 查询确认
- 新增 Entity 时，必须先通过 `supabase MCP → list_tables` 确认表结构中是否已有对应表
- 涉及后端类型变更后，必须执行 `pnpm check-types` 验证类型正确性

## API 与代码结构约束

- API 端点必须遵循 NestJS Controller/Service 模式，Controller 不得包含业务逻辑
- 所有 API 路由前缀必须为 `/api`，统一响应格式 `{code, data, msg}`
- 不得自行 try-catch，全局异常由 AllExceptionsFilter 托管
- 新增模块必须遵循标准 NestJS 结构：entity → module → controller → service

## 执行过程约束

- 执行必须严格按 `workflows/backend/{task-type}.md` 的步骤顺序进行，不得跳过
- 每一步完成后必须确认输出是否符合预期，确认后再进入下一步
- 执行过程中发现计划外的文件需要修改时，必须先上报再修改，不得擅自追加
- 涉及创建文件时，必须先确认目标路径是否存在，不存在则先创建目录
- 涉及修改文件时，必须先 Read 当前内容再修改，不得凭记忆重写
- 不得在单个工具调用中写入超过 200 行的文件（应分段写入）

## 验证约束

- 完成文件写入后，必须立即执行 `pnpm check-types` 验证类型
- `pnpm check-types` 失败时，不得继续后续步骤，必须修复类型错误
- 涉及 API 变更时，必须验证路由注册和模块导入是否正确

## 错误处理约束

- 执行中遇到错误时必须停止当前步骤并记录错误信息，不得尝试绕过
- 错误分为两类：
  - **阻断性错误**（编译错误、类型错误、语法错误、依赖缺失）— 必须修复后才能继续
  - **非阻断性错误**（lint 警告、格式问题）— 记录但可继续，完成后统一修复
- 连续 2 次修复尝试仍失败时，必须暂停执行并上报，不得无限制重试
- 修改必须可回滚（通过 git），破坏性变更前必须执行 `git stash` 或提交当前工作区
