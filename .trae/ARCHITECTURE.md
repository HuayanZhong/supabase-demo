# Trae AI Engineering Governance — 完整架构

## 治理框架 7 层闭环总览

治理框架由 7 层组成（Layer 0 触发 → Layer 6 进化），形成 "请求 → 路由 → 工作流 → 规划 → 执行 → 评估 → 元治理" 的完整闭环。任务在评估层未通过时进入快循环（re-execute / re-plan），任务完成后写入经验数据触发慢循环（治理文件自迭代）。

```
 ┌─────────────────────────────────────────────────────────────────────────────────────────┐
 │                          用户请求 / 外部触发                                              │
 └─────────────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
╔═══════════════════════════════════════════════════════════════════════════════════════════╗
║                       Layer 0: 触发层 (Trigger)                                          ║
╠═══════════════════════════════════════════════════════════════════════════════════════════╣
║  .trae/rules/language.md + interaction.md + ai-safety.md  ← alwaysApply: true (3 files)  ║
║  → "任何涉及代码变更的任务，必须先执行路由决策"                                           ║
║  → 激活 runtime/router.md                                                                 ║
╚═══════════════════════════════════════════════════════════════════════════════════════════╝
                                          │
                                          ▼
╔═══════════════════════════════════════════════════════════════════════════════════════════╗
║                       Layer 1: 路由层 (Routing)                                           ║
╠═══════════════════════════════════════════════════════════════════════════════════════════╣
║  ┌────────────────────────────────────────────────────────────────────────────────────┐  ║
║  │  .trae/runtime/router.md        ← 总路由入口                                       │  ║
║  │  关键词映射：6 领域 / 冲突优先级表 / 依赖链编排 / 多领域拆分 / 无匹配回退         │  ║
║  └────────────────────────────────────────────────────────────────────────────────────┘  ║
║       ┌─────────────┼────────────┬───────┴───────┬────────────┼─────────────┐            ║
║       ▼             ▼            ▼               ▼            ▼             ▼            ║
║  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         ║
║  │ frontend │ │ backend  │ │ devops   │ │ shared   │ │   ai     │ │ quality  │         ║
║  │router.md │ │router.md │ │router.md │ │router.md │ │router.md │ │router.md │         ║
║  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘         ║
║  冲突优先级: quality(1) > shared(2) > devops(3) > backend/frontend(4) > ai(5)            ║
╚═══════════════════════════════════════════════════════════════════════════════════════════╝
                                          │
                                          ▼
╔═══════════════════════════════════════════════════════════════════════════════════════════╗
║                       Layer 2: 工作流层 (Workflow)                                        ║
╠═══════════════════════════════════════════════════════════════════════════════════════════╣
║  .trae/workflows/        ← 31 个文件（README + 6 领域共 30 个 task-type 文件）           ║
║  每个文件格式: 触发条件 → 准备工作 → 执行步骤 → 完成检查 → 输出                          ║
║  资源表引用: execution-plan/ + execution-engine/ + evaluation/ + agents                  ║
╚═══════════════════════════════════════════════════════════════════════════════════════════╝
                                          │
                                          ▼
╔═══════════════════════════════════════════════════════════════════════════════════════════╗
║                    Layer 3: 执行规划层 (Execution Plan)                                   ║
╠═══════════════════════════════════════════════════════════════════════════════════════════╣
║  .trae/execution-plan/   ← 22 个文件：4 通用 + 6 领域 × 3                                ║
║  每个领域: constraint.md(硬约束) + heuristic.md(最佳实践+Agent映射) + policy.md(决策)    ║
╚═══════════════════════════════════════════════════════════════════════════════════════════╝
                                          │
                                          ▼
╔═══════════════════════════════════════════════════════════════════════════════════════════╗
║                    Layer 4: 执行引擎层 (Execution Engine)                                 ║
╠═══════════════════════════════════════════════════════════════════════════════════════════╣
║  .trae/execution-engine/  ← 22 个文件：4 通用 + 6 领域 × 3                               ║
║  constraint.md 含守卫节点(执行前校验) / heuristic.md 触发 evaluation / policy.md 工具选择 ║
║  执行完成后输出结构化摘要 → 自动触发 evaluation                                          ║
╚═══════════════════════════════════════════════════════════════════════════════════════════╝
                                          │
                                          ▼
╔═══════════════════════════════════════════════════════════════════════════════════════════╗
║                     Layer 5: 评估层 (Evaluation)                                         ║
╠═══════════════════════════════════════════════════════════════════════════════════════════╣
║  .trae/evaluation/        ← 23 个文件：5 通用 + 6 领域 × 3                               ║
║  评估 7 步: ①加载约束 → ②清单对比 → ③质量门禁 → ④回归检查 → ⑤范围检查 → ⑥输出报告 → ⑦写入经验 ║
║  constraint.md 含静默成功检测 / loop-governance.md 循环治理(快循环)                       ║
║    re-execute(≤3) → re-plan(≤2) → 人工介入                                                ║
║    工具去重 / 语义循环 / 静默失败 / 退避 / 上下文压缩 / 目标锚定 / 成本熔断               ║
╚═══════════════════════════════════════════════════════════════════════════════════════════╝
                       │                                                      │
          ┌────────────┴────────────┐                              ┌─────────┴──────────┐
          ▼                         ▼                              ▼                    ▼
    ┌──────────┐            ┌──────────────┐               ┌──────────────┐     ┌──────────────┐
    │  通过 ✅  │            │  不通过 ❌    │               │  通过 ✅  │     │  不通过 ❌    │
    └────┬─────┘            └──────┬───────┘               └──────┬───────┘     └──────┬───────┘
         │                         │                              │                    │
         │                         ▼                              │                    ▼
         │                ╔════════════════╗                       │           ╔════════════════╗
         │                ║ 循环治理(快循环)║                      │           ║ 循环治理(快循环)║
         │                ║ loop-governance║                      │           ║ loop-governance║
         │                ╚════════════════╝                      │           ╚════════════════╝
         │                         │                              │                    │
         └──────────┬──────────────┘                              └────────┬───────────┘
                    ▼                                                      ▼
╔═══════════════════════════════════════════════════════════════════════════════════════════╗
║                    Layer 6: 元治理层 (Evolution)                                          ║
╠═══════════════════════════════════════════════════════════════════════════════════════════╣
║  .trae/evolution/         ← 4 个文件                                                      ║
║  每次任务完成后 ← 写入经验数据（无论通过/不通过）                                        ║
║  进化 6 步: ①收集 → ②聚合(10次/7天) → ③分析 → ④提案 → ⑤应用 → ⑥验证(3次同类任务)        ║
║  修改目标: execution-plan / execution-engine / evaluation / workflows 的治理文件           ║
╚═══════════════════════════════════════════════════════════════════════════════════════════╝
                                          │
                                          ▼
╔═══════════════════════════════════════════════════════════════════════════════════════════╗
║                      支持层: 公共资源                                                      ║
╠═══════════════════════════════════════════════════════════════════════════════════════════╣
║  .trae/rules/          项目显式规范（language.md + interaction.md + ai-safety.md 作为触发）║
║  .trae/agents/         子智能体定义（8 个 Agent 文件）                                     ║
║  .trae/commands/       CLI 命令（资源同步）                                               ║
║  .trae/templates/      代码脚手架模板（6 领域 scaffold）                                  ║
║  .trae/memory/         经验记忆库（profile / experience / patterns / sessions）           ║
║  .trae/resources/      资源注册与同步                                                     ║
║  .trae/references/     参考资料（subagent-guide）                                         ║
║  .trae/skills/         技能包（当前: ui-ux-pro-max）                                      ║
║  .trae/logging.md      日志格式标准（ROUTE/PLAN/ENGINE/GUARD/EVAL/LOOP/EVOL）           ║
║  .trae/mcp.json        MCP 服务配置                                                       ║
║                                                                                           ║
║  外部 MCP: nuxt-ui / supabase / tavily_search / chrome-devtools / windows-cli            ║
╚═══════════════════════════════════════════════════════════════════════════════════════════╝
```

