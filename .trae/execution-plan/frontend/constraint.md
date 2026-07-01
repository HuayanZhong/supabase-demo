# Constraint — 前端规划硬约束

## 组件约束

- 使用不熟悉的 Nuxt UI 组件前，必须通过 `nuxt-ui MCP → get-component / search-components` 确认 API
- 不确定图标的正确名称时，必须通过 `search-icons` 查询
- 不得创建全局自定义 CSS 文件或修改 `main.css` 之外的全局样式
- 不得硬编码色值，必须使用语义色（`color="primary"`、`text-default`、`bg-muted` 等）

## 数据约束

- 涉及表单数据展示时，必须先 Read 对应 API 的响应结构
- 涉及列表/表格数据时，必须确认分页、排序、过滤约定
- 不得在前端自行计算业务逻辑（应调用后端 API）

## i18n 约束

- 所有用户可见文本必须使用 `useI18n().t()`，不得硬编码
- 新增翻译 key 前，必须检查对应翻译文件是否已存在
- 翻译 key 不存在时，不阻塞当前任务，但必须在输出中记录

## 范围约束

- 不得修改 `apps/backend/` 下的代码
- 不得修改 `packages/types/` 下的类型定义
- 翻译文件变更（增删改 key/语言）不归前端处理，记录清单转 shared 路由
