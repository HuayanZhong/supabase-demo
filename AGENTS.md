# Trae AI Engineering 治理框架

本项目治理框架位于 `.trae/` 目录下。

## 治理架构

```
AGENTS.md               ← 总纲（始终生效）
  │
  └─ .trae/rules/       ← 规则体系（按领域/事件生效）
       ├─ agent-routing.md        命中规则（路由决策）
       ├─ agent-catalog.md        Agent 操作目录（按章节注入）
       ├─ language.md            语言约束
       ├─ naming.md              命名规范
       ├─ comments.md            注释风格
       ├─ task-logging.md        任务日志输出
       ├─ git-commit-message.md  Commit 格式
       ├─ backend/               NestJS + 数据库 + 异常处理
       │    ├─ nestjs.md         Controller/Service/Module
       │    ├─ database.md       MikroORM Entity/Repository
       │    ├─ error-handling.md 异常处理与错误码
       │    └─ logging.md        日志规范
       ├─ frontend/              Nuxt + 样式 + 国际化 + 质量
       │    ├─ nuxt.md           组件、页面、数据获取
       │    ├─ styles.md         Tailwind / Nuxt UI 样式
       │    ├─ i18n.md           国际化翻译
       │    └─ quality.md        a11y、加载状态、性能
       ├─ shared/                Monorepo 治理 + 类型边界
       │    ├─ monorepo.md       子包创建、构建配置
       │    ├─ dependencies.md   catalog 依赖管理
       │    ├─ env-vars.md       环境变量注册
       │    └─ frontend-types.md ViewModel/Entity 边界
       └─ quality/               测试 + 安全
            ├─ testing.md        测试规范
            └─ security.md       安全与认证
```

## 规则体系

| 文件                        | 生效方式 | 适用场景                           |
| --------------------------- | -------- | ---------------------------------- |
| `agent-routing.md`          | 智能生效 | UserPromptSubmit 时注入路由决策    |
| `agent-catalog.md`          | 智能生效 | 按章节分阶段注入各 hook 事件       |
| `language.md`               | 始终生效 | 回答、注释、commit 使用中文        |
| `naming.md`                 | 始终生效 | 文件、变量、类型命名规范           |
| `comments.md`               | 始终生效 | 注释风格与 JSDoc 约定              |
| `task-logging.md`           | 始终生效 | 任务日志输出与记录                 |
| `backend/nestjs.md`         | 智能生效 | NestJS Controller/Service/Module   |
| `backend/database.md`       | 智能生效 | MikroORM Entity/Repository/迁移    |
| `backend/error-handling.md` | 智能生效 | 异常处理、错误码、Exception Filter |
| `backend/logging.md`        | 智能生效 | 日志级别、结构化日志、请求追踪     |
| `frontend/nuxt.md`          | 智能生效 | Nuxt 组件/页面/数据获取            |
| `frontend/styles.md`        | 智能生效 | Tailwind / Nuxt UI 样式            |
| `frontend/i18n.md`          | 智能生效 | 国际化翻译                         |
| `frontend/quality.md`       | 智能生效 | a11y、加载状态、性能约定           |
| `shared/monorepo.md`        | 智能生效 | 子包创建/依赖管理                  |
| `shared/dependencies.md`    | 智能生效 | 依赖添加与版本管理规范             |
| `shared/env-vars.md`        | 智能生效 | 环境变量注册与使用规范             |
| `shared/frontend-types.md`  | 智能生效 | ViewModel 与 Entity 职责边界       |
| `quality/testing.md`        | 智能生效 | 测试编写与运行                     |
| `quality/security.md`       | 智能生效 | 安全与认证                         |
| `git-commit-message.md`     | 智能生效 | Commit message 格式                |

## Hooks 生命周期与规则注入

```
SessionStart   → session-start.ps1     → language.md + monorepo.md + agent-catalog.md（角色与资源）
UserPromptSubmit→ classify-intent.ps1   → agent-routing.md（路由决策）
PreToolUse     → enforce-code-standards.ps1 → naming.md + comments.md + agent-catalog.md（安全约束）
PostToolUse    → remind-logging.ps1     → 提醒输出日志
Stop           → validate-output.ps1    → task-logging.md + agent-catalog.md（质量验证）
Notification   → quality-reminder.ps1    → 质量检查清单
```

## 技能与 MCP

Skills 和 MCP 的调用规则见 `agent-catalog.md`（角色与资源章节）。

## 任务收尾

任务完成后按 `task-logging.md` 输出结构化日志，包含调用的规则/Skills/MCP、变更清单、验证结果。
