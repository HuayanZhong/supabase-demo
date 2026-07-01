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

| 关键词                          | 说明                              |
| ------------------------------- | --------------------------------- |
| 页面、组件、样式、布局          | UI 相关                           |
| 菜单、导航、路由                | 页面结构                          |
| 主题、图标、暗色模式            | 视觉相关                          |
| 表单、输入、按钮                | 交互元素                          |
| 在页面中使用、显示翻译文本      | i18n 使用（非翻译文件管理）       |
| 动效、过渡、动画                | 交互反馈                          |
| 显示、展示、渲染、数据显示      | UI 数据展示（区别于后端数据管理） |
| 修复、Bug、报错、异常、显示问题 | UI 层问题排查                     |
| **例外：涉及翻译文件的增删改**  | → 路由到 **shared**，非 frontend  |

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

## 冲突优先级

当一个请求同时匹配多个领域时，按以下优先级裁决：

| 优先级    | 领域                   | 场景                                                   |
| --------- | ---------------------- | ------------------------------------------------------ |
| 1（最高） | **quality**            | 明确要求测试/审查/审计的任务优先                       |
| 2         | **shared**             | 涉及共享包（types/i18n/lint）变更优先于各 app 内的使用 |
| 3         | **devops**             | 基础设施/配置变更优先于业务开发                        |
| 4         | **backend / frontend** | 具体业务开发                                           |
| 5（最低） | **ai**                 | AI 集成通常作为其他任务的子任务                        |

> 例：用户说"给 types 加一个新 schema 并在后端使用"→ shared 优先（先定义类型），
> 完成后再由 shared 子路由回抛给总路由分配后端任务

## 路由日志输出

**每次路由决策完成后，必须按以下标准输出日志**（日志格式标准见 `../logging.md`）：

```
[ROUTE:parse]     STATUS | 解析用户请求           | input=用户输入原文
[ROUTE:match]     STATUS | 匹配领域               | domain=匹配到的领域;agent=分配的子智能体
[ROUTE:conflict]  STATUS | 冲突检查               | conflict=有/无;priority=裁决结果
[ROUTE:chain]     STATUS | 依赖链编排              | steps=N;order=按→连接
[ROUTE:fallback]  STATUS | 无匹配回退              | reason=原因;fallback=去向
[ROUTE:re-route]  COUNT  | 重新路由                | reason=新依赖/冲突;count=N/2;max=2
```

当且仅当上述日志全部 OK，路由阶段才算完成。有任意 FAIL 或 BLOCKED，任务不得继续。

## 多领域任务处理

当一个请求明确涉及多个领域时（而非冲突），分两种情况处理。

### 无依赖的多领域

子任务间无先后依赖，可独立执行：

1. **拆分子任务** — 将请求拆为独立的子任务
2. **分别路由** — 每个子任务独立分派到对应领域
3. **并行执行** — 子任务可同时进行
4. **汇总结果** — 各子任务完成后合并输出

### 有依赖的多领域

子任务间存在先后依赖时，不并行处理，按依赖顺序逐个执行：

1. **拆分子任务 + 标注依赖链** — 分析任务间的依赖关系，标注执行顺序（A → B → C）
2. **路由排序** — 按依赖链排序：被依赖者优先，依赖者在后
3. **逐个执行 + 传递上下文** — 先执行 A，将其输出（配置值、API 结构等）作为上下文传递给 B
4. **汇总结果** — 所有子任务完成后合并输出
5. **执行中发现新依赖** → 可触发 re-route 追加子任务

> 依赖链的识别由读取多领域任务的 AI 自主判断，不需要用户手动标注。判断依据：A 的输出是否是 B 的输入（如存储配置是 API 的前提，API 结构是前端的前提）。

### 上下文传递规范

依赖链中相邻步骤间通过结构化上下文交接：

```
上一步输出格式：
{
  "summary": "完成了什么",
  "outputs": [
    { "key": "配置项名称", "value": "..." },
    { "key": "定义/结构", "value": "..." }
  ],
  "affected_files": ["变更的文件路径"],
  "notes": "后续步骤注意事项（可选）"
}
```

传递规则：

1. 上一步的 subagent 在完成时按上述格式输出 context
2. 下一步的 subagent 在启动时读取上一步的 context 作为已知输入
3. 所有 context 累积，最终汇总结果

例如："添加用户头像上传功能"

```
涉及 frontend（上传组件） + backend（文件 API）+ devops（存储配置）

依赖关系：devops → backend → frontend

Step 1 — devops（devops-architect）
  完成：配置存储桶
  输出 context：{ outputs: [{key:"BUCKET_NAME", value:"growth-os-uploads"},
                             {key:"BUCKET_REGION", value:"ap-east-1"}] }
                          ↓
Step 2 — backend（backend-architect）
  读取 context.BUCKET_NAME + context.BUCKET_REGION 作为已知配置
  完成：写文件上传 API
  输出 context：{ outputs: [{key:"API_ENDPOINT", value:"POST /api/upload"},
                             {key:"REQUEST_FORMAT", value:"multipart/form-data"},
                             {key:"RESPONSE_STRUCTURE", value:"{ url: string }"}] }
                          ↓
Step 3 — frontend（ui-designer）
  读取 context.API_ENDPOINT + context.RESPONSE_STRUCTURE 作为已知输入
  完成：做上传组件
```

## 调用 Workflow

子路由分配任务类型后，按以下顺序调用 workflow：

1. 查找 `workflows/{domain}/{task-type}.md` — 如有则按步骤执行
2. **文件不存在** → 执行 Agent 根据 router.md 的资源映射表和项目 best practice 独立决策
3. 仍无法决策 → 回退到对应 Agent 的通用能力

> workflow 文件是为高频任务类型提供标准化参考，缺文件不会阻塞执行。Agent 始终以完成任务为目标，workflow 是指导而非约束。

## 无法分类

关键词不匹配任何领域时，回退到默认逻辑：

- 读取 `.trae/agents/` 下所有 description 匹配 Subagent
- 无匹配则走 SOLO Agent 自主判断
