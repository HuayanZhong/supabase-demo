---
alwaysApply: false
description: 项目中必须遵守的显式规则，包括全局规则和按领域细化的编码规范。
---

# Rules — 项目规范与规则

## 职责

`rules/` 定义了项目中必须遵守的显式规则，包括全局规则和按领域细化的编码规范。

```
general-rules.md (alwaysApply: true)   ← 每次对话自动加载
          │
          ▼
    runtime/router.md                   ← 激活路由流程
          │
          ▼
rules/{domain}/*.md                     ← 领域特有规范
```

---

## 文件结构

```
.trae/rules/
├── README.md                 # 本文档
├── general-rules.md          # 全局规则（alwaysApply，路由触发入口）
├── git-commit-message.md     # Git 提交信息规范
├── project-architecture.md   # 项目架构概览
└── frontend/
    ├── comments.md           # 注释规范
    ├── frontend-types.md     # 前端类型定义规范
    ├── i18n.md               # 国际化处理规范
    └── styles.md             # 样式书写规范
```

---

## 规则分层

| 层级         | 文件                                               | 作用范围                     |
| ------------ | -------------------------------------------------- | ---------------------------- |
| **全局触发** | `general-rules.md`                                 | 每次对话自动加载，引导至路由 |
| **全局约束** | `git-commit-message.md`、`project-architecture.md` | 整个项目                     |
| **领域规范** | `frontend/*.md`                                    | 前端开发                     |

---

## 行为约束

- `general-rules.md` 为 `alwaysApply: true`，确保每次对话语义理解时自动加载
- 各领域规范只约束对应路径的文件
- 规范不替代 `execution-plan/` 中的约束层，两者互补
