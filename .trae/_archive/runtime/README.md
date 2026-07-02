# Runtime — 任务路由模块

## 职责

`runtime/` 负责接收用户请求，按关键词分类到对应的技术领域，决定由哪个 Agent 执行以及加载哪些资源。

```
用户请求
    │
    ▼
┌──────────────────────┐
│   runtime/router.md   │   ← 总路由：关键词 → 领域
└──────┬───────────────┘
       │
       ├── runtime/frontend/router.md
       ├── runtime/backend/router.md
       ├── runtime/devops/router.md
       ├── runtime/shared/router.md
       ├── runtime/ai/router.md
       └── runtime/quality/router.md
               │
               ▼
         workflows/{domain}/{task-type}.md   ← 由各模块自行维护
```

---

## 文件结构

```
.trae/runtime/
├── README.md            # 本文档
├── router.md            # 总路由入口
├── frontend/router.md   # 前端领域路由
├── backend/router.md    # 后端领域路由
├── devops/router.md     # DevOps 领域路由
├── shared/router.md     # 共享包领域路由
├── ai/router.md         # AI 领域路由
└── quality/router.md    # 质量领域路由
```

---

## 总路由 (router.md)

**功能定位**: 任务路由的总闸门，负责接收用户请求并分发到对应领域。

### 核心机制

| 组件         | 说明                                  |
| ------------ | ------------------------------------- |
| **入站处理** | 接收用户请求，提取关键词              |
| **领域映射** | 基于关键词匹配 6 个领域               |
| **任务拆分** | 支持多领域任务自动拆分                |
| **回退机制** | 无匹配时回退到 Subagent 或 SOLO Agent |

### 领域分类规则

| 领域         | 覆盖路径         | 关键词示例                            |
| ------------ | ---------------- | ------------------------------------- |
| **Frontend** | `apps/frontend/` | 页面、组件、样式、布局、表单、动效    |
| **Backend**  | `apps/backend/`  | API、数据库、Auth、Controller、中间件 |
| **DevOps**   | CI/CD、部署配置  | CI/CD、Docker、环境变量、依赖、Husky  |
| **Shared**   | `packages/`      | 类型、Schema、翻译、Lint              |
| **AI**       | AI 模型集成      | AI、LLM、Chat、Embedding、RAG、Agent  |
| **Quality**  | 测试、审查、安全 | 单元测试、E2E、性能、安全、漏洞       |

### 冲突优先级

当一个请求同时匹配多个领域时，按以下优先级裁决：

| 优先级    | 领域                   | 场景                                                   |
| --------- | ---------------------- | ------------------------------------------------------ |
| 1（最高） | **quality**            | 明确要求测试/审查/审计的任务优先                       |
| 2         | **shared**             | 涉及共享包（types/i18n/lint）变更优先于各 app 内的使用 |
| 3         | **devops**             | 基础设施/配置变更优先于业务开发                        |
| 4         | **backend / frontend** | 具体业务开发                                           |
| 5（最低） | **ai**                 | AI 集成通常作为其他任务的子任务                        |

### 多领域任务处理

当一个请求明确涉及多个领域时：拆分子任务 → 分别路由 → 汇总结果。

---

## 子路由结构

每个领域子路由遵循统一格式：

1. **领域范围** — 入站条件、覆盖路径、不处理范围
2. **子任务分类** — 任务类型 + 关键词 + 对应 Agent 的映射表
3. **资源映射** — 通用资源 + 按任务类型额外加载的资源
4. **注意事项** — 领域特有约定
5. **调用 Workflow** — 指向 `workflows/{domain}/{task-type}.md`

各子路由详情见对应 `runtime/{domain}/router.md` 文件。

---

## 行为约束

- runtime 只做**分发决策**，不做具体执行
- 具体执行步骤由 `workflows/` 或其他下游模块定义
- 当 `workflows/{domain}/{task-type}.md` 不存在时，Agent 根据资源映射和 best practice 自主决策
