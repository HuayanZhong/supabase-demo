---
description: 排查并修复前端 Bug，由 frontend-architect agent 执行
---

# 修复 Bug Workflow

## 触发条件

- 任务类型为 `fix`（关键词：修复、Bug、报错、异常）
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
| `supabase MCP`                     | 如涉及 Auth 问题可查表诊断       |
| `execution-plan/frontend/`         | 规划指引：约束/最佳实践/决策策略 |
| `execution-engine/frontend/`       | 执行指引：约束/最佳实践/决策策略 |

### 2. 收集信息

- 收集完整的错误信息（错误消息、堆栈跟踪、截图）
- 确认 Bug 的复现步骤和触发条件
- 确认影响的浏览器/设备范围
- 确认是否新功能引入还是长期存在的 Bug

## 执行步骤

### Step 1 — 复现 Bug

- 在开发环境下按复现步骤操作
- 观察浏览器控制台错误、网络请求状态
- 记录可复现的最低条件

### Step 2 — 排查根因

按以下路径逐一排查：

1. **类型错误** — 检查 Zod schema 与数据是否一致，`check-types` 是否报错
2. **运行时错误** — 检查 undefined/null 访问、异步竞态、composable 未正确初始化
3. **API 调用** — 检查请求路径、参数、响应格式；涉及 Supabase Auth 用 MCP 查表
4. **状态管理** — 检查响应式状态更新时机、watch 触发条件
5. **组件交互** — 检查 props/emits 传递是否正确、Nuxt UI 组件 API 是否用对

### Step 3 — 修复

- **最小修改原则**：只改问题区域，不涉及无关代码
- 修复前先考虑回归风险
- 修复后添加必要注释说明原因（特别是非显而易见的修复逻辑）
- 如修复涉及类型定义，确认是否需要同步更新 `packages/types`（转 shared 路由）

### Step 4 — 验证

- 确认 Bug 不再复现（按复现步骤重新操作）
- 回归验证关联功能
- 确认没有引入新类型错误或 lint 警告

## 完成检查

- [ ] Bug 不再可复现
- [ ] 类型通过（`pnpm check-types`）
- [ ] lint 通过（`pnpm lint`）
- [ ] format 通过（`pnpm format`）
- [ ] 回归验证通过（关联功能正常）
- [ ] 修改范围最小化（不包含无关改动）
- [ ] 修复逻辑添加了必要注释（如属非显而易见场景）

## 输出

- Bug 根因说明（简要、技术性）
- 修改了哪些文件、改了什么
- 回归验证范围
