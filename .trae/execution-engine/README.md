# Execution Engine — 任务执行引擎

## 职责

`execution-engine/` 负责指导 Agent 在执行阶段如何调用工具、按什么顺序操作、遇到错误如何处理。是"动手干活"的规范层。

```
execution-plan/{domain}/        ← 规划：行为规则
          │
          ▼
execution-engine/{domain}/       ← 执行：具体怎么做
          │
          ▼
  实际执行（MCP / Skill / CLI 调用）
          │
          ▼
evaluation/{domain}/             ← 评估：检查结果
```

---

## 文件结构

```
.trae/execution-engine/
├── README.md                # 本文档
├── constraint.md            # 通用执行约束（含守卫节点）
├── heuristic.md             # 通用执行流程
├── policy.md                # 通用执行决策
├── frontend/
│   ├── constraint.md        # 前端 — MCP 调用、组件验证
│   ├── heuristic.md         # 前端 — 各任务类型执行顺序
│   └── policy.md            # 前端 — 工具选择、错误处理
├── backend/
│   ├── constraint.md        # 后端 — supabase MCP、psql 禁用
│   ├── heuristic.md         # 后端 — API 构建顺序
│   └── policy.md            # 后端 — DB 查询、Module 注册
├── devops/
│   ├── constraint.md        # DevOps — 语法验证、路径处理
│   ├── heuristic.md         # DevOps — CI/Docker 执行流程
│   └── policy.md            # DevOps — 依赖升级策略
├── shared/
│   ├── constraint.md        # 共享 — Zod 导出规范
│   ├── heuristic.md         # 共享 — 类型/i18n/lint 修改流程
│   └── policy.md            # 共享 — Key 命名、变更决策
├── ai/
│   ├── constraint.md        # AI — MCP 强制使用、API key
│   ├── heuristic.md         # AI — 集成/RAG/流式步骤
│   └── policy.md            # AI — 模型选择、降级方案
└── quality/
    ├── constraint.md        # 质量 — 全量测试、安全基线
    ├── heuristic.md         # 质量 — test/review/perf 流程
    └── policy.md            # 质量 — 缺陷优先级、工具选择
```

---

## 守卫节点

执行前必须先通过守卫节点检查，包括：工具去重、范围校验、工具合法性、破坏性操作确认、依赖链上下文完整性。拦截不消耗重试计数。

---

## 行为约束

- 执行完成后必须调用 `evaluation/` 评估结果
- 每次 MCP/工具调用前必须确认其描述和参数
- 执行过程按步骤输出日志，供排查使用
