# Heuristic — 模板选用最佳实践

## 选择骨架

| 场景                                      | 选用骨架                                                             |
| ----------------------------------------- | -------------------------------------------------------------------- |
| 新建 NestJS Module + Controller + Service | `backend/entity.md` + `backend/controller.md` + `backend/service.md` |
| 只新增 API 端点（已有 Module）            | `backend/controller.md` + `backend/service.md`                       |
| 只新增数据库实体                          | `backend/entity.md` + `backend/migration.md`                         |
| 新建 Nuxt 页面                            | `frontend/page.md`                                                   |
| 新建可复用 UI 组件                        | `frontend/component.md`                                              |
| 新建 composable 逻辑                      | `frontend/composable.md`                                             |
| 需要在共享包中新增类型                    | `shared/types.md`                                                    |
| 新增 i18n 翻译条目                        | `shared/i18n.md`                                                     |
| 新建 GitHub Actions CI                    | `devops/ci-workflow.md`                                              |
| 修改 turbo.json 管线                      | `devops/turbo-pipeline.md`                                           |
| 新增/修改环境变量                         | `devops/config-file.md`                                              |
| 为 Service / Composable 写单测            | `quality/unit-test.md`                                               |
| 为 API 端点写集成测试                     | `quality/api-test.md`                                                |
| 新建 AI Chat Service                      | `ai/service.md`                                                      |
| 构建 RAG 检索增强                         | `ai/rag-pipeline.md`                                                 |

## 生成顺序

- **依赖优先**：先建 entity → 再建 service → 再建 controller
- **独立并行**：无依赖的骨架可同时生成（如多个独立组件）
- **引用先行**：生成前先 Read 被依赖的文件，确认现有接口签名

## 套用方法

1. 先读骨架文件，理解结构
2. 用实际业务命名替换骨架中的示例名称
3. 填充业务逻辑，保持骨架原有的分层结构
4. 生成后对照项目同类文件做一致性检查

## 后处理

- 生成的文件必须注册到对应 Module（NestJS）或添加到 nuxt.config.ts 的 components 配置（Nuxt）
- 涉及数据库实体的，执行 migration:create 生成迁移文件
- 涉及 API 的，确认 route path 不会与现有路由冲突
