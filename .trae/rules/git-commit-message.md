---
alwaysApply: false
description: 生成 git commit message 时遵循 Conventional Commits 格式
scene: git_message
---

## 语言

使用中文编写提交信息。

## 格式

严格遵循 Conventional Commits 规范：

```
<类型>(<范围>): <描述>

<可选正文>
<可选脚注>
```

## 类型

- **feat** — 新功能
- **fix** — 修复 Bug
- **refactor** — 重构（不涉及功能变更或 Bug 修复）
- **style** — 代码样式调整（格式化、缺失分号等，不影响逻辑）
- **chore** — 构建、CI、依赖等杂项
- **docs** — 仅文档变更
- **test** — 添加或修正测试
- **perf** — 性能优化

## 范围

项目子包或模块，可选值：

- `types` — 类型定义包
- `config` — 配置包
- `dal` — 数据访问层
- `backend` — NestJS 后端
- `frontend` — Nuxt 前端
- `tools` — 工具包
- `utils` — 通用工具包
- `i18n` — 国际化
- 无范围 — 跨包或配置变更

## 描述

- 以动词开头，使用中文
- 首字母小写，句末不加句号
- 准确反映变更内容，而非仓促概括

## 示例

```
feat(dal): 新增 pgsql 骨架，配置 MikroORM 实体扫描路径
fix(backend): 修复用户查询接口分页参数未校验的问题
refactor(frontend): 抽离统计组件中的图表配置逻辑
chore: 升级 TypeScript 至 5.8，同步 catalog 中所有包版本
docs: 补充本地开发环境搭建步骤
```

## 约束

- 标题行（类型 + 范围 + 描述）不超过 72 个英文字符
- 正文如需补充说明，空一行后撰写，每行不超过 72 个字符
