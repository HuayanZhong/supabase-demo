---
alwaysApply: false
description: 当 AI 生成 git commit message 时使用。适用于通过源代码管理面板生成提交信息、自动提交代码、或手动要求 AI 编写 commit message 的场景。
scene: git_message
---

# AI 生成 Commit Message 规则

采用 Conventional Commits 规范。

## 格式

```
<type>(<scope>): <subject>
```

## Type

| Type     | 用途                     |
| -------- | ------------------------ |
| feat     | 新功能                   |
| fix      | 修复 bug                 |
| refactor | 重构（不改变外部功能）   |
| chore    | 构建、依赖、工具链等杂项 |
| docs     | 文档变更                 |
| style    | 代码格式（不影响逻辑）   |
| test     | 添加或修改测试           |
| perf     | 性能优化                 |
| ci       | CI/CD 配置变更           |
| build    | 构建系统或外部依赖变更   |

## Scope

Monorepo 项目，scope 用包名或目录名：

- `backend` — NestJS 后端
- `frontend` — Nuxt 前端
- `lint-config` — 共享 lint 配置
- `deps` — 依赖更新
- `husky` — Git hooks
- `turbo` — Turborepo 配置

跨多个包时省略 scope。

## Subject

- 中文描述，简洁明了
- 不加句号
- 不超过 50 字符
- 聚焦意图，不复述 diff

## 禁止

- 不加 emoji
- 不包含密钥、路径、时间戳
- 不写 "update files"、"fix bug" 等无意义描述
- 不加 body，除非改动复杂到需要解释 WHY（如 breaking change、架构决策）

## 示例

```
feat(backend): 添加 JWT 刷新令牌接口
fix(frontend): 修复用户资料页空值崩溃问题
chore(deps): 升级 typescript 至 6.0
refactor(lint-config): 提取共享的 oxlint 规则
docs: 更新 AGENTS.md 添加 hook 排查说明
```