---

## 完整目录树

> 统计口径：仅 `.md` 文件计入文件数；`mcp.json` 等配置/数据文件单独标注。子目录文件数用 `(×N)` 标注。

```
.trae/                         治理框架根目录
│
├── ARCHITECTURE.md            本文件 — 架构总览
├── logging.md                 日志格式标准
├── mcp.json                   MCP 服务配置
│
├── rules/                     Layer 0 触发层 — 23 个 .md
│   ├── README.md
│   ├── ai-safety.md           alwaysApply: true
│   ├── interaction.md         alwaysApply: true
│   ├── language.md            alwaysApply: true
│   ├── code-style.md
│   ├── document-query.md
│   ├── git-commit-message.md
│   ├── naming.md
│   ├── review.md
│   ├── ai/                    (×4) prompt-injection, rag-hygiene, secrets, tool-perms
│   ├── backend/               (×2) database, nestjs
│   ├── devops/                (×1) pipeline
│   ├── frontend/              (×4) comments, frontend-types, i18n, styles
│   ├── quality/               (×2) security, testing
│   └── shared/                (×1) monorepo
│
├── runtime/                   Layer 1 路由层 — 8 个 .md
│   ├── README.md
│   ├── router.md              总路由入口
│   ├── ai/router.md
│   ├── backend/router.md
│   ├── devops/router.md
│   ├── frontend/router.md
│   ├── quality/router.md
│   └── shared/router.md
│
├── workflows/                 Layer 2 工作流层 — 31 个 .md
│   ├── README.md
│   ├── ai/                    (×4) agent, chat, integrate, rag
│   ├── backend/               (×6) api, create, data, fix, modify, refactor
│   ├── devops/                (×5) ci, config, deploy, deps, hooks
│   ├── frontend/              (×6) create, fix, i18n, modify, refactor, style
│   ├── quality/               (×5) api-test, perf, review, security, test
│   └── shared/                (×4) add-package, i18n, lint, types
│
├── execution-plan/            Layer 3 执行规划层 — 22 个 .md
│   ├── README.md
│   ├── constraint.md          通用硬约束
│   ├── heuristic.md           通用最佳实践
│   ├── policy.md              通用决策策略
│   ├── ai/                    (×3) constraint, heuristic, policy
│   ├── backend/               (×3) constraint, heuristic, policy
│   ├── devops/                (×3) constraint, heuristic, policy
│   ├── frontend/              (×3) constraint, heuristic, policy
│   ├── quality/               (×3) constraint, heuristic, policy
│   └── shared/                (×3) constraint, heuristic, policy
│
├── execution-engine/          Layer 4 执行引擎层 — 22 个 .md
│   ├── README.md
│   ├── constraint.md          通用硬约束（含守卫节点）
│   ├── heuristic.md           通用执行指引
│   ├── policy.md              通用工具选择策略
│   ├── ai/                    (×3) constraint, heuristic, policy
│   ├── backend/               (×3) constraint, heuristic, policy
│   ├── devops/                (×3) constraint, heuristic, policy
│   ├── frontend/              (×3) constraint, heuristic, policy
│   ├── quality/               (×3) constraint, heuristic, policy
│   └── shared/                (×3) constraint, heuristic, policy
│
├── evaluation/                Layer 5 评估层 — 23 个 .md
│   ├── README.md
│   ├── constraint.md          通用评估门禁（含静默成功检测）
│   ├── heuristic.md           通用检查项
│   ├── policy.md              通用通过/阻断决策
│   ├── loop-governance.md     循环治理（快循环）
│   ├── ai/                    (×3) constraint, heuristic, policy
│   ├── backend/               (×3) constraint, heuristic, policy
│   ├── devops/                (×3) constraint, heuristic, policy
│   ├── frontend/              (×3) constraint, heuristic, policy
│   ├── quality/               (×3) constraint, heuristic, policy
│   └── shared/                (×3) constraint, heuristic, policy
│
├── evolution/                 Layer 6 元治理层 — 4 个 .md
│   ├── README.md
│   ├── constraint.md          进化硬约束（证据/安全/不可自改）
│   ├── heuristic.md           进化 6 步指引
│   └── policy.md              自动/审批分界、熔断、回滚
│
├── memory/                    支持层 经验记忆库 — 8 个 .md
│   ├── README.md
│   ├── constraint.md          记忆写入约束
│   ├── heuristic.md           记忆组织启发式
│   ├── policy.md              记忆保留/淘汰策略
│   ├── experience/README.md   任务经验数据（原 experience/ 已合并至此）
│   ├── patterns/README.md     重复模式归档
│   ├── profile/README.md      项目画像
│   └── sessions/README.md     会话记录
│
├── agents/                    支持层 子智能体 — 9 个 .md
│   ├── README.md
│   ├── ai-integration-engineer.md
│   ├── api-test-pro.md
│   ├── backend-architect.md
│   ├── compliance-checker.md
│   ├── devops-architect.md
│   ├── frontend-architect.md
│   ├── performance-expert.md
│   └── ui-designer.md
│
├── commands/                  支持层 CLI 命令 — 2 个 .md
│   ├── README.md
│   └── sync-resources.md      资源同步命令
│
├── templates/                 支持层 代码脚手架 — 20 个 .md
│   ├── README.md
│   ├── constraint.md          模板硬约束
│   ├── heuristic.md           模板使用启发式
│   └── scaffold/              6 领域脚手架
│       ├── README.md
│       ├── ai/                (×2) rag-pipeline, service
│       ├── backend/           (×4) controller, entity, migration, service
│       ├── devops/            (×3) ci-workflow, config-file, turbo-pipeline
│       ├── frontend/          (×3) component, composable, page
│       ├── quality/           (×2) api-test, unit-test
│       └── shared/            (×2) i18n, types
│
├── resources/                 支持层 资源注册 — 3 个 .md
│   ├── README.md
│   ├── registry.md            资源注册表
│   └── sync.md                资源同步状态
│
├── references/                支持层 参考资料 — 2 个 .md
│   ├── README.md
│   └── subagent-guide.md      Subagent 协作指南
│
└── skills/                    支持层 技能包 — 2 个 .md（+ 数据/脚本文件）
    ├── README.md
    └── ui-ux-pro-max/
        ├── SKILL.md           技能定义
        ├── data/              UI/UX 知识库 CSV（charts/colors/icons/landing 等）
        │   └── stacks/        多框架适配数据（react/vue/nuxt-ui/nextjs 等）
        └── scripts/           Python 检索脚本（core/search/design_system）
```

