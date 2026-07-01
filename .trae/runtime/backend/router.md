# Backend 路由

## 领域范围

- **入站条件**：总路由 `router.md` 判定为 `backend`
- **覆盖路径**：`apps/backend/` 下所有文件
- **不处理**：前端 UI 变更、共享包类型修改（应转回总路由重新分发）

## 子任务分类

| 任务类型     | 关键词                    | 对应 Agent        | 说明                     |
| ------------ | ------------------------- | ----------------- | ------------------------ |
| **create**   | 新建、创建、添加          | backend-architect | 新建模块/服务/Controller |
| **modify**   | 修改、改、更新            | backend-architect | 修改已有业务逻辑         |
| **fix**      | 修复、Bug、报错           | backend-architect | 排查后端问题             |
| **refactor** | 重构、优化、拆分          | backend-architect | 后端代码重构             |
| **api**      | 接口设计、端点、路由      | backend-architect | API 接口相关             |
| **data**     | 数据模型、实体、Migration | backend-architect | 数据库/实体相关          |

## 资源映射

### 通用加载（所有后端任务）

| 资源                                     | 说明               |
| ---------------------------------------- | ------------------ |
| `rules/project-architecture.md`          | 项目架构概览       |
| `skill/supabase`                         | Supabase 使用指南  |
| `skill/supabase-postgres-best-practices` | Postgres 优化      |
| `skill/turborepo`                        | 构建配置           |
| supabase MCP                             | 查表结构、执行 SQL |

### 按任务类型额外加载

| 任务类型 | 额外资源                                             |
| -------- | ---------------------------------------------------- |
| data     | supabase MCP（list_tables、execute_sql）             |
| create   | `rules/frontend/frontend-types.md`（如需联动类型包） |

## 调用 Workflow

后端任务统一走：

```
workflows/backend/{task-type}.md
```

## 注意事项

- 后端有统一的响应格式 `{code, data, msg}`（TransformInterceptor），新接口必须遵循
- 全局异常处理已由 AllExceptionsFilter 托管，Controller 层不需 try-catch
- 所有 API 路由前缀为 `/api`
