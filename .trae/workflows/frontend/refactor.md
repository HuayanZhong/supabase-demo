---
description: 前端代码重构，由 frontend-architect agent 执行
---

# 代码重构 Workflow

## 触发条件

- 任务类型为 `refactor`（关键词：重构、优化、清理、提取）
- 执行 Agent：`frontend-architect`
- 覆盖路径：`apps/frontend/`

## 准备工作

### 1. 加载资源

| 资源                               | 说明                             |
| ---------------------------------- | -------------------------------- |
| `rules/frontend/styles.md`         | 样式规范                         |
| `rules/frontend/comments.md`       | 注释规范                         |
| `rules/frontend/frontend-types.md` | 类型定义规范                     |
| `skill/nuxt-ui`                    | Nuxt UI 组件知识                 |
| `nuxt-ui MCP`                      | 组件 API 查询                    |
| `skill/ui-ux-pro-max`              | 设计参考                         |
| `execution-plan/frontend/`         | 规划指引：约束/最佳实践/决策策略 |

### 2. 分析重构范围

- 搜索重复代码、相似组件、冗余逻辑
- 标记可提取为公共组件/composable 的候选
- 确认重构目标：可维护性、性能、一致性

## 执行步骤

### Step 1 — 确定重构策略

- 识别重复模式：搜索项目内相似代码片段
- 确定提取方向：
  - 重复模板 → 提取为公共组件（`components/common/`）
  - 重复逻辑 → 提取为 composable（`composables/`）
  - 重复类型/校验 → 提取到 `packages/types`（转 shared 路由）
  - 重复配置/常量 → 提取到独立文件

### Step 2 — 保持接口

- 重构不改变对外接口和 props 签名
- 如必须改变接口（如 composable 返回值结构调整），先更新所有调用方再改实现
- 确保重构前后的行为等价

### Step 3 — 渐进修改

- 从底层向上层重构（先提取工具函数/composable → 再提取组件 → 最后更新调用方）
- 每步修改后立即验证（`check-types`）
- 避免一次性大规模改动

### Step 4 — 清理

- 删除被替换的废弃代码（确认无其他引用）
- 更新文件 import 路径
- 更新引用目标文件的 barrel exports

## 完成检查

- [ ] 类型通过（`pnpm check-types`）
- [ ] lint 通过（`pnpm lint`）
- [ ] format 通过（`pnpm format`）
- [ ] 行为等价验证（相同输入产生相同输出）
- [ ] 无废弃代码残留
- [ ] import 路径全部正确
- [ ] 重构后代码无重复模式（DRY）

## 输出

- 变更摘要：提取了哪些公共组件/composable、结构如何调整
- 接口说明：新提取的公共模块的 props/参数签名
- 引用映射：旧代码到新代码的迁移说明
