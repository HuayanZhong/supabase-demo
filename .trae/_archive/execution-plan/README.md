# Execution Plan — 任务执行规划

## 职责

`execution-plan/` 负责为每个领域提供三层规划指引，约束 Agent 在执行任务时的行为边界、推荐做法和决策策略。

```
workflows/{domain}/{task-type}.md   ← 工作流：定义执行步骤
          │
          ▼
execution-plan/{domain}/             ← 规划：定义行为规则
  ├── constraint.md   硬约束 — 红线，不能违反
  ├── heuristic.md    最佳实践 — 建议怎么做
  └── policy.md       决策策略 — 拿不准时怎么选
          │
          ▼
execution-engine/{domain}/   ← 按规划执行
```

---

## 文件结构

```
.trae/execution-plan/
├── README.md                # 本文档
├── constraint.md            # 通用硬约束
├── heuristic.md             # 通用最佳实践
├── policy.md                # 通用决策策略
├── frontend/
│   ├── constraint.md        # 前端 — UI 组件、Nuxt 约定
│   ├── heuristic.md         # 前端 — Composition API、页面结构
│   └── policy.md            # 前端 — 组件库选择、样式方案
├── backend/
│   ├── constraint.md        # 后端 — MikroORM、NestJS 模式
│   ├── heuristic.md         # 后端 — 模块组织、错误处理
│   └── policy.md            # 后端 — DB 查询策略、Auth 方案
├── devops/
│   ├── constraint.md        # DevOps — CI/Docker/安全基线
│   ├── heuristic.md         # DevOps — 配置管理、部署流程
│   └── policy.md            # DevOps — 环境策略、依赖升级
├── shared/
│   ├── constraint.md        # 共享 — Zod 导出、i18n 同步
│   ├── heuristic.md         # 共享 — 类型管理、翻译流程
│   └── policy.md            # 共享 — Key 命名、Breaking Change
├── ai/
│   ├── constraint.md        # AI — API key 安全、模型约束
│   ├── heuristic.md         # AI — 集成流程、RAG 构建
│   └── policy.md            # AI — 模型选择、降级策略
└── quality/
    ├── constraint.md        # 质量 — 测试覆盖、安全门禁
    ├── heuristic.md         # 质量 — 测试策略、审查流程
    └── policy.md            # 质量 — 缺陷定级、修复优先级
```

---

## 三层架构说明

| 层级           | 定位                   | 典型内容                                           |
| -------------- | ---------------------- | -------------------------------------------------- |
| **Constraint** | 硬约束，不可违反       | 禁止使用 raw SQL、必须导出类型、API key 不得硬编码 |
| **Heuristic**  | 最佳实践，建议遵守     | 推荐 Composition API、先写 DTO 再写 Entity         |
| **Policy**     | 决策策略，有分歧时使用 | 多个方案优先级、什么时候降级、怎么选库             |

---

## 行为约束

- constraint 是硬红线，违反会触发 Evaluation 不通过
- heuristic 是建议，Agent 可根据实际情况调整
- policy 只在有多个可行方案时启用
- 所有规划文件按领域划分，互不干扰
