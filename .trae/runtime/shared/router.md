# Shared 路由

## 领域范围

- **入站条件**：总路由 `router.md` 判定为 `shared`
- **覆盖路径**：
  - `packages/types/` — 共享类型定义（Zod v4 schema）
  - `packages/i18n/` — 国际化翻译文件
  - `packages/lint-config/` — 共享 lint 配置
- **不处理**：各 app 内的局部类型或翻译使用（应路由到 frontend/backend）

## 子任务分类

| 任务类型        | 关键词                 | 对应 Agent         | 说明               |
| --------------- | ---------------------- | ------------------ | ------------------ |
| **types**       | 类型、Schema、Zod      | backend-architect  | 新增或修改共享类型 |
| **i18n**        | 翻译、Locale、新增语言 | frontend-architect | 翻译文件变更       |
| **lint**        | Lint、规则、配置       | devops-architect   | 共享 lint 配置变更 |
| **add-package** | 新建包、新增模块       | devops-architect   | 新增共享包         |

## 资源映射

### 通用加载

| 资源                               | 说明                           |
| ---------------------------------- | ------------------------------ |
| `rules/frontend/frontend-types.md` | 类型定义规范（packages/types） |
| `rules/frontend/i18n.md`           | i18n 规范（packages/i18n）     |

### 按任务类型额外加载

| 任务类型    | 额外资源                                      |
| ----------- | --------------------------------------------- |
| types       | Zod v4 文档（`https://zod.dev/v4`）           |
| i18n        | `apps/frontend/nuxt.config.ts`（locale 配置） |
| add-package | `pnpm-workspace.yaml` + `turbo.json`          |

## 注意事项

- **packages/types**：所有跨模块共享类型必须放这里，不在 apps/ 下重复定义
- **packages/i18n**：新增翻译需同步更新 4 处（翻译文件、index.ts、package.json、nuxt.config.ts）
- **packages/lint-config**：变更后需验证各 app 能正常 lint

## 调用 Workflow

共享包任务走对应 workflow：

```
workflows/shared/{task-type}.md
```
