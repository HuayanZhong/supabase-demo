---
description: 纯样式/视觉调整，由 ui-designer agent 执行
---

# 样式调整 Workflow

## 触发条件

- 任务类型为 `style`（关键词：样式、颜色、间距、排版）
- 执行 Agent：`ui-designer`
- 覆盖路径：`apps/frontend/`

## 准备工作

### 1. 加载资源

| 资源                         | 说明                                           |
| ---------------------------- | ---------------------------------------------- |
| `rules/frontend/styles.md`   | 样式规范（核心约束：语义色、响应式、暗色模式） |
| `skill/nuxt-ui`              | Nuxt UI 组件知识库（组件样式 API、主题定制）   |
| `nuxt-ui MCP`                | 组件样式相关 API 查询                          |
| `execution-plan/frontend/`   | 规划指引：约束/最佳实践/决策策略               |
| `execution-engine/frontend/` | 执行指引：约束/最佳实践/决策策略               |
| `evaluation/frontend/`       | 评估指引：约束/最佳实践/决策策略               |

### 2. 确认样式需求

- 明确具体变更：什么元素、从什么值改成什么值
- 确认是全局样式还是组件局部样式
- 确认是否涉及响应式适配

## 执行步骤

### Step 1 — 确认边界

- 确认变更不违反 `styles.md` 的约束：
  - ✅ Tailwind utility-first
  - ✅ 语义色（`color="primary"`、`text-default`、`bg-muted`）
  - ✅ 移动端优先、响应式
  - ✅ 暗色模式兼容
  - ❌ 不硬编码色值
  - ❌ 不新增全局样式文件
  - ❌ 不覆盖 `--ui-*` CSS 变量

### Step 2 — 修改实现

- **Tailwind 类优先**：在模板中直接使用 Tailwind utility 类
  ```vue
  <div class="flex items-center gap-2 p-4">
  ```
- **如需自定义 CSS**：仅限使用 `@apply` 组合已有 utility 类，不写原始 CSS 属性
- **全局样式**：只允许在 `app/assets/css/main.css` 中修改
- **Nuxt UI 组件样式**：通过组件的 `class` / `ui` prop 定制，不覆盖组件内部样式类

### Step 3 — 验证

- **响应式适配**：基础样式面向最小屏幕，`md:` / `lg:` 叠加大屏样式
- **暗色模式兼容**：使用语义色（`text-default` / `bg-muted`），不加 `dark:` 类
- **视觉一致性**：确认改后效果与项目其他部分风格一致

## 完成检查

- [ ] 无硬编码色值（全部使用语义色）
- [ ] 无新增全局样式文件
- [ ] 响应式布局正常（移动端 → 平板 → 桌面）
- [ ] 暗色模式正常
- [ ] 字体使用 `font-sans` / `font-mono`，无硬编码字体
- [ ] lint 通过（`pnpm lint`）
- [ ] format 通过（`pnpm format`）

## 输出

- 变更摘要：改了什么样式、改动了哪些文件
- 视觉对比：修改前后的视觉效果说明
