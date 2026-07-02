---
alwaysApply: false
description: 项目中必须遵守的显式规则，包括全局规则和按领域细化的编码规范。
---

# Rules — 项目规范与规则

## 职责

`rules/` 定义了项目中必须遵守的显式规则。规则必须是**强制约束**（必须/不得/禁止），不含操作指南。

```
language.md + interaction.md + ai-safety.md (alwaysApply: true)   ← 每次对话自动加载
                              │
                              ▼
                        runtime/router.md                          ← 激活路由流程
                              │
                              ▼
                    rules/{domain}/*.md                            ← 领域特有约束
```

---

## 文件结构

```
.trae/rules/
├── README.md                 # 本文档
├── language.md               # 语言约束（alwaysApply）
├── interaction.md            # 交互方式约束（alwaysApply）
├── ai-safety.md              # AI 行为安全约束（alwaysApply）
├── code-style.md             # 代码风格约束
├── comments.md               # 注释约束（全项目通用）
├── document-query.md         # 文档查询约束
├── naming.md                 # 命名规范约束
├── review.md                 # 代码审查约束
├── git-commit-message.md     # Commit Message 规范
│
├── frontend/
│   ├── comments.md           # 注释约束
│   ├── frontend-types.md     # 类型定义约束
│   ├── i18n.md               # 国际化约束
│   └── styles.md             # 样式约束
│
├── backend/
│   ├── nestjs.md             # NestJS 开发约束
│   └── database.md           # 数据库与 MikroORM 约束
│
├── devops/
│   └── pipeline.md           # CI/CD 与部署约束
│
├── quality/
│   ├── testing.md            # 测试约束
│   └── security.md           # 安全约束
│
├── ai/
│   ├── prompt-injection.md  # 提示注入保护
│   ├── rag-hygiene.md       # RAG 卫生规范
│   ├── secrets.md           # 密钥安全约束
│   └── tool-perms.md        # 工具权限约束
│
├── backend/
│   ├── nestjs.md             # NestJS 开发约束
│   └── database.md           # 数据库与 MikroORM 约束
│
├── devops/
│   └── pipeline.md           # CI/CD 与部署约束
│
├── frontend/
│   ├── comments.md           # 注释约束
│   ├── frontend-types.md     # 类型定义约束
│   ├── i18n.md               # 国际化约束
│   └── styles.md             # 样式约束
│
├── quality/
│   ├── testing.md            # 测试约束
│   └── security.md           # 安全约束
│
└── shared/
    └── monorepo.md           # Monorepo 与依赖管理约束
```

---

## 规则分层

| 层级                    | 文件                                                                                                   | 作用范围         |
| ----------------------- | ------------------------------------------------------------------------------------------------------ | ---------------- |
| **全局（alwaysApply）** | `language.md`、`interaction.md`、`ai-safety.md                                                         | 每次对话自动加载 |
| **场景触发**            | `code-style.md`、`comments.md`、`document-query.md`、`naming.md`、`review.md`、`git-commit-message.md` | 匹配场景时加载   |
| **领域约束**            | `frontend/*.md`、`backend/*.md`、`devops/*.md`、`ai/*.md`、`quality/*.md`、`shared/*.md`               | 对应领域任务     |

---

## 行为约束

- `alwaysApply: true` 的文件保持精简（仅 3 个），避免每次对话加载过多内容
- 各领域规则只约束对应路径的文件
- 规则不替代 `execution-plan/` 中的约束层，两者互补
