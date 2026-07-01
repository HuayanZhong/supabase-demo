# 后端代码重构

**对应 Agent：** `backend-architect`

## 触发条件

- 任务类型匹配：backend → refactor
- 关键词：重构、优化、拆分、提取、重写、整理

## 准备工作

| 资源                                     | 说明                             |
| ---------------------------------------- | -------------------------------- |
| `rules/project-architecture.md`          | 项目架构概览，了解模块间依赖     |
| `skill/supabase`                         | Supabase 使用指南                |
| `skill/supabase-postgres-best-practices` | Postgres 优化                    |
| `skill/turborepo`                        | 构建配置                         |
| supabase MCP                             | 查表结构、执行 SQL               |
| `execution-plan/backend/`                | 规划指引：约束/最佳实践/决策策略 |

## 执行步骤

### Step 1: 分析重构范围

- 阅读目标模块所有文件，画出当前依赖关系图（文件间引用、模块导入）
- 识别可优化点：
  - **重复代码**：多个 Service 中的相同逻辑
  - **大 Service**：单一 Service 职责过多，需拆分
  - **循环依赖**：模块间互相引用
  - **过时实现**：旧的实现方式需替换
  - **不一致命名**：函数/变量命名不符合项目约定
- 明确重构目标：性能、可读性、可维护性、可测试性

### Step 2: 渐进重构（从数据层向上）

- 重构顺序：**Entity/Repository → Service → Controller**
- **数据层**：
  - 优化 Entity 定义（字段类型、索引、关系）
  - 提取公共 Repository 逻辑
  - 确保 Migration 完整性
- **服务层**：
  - 拆分大 Service 为多个专注的 Service
  - 提取公共工具函数到 `common/` 下
  - 保持每个方法单一职责
- **控制层**：
  - Controller 保持轻量
  - 路由映射清晰
- **每完成一步**：执行编译检查，确保编译通过

### Step 3: 接口兼容

- **不破坏已有 API 契约**：
  - URL 路径不变
  - HTTP 方法不变
  - 请求/响应格式不变（`{code, data, msg}`）
  - 参数名和类型不变
- 如需改 API 契约，在 Step 1 中标注并通知前端
- 新增方法使用 `@Deprecated()` 标记旧方法（如适用）

### Step 4: 清理

- 删除废弃的 import、变量、方法、文件
- 删除冗余注释（尤其是 `// TODO` 和已被重构的代码注释）
- 更新模块导出（barrel files 中的 `index.ts`）
- 同步更新引用处

## 完成检查

- [ ] 编译通过
- [ ] 所有 API 端点返回格式一致（`{code, data, msg}`）
- [ ] 原有 API 路径和方法未变更
- [ ] 无循环依赖
- [ ] 无废弃 import 和死代码残留
- [ ] 大 Service 已拆分（如果这是目标）
- [ ] 重复代码已提取公共逻辑

## 输出

- 重构前后对比
- 变更文件列表
- 已删除的废弃代码/文件清单
