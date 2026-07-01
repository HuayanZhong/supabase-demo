# Frontend 路由

## 领域范围

- **入站条件**：总路由 `router.md` 判定为 `frontend`
- **覆盖路径**：`apps/frontend/` 下所有文件
- **不处理**：后端 API 逻辑、数据库变更、部署配置（应转回总路由重新分发）

## 子任务分类

| 任务类型     | 关键词                 | 对应 Agent         | 说明              |
| ------------ | ---------------------- | ------------------ | ----------------- |
| **create**   | 新建、创建、添加、开发 | ui-designer        | 从零创建组件/页面 |
| **modify**   | 修改、改、更新、调整   | frontend-architect | 修改已有功能      |
| **fix**      | 修复、Bug、报错、异常  | frontend-architect | 排查并修复问题    |
| **refactor** | 重构、优化、清理、提取 | frontend-architect | 代码重构          |
| **style**    | 样式、颜色、间距、排版 | ui-designer        | 纯视觉调整        |
| **i18n**     | 翻译、多语言、Locale   | frontend-architect | 文本/翻译相关     |

## 资源映射

### 通用加载（所有前端任务）

| 资源                               | 说明             |
| ---------------------------------- | ---------------- |
| `rules/frontend/styles.md`         | 样式规范         |
| `rules/frontend/comments.md`       | 注释规范         |
| `rules/frontend/frontend-types.md` | 类型定义规范     |
| `skill/nuxt-ui`                    | Nuxt UI 组件知识 |
| nuxt-ui MCP                        | 组件 API 查询    |

### 按任务类型额外加载

| 任务类型 | 额外资源                                   |
| -------- | ------------------------------------------ |
| i18n     | `rules/frontend/i18n.md`                   |
| create   | 无（通用即可）                             |
| fix      | supabase MCP（如涉及 Auth 问题可查表诊断） |
| refactor | `skill/ui-ux-pro-max`（设计参考）          |

## 调用 Workflow

所有前端任务统一走：

```
workflows/frontend/{task-type}.md
```

如 `workflows/frontend/create.md`、`workflows/frontend/fix.md` 等。
