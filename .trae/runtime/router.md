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

## Fast-Path 快路径（BUG-001 修复）

并非所有任务都需要走完整 7 层闭环。低风险任务走快路径，仅经过路由 + 守卫 + 日志，跳过 execution-plan 和 evaluation。

### Fast-Path 判定条件

**同时满足以下条件时走快路径**：

| 条件               | 说明                                                    |
| ------------------ | ------------------------------------------------------- |
| 任务类型           | 重命名 / 格式修复 / 文档修订 / 查询 / 解释 / 单文件编辑 |
| 无文件创建/删除    | 不涉及新建或删除文件（重命名例外，需破坏性守卫确认）    |
| 无跨域影响         | 仅涉及单一领域，无依赖链                                |
| 无破坏性命令       | 不含 delete/rm/drop/清理 等关键词（重命名例外）         |
| 用户未要求完整流程 | 用户没有明确要求"走完整流程"/"严格治理"                 |

### Fast-Path 流程

```
用户请求
    ↓
[ROUTE:parse]       → 识别意图
[ROUTE:match]       → 匹配领域
[ROUTE:fast-path]   → 判定走快路径（OK / FALLBACK 到完整流程）
    ↓
[GUARD:scope]       → 范围守卫（无 plan 时降级为 WARN）
[GUARD:destructive] → 破坏性守卫（重命名等操作触发确认）
    ↓
执行（直接由主 Agent 完成，不分派 subagent）
    ↓
[ENGINE:done]       → 输出执行摘要
    ↓
[MEM:write]         → 写入 sessions/ 摘要
```

### Fast-Path 日志

```
[ROUTE:fast-path] OK     | 走快路径 | reason=低风险;type=重命名
[ROUTE:fast-path] FALLBACK | 回退完整流程 | reason=含破坏性;type=删除
```

### 不走 Fast-Path 的场景

以下场景必须走完整 7 层流程，不得走快路径：

- 涉及数据库变更（migration / seed / schema）
- 涉及部署 / CI/CD 配置
- 涉及密钥 / 凭证 / 安全相关
- 涉及跨领域依赖链
- 涉及 3 个以上文件修改
- 用户明确要求"严格治理"/"完整流程"
- evolution 阶段的自迭代变更

### Fast-Path 与强制机制

文档级约定无法保证执行。实际强制机制需要通过以下方式落地（提案，待人工确认是否启用）：

1. **husky pre-commit hook**（推荐）— 校验本次提交是否包含 `[ROUTE:parse]` 日志（快路径或完整流程均可），无日志则警告
2. **Trae IDE 规则触发**（依赖 IDE 能力）— 在 `.trae/rules/ai-safety.md` 增加"任务开始前必须输出 `[ROUTE:parse] START`"
3. **会话自检**（最低保障）— 任务完成时输出追踪路径摘要，无 ROUTE 日志则标记为"未走治理流程"

## 依赖链增强（BUG-011/012/013/015 修复）

### 路径契约（BUG-012 修复）

依赖链中每一步必须输出路径契约，供下游步骤消费：

| 步骤     | 输出契约                                 | 消费方           |
| -------- | ---------------------------------------- | ---------------- |
| shared   | `packages/types/dist/index.d.ts`         | backend/frontend |
| backend  | `apps/backend/dist/main.js`              | devops/frontend  |
| frontend | `apps/frontend/.output/server/index.mjs` | devops           |

路径契约写入 `[ROUTE:chain] OK | path_contract=xxx` 日志，下游步骤通过读取该日志获取路径。

### 并行步骤执行（BUG-013 修复）

当多个步骤无依赖关系时，标记为并行：

```
[ROUTE:chain] OK | 并行步骤 | parallel=[backend,frontend];depends_on=shared
```

并行步骤的执行规则：

- 共享 scope 守卫的"父步骤 scope"（如 shared 的 scope）
- 各自独立的 execution-engine 实例
- 任一并行步骤失败 → 触发回滚策略
- 并行步骤的日志用 `parallel_id` 关联

### 回滚策略（BUG-011 修复）

依赖链中某步骤失败时，按以下策略处置已执行步骤：