> 注：`skills/` 下另有 `nuxt-ui/`、`supabase/`、`supabase-postgres-best-practices/`、`turborepo/` 等空占位目录，尚未提供 SKILL.md，不计入治理框架文件统计。

---

## 一级模块说明

| 模块                | 层级               | 一句话说明                                                       |
| ------------------- | ------------------ | ---------------------------------------------------------------- |
| `rules/`            | Layer 0 触发层     | 项目显式规范，其中 3 个 alwaysApply 文件作为治理框架的入口触发器 |
| `runtime/`          | Layer 1 路由层     | 总路由入口 + 6 领域子路由，按关键词映射决定任务归属和冲突优先级  |
| `workflows/`        | Layer 2 工作流层   | 6 领域共 30 个 task-type 文件，定义每个任务的执行步骤与完成检查  |
| `execution-plan/`   | Layer 3 执行规划层 | 6 领域 × (constraint/heuristic/policy) 三件套，约束如何规划任务  |
| `execution-engine/` | Layer 4 执行引擎层 | 6 领域 × 三件套，含守卫节点和工具选择策略，执行后触发评估        |
| `evaluation/`       | Layer 5 评估层     | 6 领域 × 三件套 + loop-governance，7 步评估流程与快循环治理      |
| `evolution/`        | Layer 6 元治理层   | 基于证据(≥3次/10)的治理文件自迭代，6 步进化周期                  |
| `memory/`           | 支持层             | 经验记忆库，承载 profile/experience/patterns/sessions 四类数据   |
| `agents/`           | 支持层             | 8 个子智能体定义（架构师、测试、合规、性能、UI 等）              |
| `commands/`         | 支持层             | CLI 命令，当前提供资源同步能力                                   |
| `templates/`        | 支持层             | 6 领域代码脚手架模板，新建文件时复用既有模式                     |
| `resources/`        | 支持层             | 资源注册表与同步状态                                             |
| `references/`       | 支持层             | 参考资料，当前包含 Subagent 协作指南                             |
| `skills/`           | 支持层             | 技能包，当前内置 ui-ux-pro-max（含 CSV 知识库与 Python 脚本）    |

