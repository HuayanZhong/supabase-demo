# Skills — 技能包

## 职责

`skills/` 存放领域特定的技能包（Skill），为 Agent 提供专业知识库和可复用的能力。

```
skills/{skill-name}/   ← 技能包：提供领域知识
        │
        ▼
Agent 使用技能辅助执行
```

---

## 文件结构

```
.trae/skills/
├── README.md                      # 本文档
└── ...
```

所有通过 `npx skills add` 安装的技能包存放在 `.agents/skills/`，
通过 **Junction** 链接到 `.trae/skills/` 下供 Trae 自动识别。

---

## 技能包清单

### 核心技术栈

| 技能                                 | 覆盖内容                                                                         | 触发场景                                        |
| ------------------------------------ | -------------------------------------------------------------------------------- | ----------------------------------------------- |
| **supabase**                         | 全栈 Supabase（Auth、Realtime、Edge Functions、Storage、Vectors、Cron、Queues）  | 数据库操作、认证、迁移、RLS、CLI                |
| **supabase-postgres-best-practices** | PostgreSQL 最佳实践（索引、连接池、锁、安全、监控）                              | 慢查询、死锁、连接池、批量操作                  |
| **mikro-orm-docs**                   | MikroORM 最新文档 API 用法（Entity、Repository、Migration、Query）               | Entity 定义、Repository 查询、迁移操作          |
| **mikro-orm-seeder**                 | MikroORM 数据种子与实体工厂使用指南                                              | 创建测试数据、初始化数据库、编写 Seeder         |
| **turborepo**                        | Turborepo 缓存、pipeline、remote cache、filtering、CI 优化                       | turbo.json 配置、任务编排、monorepo             |
| **nuxt-ui**                          | Nuxt UI v4 组件使用（布局、表单、对话框、表格）                                  | 组件选型、布局搭建、主题定制                    |
| **nuxt**                             | Nuxt 3 核心（路由、数据获取、SSR、模块、组合式函数）                             | pages、middleware、composables、deploy          |
| **typescript-advanced-types**        | TS 高级类型、泛型、条件类型、映射类型、类型体操                                  | 类型定义、Schema 设计、复杂泛型                 |
| **ecosystem-primer**                 | LangChain / LangGraph / Deep Agents 框架选型与环境搭建                           | 创建 Agent 项目、框架选择、环境配置             |
| **deep-agents-core**                 | Deep Agents 核心框架（create_deep_agent、harness 架构、SKILL.md 格式）           | 构建 Deep Agents 应用                           |
| **deep-agents-memory**               | Deep Agents 持久化与记忆（StateBackend、StoreBackend、FilesystemMiddleware）     | 需要状态持久化、文件系统访问                    |
| **deep-agents-orchestration**        | Deep Agents 子代理编排与任务规划（SubAgentMiddleware、TodoList、HITL）           | 多代理协作、任务分解、人工审批                  |
| **langchain-dependencies**           | LangChain 生态依赖管理与版本兼容                                                 | 安装配置、版本选择、环境搭建                    |
| **langchain-fundamentals**           | LangChain Agent 创建与工具链编排（create_agent、工具定义、中间件）               | 创建 Agent、定义工具、错误处理                  |
| **langchain-middleware**             | LangChain 中间件模式（人工审批 HITL、结构化输出、自定义中间件）                  | HITL 审批、Pydantic/Zod 输出、Command resume    |
| **langchain-rag**                    | RAG 检索增强生成（文档加载器、文本分割、Embeddings、向量存储）                   | 文档处理、Chroma/FAISS/Pinecone、语义搜索       |
| **langgraph-cli**                    | LangGraph CLI 脚手架与项目生命周期管理（new/dev/build/deploy）                   | 项目创建、开发、构建、部署、langgraph.json 配置 |
| **langgraph-fundamentals**           | LangGraph StateGraph 状态图构建（节点、边、Command、Send、流式输出）             | 状态图、条件边、流式输出、错误处理              |
| **langgraph-human-in-the-loop**      | LangGraph 人工介入与审批流程（interrupt、Command(resume=)、4 级错误处理策略）    | 审批工作流、暂停恢复、人工验证                  |
| **langgraph-persistence**            | LangGraph 状态持久化与历史回溯（checkpointer、thread_id、时间旅行、Store）       | 会话持久化、历史回溯、子图作用域配置            |
| **langsmith-dataset**                | LangSmith 评估数据集创建与生命周期管理（CLI/SDK 方式）                           | 创建数据集、上传示例、管理现有数据集            |
| **langsmith-evaluator**              | LangSmith 评估管道（LLM-as-Judge、自定义评估、本地/自动运行）                    | 编写评估器、配置运行函数、CI 自动评估           |
| **langsmith-trace**                  | LangSmith 追踪与链路查询（Tracing 添加、Trace 数据导出）                         | 调试 Agent、性能分析、链路追踪                  |
| **managed-deep-agents**              | LangSmith Managed Deep Agents 部署与管理（mda CLI、cron 调度、MCP 连接器、沙箱） | 生产部署、cron 定时任务、Context Hub            |

### 后端

| 技能                        | 覆盖内容                                       | 触发场景                 |
| --------------------------- | ---------------------------------------------- | ------------------------ |
| **nestjs-best-practices**   | NestJS 模块/Controller/Service/DTO/Entity 规范 | 创建模块、接口、依赖注入 |
| **postgresql-table-design** | 表设计、索引策略、数据类型选择、分区           | 建表、迁移、Schema 设计  |

### 质量与安全

| 技能                 | 覆盖内容                                        | 触发场景                       |
| -------------------- | ----------------------------------------------- | ------------------------------ |
| **webapp-testing**   | Playwright 网页自动化、截图、日志收集           | E2E 测试、UI 验证              |
| **frontend-testing** | 前端测试策略、Vitest、Vue Test Utils、组件测试  | 单元测试、组件测试、测试覆盖率 |
| **security-review**  | 安全审查（密钥泄露、注入、XSS、CSRF、认证授权） | 安全审计、漏洞扫描、合规检查   |
| **code-review**      | TypeScript 代码审查最佳实践                     | PR 审查、代码质量检查          |
| **performance**      | Web 性能审计（LCP、CLS、INP、资源加载）         | 性能优化、Lighthouse           |

### 国际化

| 技能            | 覆盖内容                          | 触发场景                 |
| --------------- | --------------------------------- | ------------------------ |
| **i18n-expert** | i18n 框架配置、key 管理、翻译审计 | 多语言配置、翻译遗漏检查 |

### 工具链与元技能

| 技能            | 覆盖内容                                               | 触发场景                     |
| --------------- | ------------------------------------------------------ | ---------------------------- |
| **find-skills** | 技能发现与安装、ClawHub 搜索、技能评估                 | 安装新 Skill、查找可用能力   |
| **swarm**       | 并行任务分发与聚合框架（批处理、子代理扇出、结果聚合） | 批量处理、并行执行、多路并发 |

---

## 行为约束

- 技能包与 MCP 工具互补：MCP 提供实时 API 调用，技能提供静态知识库
- 技能包在对应领域路由的 `资源映射` 表中声明
- 技能包优先于通用知识，避免 Agent 使用过时的经验
