# Router — 任务路由总入口

## 职责

接收用户请求，按意图关键词分类，分派到对应的领域子路由。

```
用户请求
    │
    ▼
┌──────────────────────┐
│    router.md (总闸)   │
│    关键词 → 领域映射  │
└──────┬───────────────┘
       │
       ├── frontend ──→ runtime/frontend/router.md
       ├── backend  ──→ runtime/backend/router.md
       ├── devops   ──→ runtime/devops/router.md
       ├── shared   ──→ runtime/shared/router.md
       ├── ai       ──→ runtime/ai/router.md
       └── quality  ──→ runtime/quality/router.md
```

## 领域分类规则

### Frontend

匹配 `apps/frontend/` 下的所有工作。

| 关键词                 | 说明      |
| ---------------------- | --------- |
| 页面、组件、样式、布局 | UI 相关   |
| 菜单、导航、路由       | 页面结构  |
| 主题、图标、暗色模式   | 视觉相关  |
| 表单、输入、按钮       | 交互元素  |
| 前端国际化、翻译文本   | i18n 文本 |
| 动效、过渡、动画       | 交互反馈  |

### Backend

匹配 `apps/backend/` 下的所有工作。

| 关键词                       | 说明      |
| ---------------------------- | --------- |
| API、接口、路由、端点        | HTTP 接口 |
| 数据库、表、模型、实体       | 数据层    |
| Auth、登录、注册、会话       | 认证授权  |
| 服务、模块、Controller       | 业务逻辑  |
| 中间件、守卫、拦截器、过滤器 | 通用能力  |

### DevOps

匹配 CI/CD、部署、项目基础设施。

| 关键词                        | 说明      |
| ----------------------------- | --------- |
| CI、CI/CD、GitHub Actions     | 持续集成  |
| 部署、发布、上线、Docker      | 部署相关  |
| 环境变量、配置                | 环境配置  |
| 依赖、升级、pnpm              | 依赖管理  |
| Husky、lint-staged            | Git hooks |
| Supabase 项目、Edge Functions | 云服务    |

### Shared

匹配 `packages/` 下的共享包变更。

| 关键词               | 说明                       |
| -------------------- | -------------------------- |
| 类型、Schema、Zod    | 类型定义（packages/types） |
| 翻译、Locale、语言   | i18n 翻译文件              |
| Lint、ESLint、oxlint | lint 配置                  |
| 共享包、公共模块     | 包结构变更                 |

### AI

匹配 AI 模型集成相关。

| 关键词                | 说明       |
| --------------------- | ---------- |
| AI、模型、LLM、大模型 | 模型接入   |
| 对话、Chat、聊天      | 对话功能   |
| Embedding、向量、RAG  | 向量检索   |
| Agent、Tool calling   | 智能体编排 |

### Quality

匹配质量保障类任务。

| 关键词                 | 说明     |
| ---------------------- | -------- |
| 测试、单元测试、E2E    | 测试相关 |
| 代码审查、Review、审计 | 审查相关 |
| 性能、优化、慢查询     | 性能分析 |
| 安全、漏洞、合规       | 安全合规 |

## 多领域任务处理

当一个请求涉及多个领域时：

1. **拆分子任务** — 将请求拆为独立的子任务
2. **分别路由** — 每个子任务独立分派到对应领域
3. **汇总结果** — 各子任务完成后合并输出

例如："添加用户头像上传功能"

```
涉及 frontend（上传组件） + backend（文件 API）+ devops（存储配置）
→ 拆为 3 个子任务，分别路由
```

## 无法分类

关键词不匹配任何领域时，回退到默认逻辑：

- 读取 `.trae/agents/` 下所有 description 匹配 Subagent
- 无匹配则走 SOLO Agent 自主判断