---

## 关键数据

| 指标                      | 数值                                                        |
| ------------------------- | ----------------------------------------------------------- |
| **治理层数**              | 7 层（Layer 0-6）                                           |
| **总 .md 文件数**         | 181 个（+ mcp.json 配置文件）                               |
| **领域数量**              | 6 个（frontend / backend / devops / shared / ai / quality） |
| **Agent 数量**            | 8 个                                                        |
| **Workflow 文件**         | 31 个（README + 30 task-type）                              |
| **execution-plan 文件**   | 22 个（4 通用 + 6 领域 × 3）                                |
| **execution-engine 文件** | 22 个（4 通用 + 6 领域 × 3）                                |
| **evaluation 文件**       | 23 个（5 通用 + 6 领域 × 3）                                |
| **rules 文件**            | 23 个（9 通用 + 6 领域共 14）                               |
| **templates 文件**        | 20 个（3 通用 + scaffold 17）                               |
| **memory 文件**           | 8 个（4 通用 + 4 子目录 README）                            |
| **循环入口**              | re-execute(≤3) / re-plan(≤2) / 人工介入                     |
| **循环保护**              | 工具去重 / 语义检测 / 静默失败 / 退避 / 成本熔断 / 目标锚定 |

---

## 循环关系

```
              快循环（任务级修复）
               loop-governance.md
          ┌─────────────────────────┐
          │  Evaluation ❌          │
          │     → re-execute (≤3)   │
          │     → re-plan (≤2)      │
          │     → 人工介入           │
          └─────────────────────────┘
                    ↑
                    │ 每次迭代写入经验
                    ▼
          ┌─────────────────────────┐
          │  慢循环（治理级进化）     │
          │  evolution/             │
          │     收集 → 聚合 → 分析   │
          │     → 提案 → 应用 → 验证 │
          └─────────────────────────┘
                    │
                    ▼
          修改治理文件 → 下次任务生效
```

