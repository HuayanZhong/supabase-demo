# AI 路由

## 领域范围

- **入站条件**：总路由 `router.md` 判定为 `ai`
- **覆盖路径**：AI 模型集成、智能对话、embedding、Agent 编排
- **不处理**：通用的前端 UI 或后端 API 变更（应转回总路由重新分发）

## 子任务分类

| 任务类型      | 关键词                 | 对应 Agent              | 说明              |
| ------------- | ---------------------- | ----------------------- | ----------------- |
| **integrate** | 接入、集成、对接       | ai-integration-engineer | 接入 AI 模型/服务 |
| **chat**      | 对话、Chat、聊天       | ai-integration-engineer | 对话功能开发      |
| **rag**       | RAG、embedding、向量库 | ai-integration-engineer | 知识库/向量检索   |
| **agent**     | Agent、Tool、编排      | ai-integration-engineer | AI Agent 编排开发 |

## 资源映射

### 通用加载

| 资源                            | 说明                         |
| ------------------------------- | ---------------------------- |
| `rules/project-architecture.md` | 项目架构                     |
| `skill/supabase`                | Supabase 向量/Edge Functions |
| supabase MCP                    | 查询数据库配置               |

### 按任务类型额外加载

| 任务类型  | 额外资源                                      |
| --------- | --------------------------------------------- |
| integrate | 对应 AI 模型的官方文档（通过 WebSearch 查询） |
| rag       | supabase MCP（查 pgvector 扩展是否启用）      |

## 注意事项

- 项目当前的 Supabase 实例没有启用 pgvector 扩展（如需则先通过 supabase MCP 启用）
- 前端已有 `RecentChatsCard.vue` 作为 AI 对话的 UI 占位
- AI 模型密钥必须通过环境变量管理，不可硬编码

## 调用 Workflow

AI 任务走对应 workflow：

```
workflows/ai/{task-type}.md
```
