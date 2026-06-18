---
alwaysApply: true
---

# 通用规则

## 语言

- 所有回答使用中文
- 代码注释使用中文
- commit message 使用中文

## 项目结构

Monorepo 项目，使用 pnpm workspace + turborepo：

- `apps/backend` — NestJS 后端
- `apps/frontend` — Nuxt 前端
- `packages/lint-config` — 共享 lint 配置

## 代码风格

- 使用项目已有的工具链（oxlint、oxfmt、prettier）
- 遵循现有代码风格，不引入新约定
- 优先使用项目内已有的工具函数，不重复造轮子

## 交互方式

- 直接给出方案，不要反复确认
- 改动前先读取相关文件
- 完成后简要说明改了什么、验证了什么
