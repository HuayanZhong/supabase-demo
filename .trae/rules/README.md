---
alwaysApply: false
description: 项目中必须遵守的显式规则索引
---

# Rules — 项目规范与规则

## 加载层级

```
ai-safety.md (alwaysApply: true) ← 每次对话自动注入（语言 + 交互 + 安全 + 预检清单）
         │
         ▼
场景规则（agent 按任务关键词自行加载）
         │
         ▼
领域规则（按 frontend/backend/shared/devops/ai/quality 匹配）
```

## 文件结构

```
.trae/rules/
├── README.md                 # 本文档
├── ai-safety.md              # alwaysApply — 语言/交互/安全/预检清单
├── language.md               # （已合并至 ai-safety.md，保留参考）
├── interaction.md            # （已合并至 ai-safety.md，保留参考）
├── code-style.md             # 代码风格约束
├── comments.md               # 注释约束（全项目通用）
├── document-query.md         # 文档查询约束
├── naming.md                 # 命名规范约束
├── review.md                 # 代码审查约束
├── git-commit-message.md     # Commit Message 规范
├── frontend/
│   ├── comments.md           # 前端注释约束
│   ├── frontend-types.md     # 类型定义约束
│   ├── i18n.md               # 国际化约束
│   └── styles.md             # 样式约束
├── backend/
│   ├── nestjs.md             # NestJS 开发约束
│   └── database.md           # 数据库约束
├── devops/
│   └── pipeline.md           # CI/CD 与部署约束
├── quality/
│   ├── testing.md            # 测试约束
│   └── security.md           # 安全约束
├── ai/
│   ├── prompt-injection.md   # 提示注入保护
│   ├── rag-hygiene.md        # RAG 卫生规范
│   ├── secrets.md            # 密钥安全约束
│   └── tool-perms.md         # 工具权限约束
└── shared/
    └── monorepo.md           # Monorepo 依赖管理约束
```

## 规则分层

| 层级             | 文件                                                                                     | 作用范围         |
| ---------------- | ---------------------------------------------------------------------------------------- | ---------------- |
| **全局始终加载** | `ai-safety.md`                                                                           | 每次对话自动注入 |
| **场景触发**     | `code-style.md`、`comments.md`、`naming.md` 等                                           | 匹配场景时加载   |
| **领域约束**     | `frontend/*.md`、`backend/*.md`、`devops/*.md`、`ai/*.md`、`quality/*.md`、`shared/*.md` | 对应领域任务     |

## 强制门禁

`.husky/pre-commit` 在每次 `git commit` 时硬跑：

```
oxfmt --fix → oxlint --fix → pnpm check-types
```

走不过去就不能提交。这是唯一有 100% 强制力的机制。