| 失败位置         | 回滚动作                                                            |
| ---------------- | ------------------------------------------------------------------- |
| 步骤 1（shared） | 无需回滚（首个步骤）                                                |
| 步骤 N（中间）   | 评估步骤 1~N-1 的影响：可保留则标记"待人工确认"；不可保留则逆向回滚 |
| 步骤最后         | 不回滚前序步骤，仅标记失败步骤                                      |

回滚判定原则：

- **可保留**：前序步骤的产出是通用基础设施（types、配置），后续任务可复用
- **不可保留**：前序步骤的产出仅服务于失败步骤（如为某 API 专门加的字段）

回滚日志：

```
[ROUTE:rollback] WARN | 回滚评估 | failed_step=backend;previous=shared;action=可保留
[ROUTE:rollback] WARN | 回滚执行 | failed_step=backend;previous=shared;action=逆向回滚
```

### 循环依赖检测（BUG-015 修复）

依赖链编排前必须执行循环检测，算法：

```
1. 构建依赖图：节点=步骤，边=依赖关系
2. DFS 遍历，维护 visited 栈
3. 遇到已在栈中的节点 → 检测到循环
4. 输出循环路径 → 阻断编排
```

循环检测日志：

```
[ROUTE:chain] FAIL | 循环依赖检测 | cycle=A→B→A;action=阻断;fallback=人工介入
```

处置规则：

- 检测到循环 → 不编排，直接回退到人工介入
- 不尝试自动打破循环（风险过高）

## Hotfix 路径（BUG-016 修复）

### Hotfix 判定条件

同时满足以下条件时走 hotfix 路径：

- 用户明确说"紧急"/"hotfix"/"线上 bug"/"立即修复"
- 任务类型为 fix（非 create/modify/refactor）
- 不涉及架构变更

### Hotfix 流程

```
[ROUTE:parse]       START  | 解析用户请求 | input=紧急修复 xxx
[ROUTE:match]       OK     | 匹配领域 | domain=xxx
[ROUTE:hotfix]      OK     | 走 hotfix 路径 | reason=紧急修复
[PLAN:simplify]     OK     | 简化规划 | skipped=detailed-plan;kept=scope+guard
[ENGINE:step]       OK     | 执行修复
[EVAL:simplify]     OK     | 简化评估 | skipped=full-eval;kept=门禁+静默检测
[MEM:write]         OK     | 写入会话 | tag=hotfix
```

### Hotfix 与 Fast-Path 的区别

| 维度     | Fast-Path      | Hotfix                |
| -------- | -------------- | --------------------- |
| 任务类型 | 低风险简单任务 | 紧急修复              |
| 守卫     | 保留           | 保留                  |
| 规划     | 跳过           | 简化（保留 scope）    |
| 评估     | 跳过           | 简化（保留门禁+静默） |
| 日志     | 必须输出       | 必须输出              |

### Hotfix 后续

hotfix 完成后，必须在下一个非 hotfix 任务中补做：

- 完整的 execution-plan（补规划）
- 完整的 evaluation（补评估）
- 写入 experience 标记"hotfix 待补评估"

## 多任务调度（BUG-017 修复）

### 多任务识别

当用户输入包含多个独立任务时（如"同时做 3 件事"），按以下规则调度：

```
[ROUTE:parse]   START  | 解析用户请求 | multi_task=true
[ROUTE:split]   OK     | 任务拆分 | tasks=N;domains=[...]
[ROUTE:schedule] OK    | 调度策略 | strategy=parallel_if_no_dep;max_parallel=3
```

### 调度策略

| 任务关系         | 调度策略               |
| ---------------- | ---------------------- |
| 无依赖           | 并行执行（上限 3 个）  |
| 有依赖           | 按依赖链串行           |
| 部分依赖部分独立 | 独立的并行，依赖的串行 |
| 共享文件         | 串行（避免冲突）       |

### 多任务并发守卫

- 单任务内工具调用上限：30（不变）
- 多任务总并发上限：3（避免资源争用）
- 共享文件检测：两个任务都修改同一文件 → 强制串行

多任务并发日志：

```
[GUARD:concurrent] OK   | 多任务调度 | tasks=3;parallel=2;serial=1;reason=依赖关系
[GUARD:concurrent] WARN  | 共享文件冲突 | file=xxx;action=强制串行
```

## 无法分类

关键词不匹配任何领域时，回退到默认逻辑：

- 读取 `.trae/agents/` 下所有 description 匹配 Subagent
- 无匹配则走 SOLO Agent 自主判断
