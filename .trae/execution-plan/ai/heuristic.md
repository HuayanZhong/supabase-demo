# Heuristic — AI 规划最佳实践

## Agent 映射

| 任务类型  | 执行 Agent              | 关注重点                           |
| --------- | ----------------------- | ---------------------------------- |
| integrate | ai-integration-engineer | 模型接入、API 封装、密钥管理       |
| chat      | ai-integration-engineer | 对话功能、流式响应、上下文管理     |
| rag       | ai-integration-engineer | Embedding、向量存储、检索质量      |
| agent     | ai-integration-engineer | Tool calling、Agent 编排、状态管理 |

## 扫描先手

1. 接入新 AI 服务前，先搜索项目中是否已有类似集成可参考
2. 新增 AI 功能前，先确认 Supabase 相关配置（Edge Functions、向量库）
3. 查阅 `rules/project-architecture.md` 了解现有技术栈

## 集成模式

| 场景        | 实现位置                                     |
| ----------- | -------------------------------------------- |
| AI API 调用 | `apps/backend/` 中的 Service 层              |
| AI 对话 UI  | `apps/frontend/`（使用已有 RecentChatsCard） |
| 向量检索    | Supabase pgvector + Edge Functions           |
| Agent 编排  | `apps/backend/` 中的编排 Service             |

## 安全实践

- API 调用失败时提供友好的错误提示，不暴露原始错误信息
- 对 AI 返回内容做基本校验后再展示给用户
- 考虑超时和重试机制（AI 服务可能不稳定）

## 模型选择参考

| 场景       | 推荐模型类型                               |
| ---------- | ------------------------------------------ |
| 对话助手   | Chat Completion API                        |
| 文本嵌入   | Embedding API（text-embedding-3-small 等） |
| 结构化输出 | JSON mode 或 Function Calling              |
| Agent      | 支持 Tool Calling 的模型                   |

## 验证

- AI 功能的测试建议手动验证为主（自动测试覆盖核心逻辑层）
- 确认 AI 服务响应时间在可接受范围内
- 检查 Token 消耗，避免超额