---

## 文件数分布（按一级目录）

| 目录                | .md 文件数 | 说明                                             |
| ------------------- | ---------- | ------------------------------------------------ |
| `(根目录)`          | 2          | ARCHITECTURE.md, logging.md（另含 mcp.json）     |
| `agents/`           | 9          | README + 8 个 Agent                              |
| `commands/`         | 2          | README + sync-resources                          |
| `evaluation/`       | 23         | 5 通用 + 6 领域 × 3                              |
| `evolution/`        | 4          | README + 三件套                                  |
| `execution-engine/` | 22         | 4 通用 + 6 领域 × 3                              |
| `execution-plan/`   | 22         | 4 通用 + 6 领域 × 3                              |
| `memory/`           | 8          | 4 通用 + 4 子目录 README                         |
| `references/`       | 2          | README + subagent-guide                          |
| `resources/`        | 3          | README + registry + sync                         |
| `rules/`            | 23         | 9 通用 + 6 领域共 14                             |
| `runtime/`          | 8          | README + 总路由 + 6 领域路由                     |
| `skills/`           | 2          | README + ui-ux-pro-max/SKILL.md（另含数据/脚本） |
| `templates/`        | 20         | 3 通用 + scaffold 17                             |
| `workflows/`        | 31         | README + 6 领域共 30                             |
| **合计**            | **181**    |                                                  |

---

_生成时间: 2026-07-02_
