---
description: 从零新建前端组件或页面，由 ui-designer agent 执行
---

# 新建组件/页面 Workflow

## 触发条件

- 任务类型为 `create`（关键词：新建、创建、添加、开发）
- 执行 Agent：`ui-designer`
- 覆盖路径：`apps/frontend/`

## 准备工作

### 1. 加载资源

| 资源                               | 说明                                                   |
| ---------------------------------- | ------------------------------------------------------ |
| `rules/frontend/styles.md`         | 样式规范（语义色、Tailwind、响应式）                   |
| `rules/frontend/comments.md`       | 注释规范（中文注释、不写无用注释）                     |
| `rules/frontend/frontend-types.md` | 类型定义规范（Zod schema、命名约定）                   |
| `skill/nuxt-ui`                    | Nuxt UI 组件知识库                                     |
| `nuxt-ui MCP`                      | 组件 API 查询（`search-components` / `get-component`） |

### 2. 确认需求

- 明确组件/页面的功能范围和交互模式
- 确认是新建页面（`app/pages/`）、业务组件（`app/components/business/`）还是通用组件（`app/components/common/`）
- 确认是否涉及共享类型（`packages/types/`）—— 如是，转 shared 路由

### 3. 检查现有代码

- 搜索项目中是否已有可复用组件或模式
- 确认 Nuxt UI 中是否有可直接使用的组件（通过 `search-components` 查询）

## 执行步骤

### Step 1 — 设计结构

- 确定组件/页面在 Nuxt 4 目录结构中的位置（`pages/`、`components/`、`composables/`）
- 拆分子组件：如果页面复杂，拆分为多个小组件
- 确定数据流：props 向下、emit 向上

### Step 2 — 定义类型

- 如有数据交互，先在组件内或通过 `packages/types` 定义 Zod schema
- schema 命名 `xxxSchema`，推断类型命名 `XxxSchema`
- 跨模块共享的类型必须定义在 `packages/types` 中（转 shared 路由处理）

### Step 3 — 编写代码

按以下顺序编写：

1. **模板** — 先使用 Nuxt UI 组件组装结构，遵循语义色和移动端优先
2. **脚本** — `<script setup lang="ts">`，定义 props/emits/composables
3. **样式** — Tailwind utility-first，不写自定义 CSS

### Step 4 — i18n

- 所有用户可见文本使用 `useI18n().t('key')`，不从翻译文件手动读 JSON
- 如果翻译 key 尚不存在，记录新 key 清单（转 shared 路由处理翻译文件）

### Step 5 — 注释

- 长页面/复杂组件用 `<!-- 区域名 -->` 标记模板区块
- script 内部用 `//` 分隔不同功能块
- 不过度注释，类型本身就是文档

## 完成检查

- [ ] 类型通过（`pnpm check-types`）
- [ ] lint 通过（`pnpm lint`）
- [ ] format 通过（`pnpm format`）
- [ ] i18n key 可在翻译文件中找到（记录缺失 key，不阻塞当前步骤）
- [ ] 响应式布局正常（移动端 → 平板 → 桌面）
- [ ] 暗色模式兼容（组件使用语义色，无硬编码色值）
- [ ] 无重复的组件/功能（确认没有替代实现）

## 输出

- 变更摘要：新建了哪些文件、每个文件的用途
- 翻译 key 清单（如有新增，指向 shared 路由）
- 引用关系：新组件被哪些页面/组件引用
