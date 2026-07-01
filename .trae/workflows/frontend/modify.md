---
description: 修改已有前端功能，由 frontend-architect agent 执行
---

# 修改已有功能 Workflow

## 触发条件

- 任务类型为 `modify`（关键词：修改、改、更新、调整）
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
| `execution-plan/frontend/`         | 规划指引：约束/最佳实践/决策策略 |

### 2. 理解变更范围

- 读取目标文件，理解现有逻辑
- 确认是修改组件（`components/`）、页面（`pages/`）、composable（`composables/`）还是布局（`layouts/`）
- 搜索目标文件的引用方，评估影响范围

## 执行步骤

### Step 1 — 分析依赖

- 确认目标文件的输入/输出依赖
  - 组件：props、emits、slots、inject
  - composable：参数、返回值、内部状态
  - 页面：路由参数、composable 调用
- 标记所有引用该文件的模块

### Step 2 — 加载上下文

- 查阅相关规范文件，确保改动符合项目约定
- 如涉及样式调整，查阅 `styles.md`
- 如涉及新翻译 key，查阅 `i18n.md`（但翻译文件修改转 shared 路由）

### Step 3 — 修改实现

- **保持现有代码风格**和目录结构
- 遵循现有命名约定和组件模式
- 不改动目标文件的功能边界（即只改需求指定的部分）
- 如修改 props/emits 签名，同步更新所有调用方

### Step 4 — 回归验证

- 确认目标文件的直接调用方不受影响
- 确认间接依赖（composable 返回值变化等）不受影响
- 确认修改后的行为与需求一致

## 完成检查

- [ ] 类型通过（`pnpm check-types`）
- [ ] lint 通过（`pnpm lint`）
- [ ] format 通过（`pnpm format`）
- [ ] 所有引用目标文件的模块已同步更新
- [ ] 未引入未使用的 import 或变量
- [ ] 原行为未被静默移除（除非需求明确要求）

## 输出

- 变更摘要：修改了哪些文件、改了什么
- 影响范围：哪些模块因本次修改被连带更新
- 回归说明：确认原有功能不受影响
