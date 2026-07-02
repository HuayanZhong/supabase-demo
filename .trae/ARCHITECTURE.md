# Trae AI — 治理架构 v2

## 从 7 层到 3 层

v1 的 7 层架构（L0-L6）在 2 个真实任务中实测 **7% 覆盖率** — 大半层级从未触发。
**根因：文档级约定无强制力，入口文件太长被跳过。**

v2 削去 5 个死层（runtime/workflows/execution-plan/execution-engine/evaluation），
保留 3 个有效机制：

```
用户任务
    │
    ▼
┌──────────────────────────────────────┐
│  ① alwaysApply 注入                 │
│     ai-safety.md (38 行)             │
│     → 语言 + 交互 + 安全 + 预检清单  │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│  ② 领域规则（场景触发）              │
│     rules/{domain}/*.md              │
│     + code-style / comments / naming │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│  ③ Pre-commit 硬门禁                 │
│     oxfmt → oxlint → check-types     │
│     走不过去 = 不能提交              │
└──────────────────────────────────────┘
```

## 文件结构

```
.trae/
├── ARCHITECTURE.md         # 本文档
├── rules/                  # AI 行为 + 编码规范（唯一入口）
│   ├── ai-safety.md        # alwaysApply — 语言/交互/安全/预检清单
│   ├── code-style.md       # 场景触发 — 代码风格
│   ├── comments.md         # 场景触发 — 注释规范
│   ├── naming.md           # 场景触发 — 命名规范
│   ├── review.md           # 场景触发 — 代码审查
│   ├── document-query.md   # 场景触发 — 文档查询
│   ├── git-commit-message.md      # 场景触发
│   ├── language.md         # （已合并至 ai-safety.md）
│   ├── interaction.md      # （已合并至 ai-safety.md）
│   ├── frontend/           # 前端领域规则
│   ├── backend/            # 后端领域规则
│   ├── devops/             # DevOps 规则
│   ├── quality/            # 质量规则
│   ├── ai/                 # AI 集成规则
│   └── shared/             # 共享包规则
├── evolution/              # 经验学习
├── agents/                 # 子 Agent 定义
├── memory/                 # 会话 + 经验数据
└── _archive/               # v1 归档层（仅参考，不参与执行）
    ├── runtime/            # 原 L1 路由层
    ├── workflows/          # 原 L2 工作流层
    ├── execution-plan/     # 原 L3 规划层
    ├── execution-engine/   # 原 L4 执行层
    └── evaluation/         # 原 L5 评估层
```

## 生效机制

| 机制               | 原理                                            |        强制力         |
| ------------------ | ----------------------------------------------- | :-------------------: |
| `alwaysApply` 注入 | IDE 每次对话自动加载 ai-safety.md               | 中（依赖 agent 阅读） |
| 领域规则匹配       | agent 按任务关键词自行加载对应 rules/           | 低（依赖 agent 自律） |
| Pre-commit hook    | `git commit` 时硬跑 lint + format + check-types |  **高（不可绕过）**   |

## 设计原则

1. **少即是多** — alwaysApply 内容不超过 40 行，一眼看完
2. **只有硬门禁才可信** — 文档约定靠不住，hook 才靠得住
3. **死代码归档而非删除** — v1 的 107 个文件仍在 `_archive/` 中，需要时可恢复
