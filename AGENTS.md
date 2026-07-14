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
       ├─ git-commit-message.md  Commit 格式
       ├─ backend/               NestJS + 数据库 + 注释 + 异常处理 + 日志
       │    ├─ nestjs.md         Controller/Service/Module
       │    ├─ comments.md       注释规范（JSDoc 模板）
       │    ├─ database.md       MikroORM Entity/Repository
       │    ├─ error-handling.md 异常处理与错误码
       │    └─ logging.md        日志规范
       ├─ frontend/              Nuxt + 样式 + 国际化 + 质量
       │    ├─ nuxt.md           组件、页面、数据获取
       │    ├─ styles.md         Tailwind / Nuxt UI 样式
       │    ├─ i18n.md           国际化翻译
       │    ├─ quality.md        a11y、加载状态、性能
       │    ├─ comments.md       注释规范
       │    ├─ components.md     组件架构
       │    ├─ dashboard-layout.md Dashboard 布局约束
       │    ├─ delivery-checklist.md 交付前自检
       │    ├─ echarts.md        ECharts 图表规范
       │    ├─ layout-bfc.md     Flex + BFC 滚动约束
       │    ├─ no-decoration.md  禁止有效装饰
       │    └─ task-stability.md 长任务稳定性
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

| 文件                             | 生效方式 | 适用场景                           |
| -------------------------------- | -------- | ---------------------------------- |
| `agent-routing.md`               | 智能生效 | 意图分类、Agent 选型时自动触发     |
| `agent-catalog.md`               | 智能生效 | 按章节分阶段注入各 hook 事件       |
| `language.md`                    | 始终生效 | 回答、注释、commit 使用中文        |
| `naming.md`                      | 始终生效 | 文件、变量、类型命名规范           |
| `comments.md`                    | 始终生效 | 注释风格与 JSDoc 约定              |
| `backend/nestjs.md`              | 智能生效 | NestJS Controller/Service/Module   |
| `backend/comments.md`            | 智能生效 | 后端注释规范（JSDoc 模板）         |
| `backend/database.md`            | 智能生效 | MikroORM Entity/Repository/迁移    |
| `backend/error-handling.md`      | 智能生效 | 异常处理、错误码、Exception Filter |
| `backend/logging.md`             | 智能生效 | 日志级别、结构化日志、请求追踪     |
| `frontend/nuxt.md`               | 智能生效 | Nuxt 组件/页面/数据获取            |
| `frontend/styles.md`             | 智能生效 | Tailwind / Nuxt UI 样式            |
| `frontend/i18n.md`               | 智能生效 | 国际化翻译                         |
| `frontend/quality.md`            | 智能生效 | a11y、加载状态、性能约定           |
| `frontend/comments.md`           | 智能生效 | Vue / composable 注释规范          |
| `frontend/components.md`         | 智能生效 | 组件提取、拆分、复用               |
| `frontend/dashboard-layout.md`   | 智能生效 | Dashboard 布局约束                 |
| `frontend/delivery-checklist.md` | 智能生效 | 前端交付前自检                     |
| `frontend/echarts.md`            | 智能生效 | ECharts 图表规范                   |
| `frontend/layout-bfc.md`         | 智能生效 | Flex + BFC 滚动约束                |
| `frontend/no-decoration.md`      | 智能生效 | 禁止无效装饰                       |
| `frontend/task-stability.md`     | 智能生效 | 长任务稳定性与多任务并行           |
| `shared/monorepo.md`             | 智能生效 | 子包创建/依赖管理                  |
| `shared/dependencies.md`         | 智能生效 | 依赖添加与版本管理规范             |
| `shared/env-vars.md`             | 智能生效 | 环境变量注册与使用规范             |
| `shared/frontend-types.md`       | 智能生效 | ViewModel 与 Entity 职责边界       |
| `quality/testing.md`             | 智能生效 | 测试编写与运行                     |
| `quality/security.md`            | 智能生效 | 安全与认证                         |
| `git-commit-message.md`          | 智能生效 | Commit message 格式                |

## Hooks 生命周期

```
PreToolUse(Write)           → protect-mcp-json.ps1（安全拦截）
                           → enforce-code-standards.ps1（安全拦截）
PreToolUse(execute_sql)     → protect-sql.ps1（安全拦截）
PreToolUse(chrome-devtools) → inject-credentials.ps1（本地凭证注入）
```

> 规则注入由 Trae IDE 内置机制处理，通过 `alwaysApply` 字段控制始终生效或按意图匹配。

## 技能与 MCP

Skills 和 MCP 的调用规则见 `agent-catalog.md`（角色与资源章节）。

## 任务收尾

任务完成后按 `agent-catalog.md` 执行质量验证。
