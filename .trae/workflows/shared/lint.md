---
description: 共享 lint 配置变更，由 devops-architect agent 执行
---

# 共享 Lint 配置变更 Workflow

## 触发条件

- 任务类型为 `lint`（关键词：Lint、规则、ESLint、oxlint、配置）
- 执行 Agent：`devops-architect`
- 覆盖路径：`packages/lint-config/`

## 准备工作

### 1. 加载资源

| 资源                            | 说明              |
| ------------------------------- | ----------------- |
| `rules/project-architecture.md` | 项目架构          |
| `skill/turborepo`               | Monorepo 构建知识 |

### 2. 确认变更范围

- **新增规则**：需要启用哪些 lint 规则
- **修改规则**：现有规则的 severity 或参数调整
- **禁用规则**：需要关闭哪些规则
- **插件扩展**：是否新增 lint 插件/预设拓展

## 执行步骤

### Step 1 — 确认 lint 规则变更范围

- 读取 `packages/lint-config/` 下的配置文件，了解当前规则集
- 确认变更是全局规则调整还是特定文件类型的规则调整
- 分析变更对各 app 代码的潜在影响（预计会有多少报错）
- 如有插件变更，先在 `packages/lint-config/package.json` 中添加依赖

### Step 2 — 修改配置

- 修改 `packages/lint-config/` 下对应配置文件
- 遵循原则：
  - **保持现有风格** — 与现有配置文件的格式、缩进、命名风格一致
  - **渐进调整** — 如需禁用某规则，先在局部禁用，确认无影响后再全局关闭
  - **明确注释** — 在配置文件中注明规则用途和启用原因
  - **优先使用项目已有工具**（oxlint），不引入新的 lint 工具

### Step 3 — 验证

- 运行 `pnpm --filter lint-config lint`（如有）确认配置包自身无问题
- 运行 `pnpm lint` 确认各 app lint 通过
- 如有预期内的新报错，逐一修复或确认规则调整正确
- 运行 `pnpm format` 确认格式检查不受影响

## 完成检查

- [ ] 配置语法正确（无 JSON/YAML 语法错误）
- [ ] `pnpm lint` 通过（所有 app）
- [ ] `pnpm format` 通过
- [ ] 配置文件中添加了规则用途的注释说明
- [ ] 禁用的规则已确认不影响代码质量
- [ ] 新增规则已确认各 app 无违规代码

## 输出

- 变更摘要：新增/修改/禁用了哪些 lint 规则
- 文件变更清单：修改了 `packages/lint-config/` 下的哪些配置
- 影响评估：本次规则调整对代码库的影响范围
- 验证结果：lint 和 format 结果
