# 排查后端问题

## 触发条件

- 任务类型匹配：backend → fix
- 关键词：修复、Bug、报错、异常、错误、无法运行

## 准备工作

| 资源                                     | 说明                               |
| ---------------------------------------- | ---------------------------------- |
| `skill/supabase`                         | Supabase 使用指南                  |
| `skill/supabase-postgres-best-practices` | Postgres 优化                      |
| `skill/turborepo`                        | 构建配置                           |
| supabase MCP                             | 查表结构、查看日志、执行 SQL       |
| `skill/TRAE-debugger`                    | 运行时调试（需用户主动要求时启用） |
| `execution-plan/backend/`                | 规划指引：约束/最佳实践/决策策略   |
| `execution-engine/backend/`              | 执行指引：约束/最佳实践/决策策略   |

## 执行步骤

### Step 1: 定位异常

- 分析异常堆栈，确定错误发生的层级：
  - **Controller 层**：路由匹配、参数校验失败（检查 ZodValidationPipe 配置）
  - **Service 层**：业务逻辑异常、空指针/undefined 访问
  - **Repository/Entity 层**：数据库查询、关系映射、约束违反
  - **Filter/Interceptor 层**：全局异常处理、响应转换
- 关键词提取：从错误信息中提取关键线索（表名、字段名、行号、异常类型）

### Step 2: 诊断根因

- **SQL/数据库问题**：使用 supabase MCP 确认：
  - `list_tables` — 检查表结构是否存在
  - `execute_sql` — 手动执行 SQL 验证查询
  - `get_logs` — 查看 Postgres 日志
  - `get_advisors` — 获取性能/安全建议
- **代码逻辑问题**：阅读相关文件，追踪数据流：
  - 检查 Entity 定义是否与数据库表结构一致
  - 检查 Service 中的查询条件是否正确
  - 检查 DTO/Zod schema 校验规则是否合理
- **运行时问题**：阅读文件 `apps/backend/src/main.ts`，检查启动配置

### Step 3: 修复

- 遵循最小修改原则，只改有问题的地方
- 不在修复范围外做机会主义重构
- 修复类型：
  - **类型错误**：修正 Entity/DTO 类型定义
  - **逻辑错误**：修正业务流程
  - **配置错误**：修正模块注册、路由映射
  - **数据库错误**：修正查询、字段映射、Migration
- 如涉及数据库 schema 变更，同步走 data workflow 生成 Migration

### Step 4: 验证

- 编译检查：`pnpm --filter backend build` 或 `tsc --noEmit`
- 边界用例确认：检查空值、非法输入、超大值等情况
- 如修复涉及数据库查询，使用 supabase MCP `execute_sql` 手动验证查询结果
- 如修复涉及 API 行为，前端需能正常调用

## 完成检查

- [ ] 原异常不再复现
- [ ] 编译通过
- [ ] 修复范围最小化，未引入无关改动
- [ ] 边界用例已确认
- [ ] 如涉及数据库，Migration 已同步

## 输出

- 根因分析
- 修复的文件列表及变更内容
- 验证方式
