# 工作流：对话功能开发

对应 agent：`ai-integration-engineer`

---

## 1. 触发条件

- 请求包含：对话、Chat、聊天、AI 对话界面、消息列表等关键词
- 需要为 AI 模型开发对话交互功能

## 2. 准备工作

| 资源                               | 用途                               |
| ---------------------------------- | ---------------------------------- |
| `rules/project-architecture.md`    | 了解项目结构                       |
| `rules/frontend/comments.md`       | 前端注释规范                       |
| `rules/frontend/frontend-types.md` | 前端类型定义规范                   |
| `rules/frontend/i18n.md`           | 国际化规范                         |
| `rules/frontend/styles.md`         | 样式与响应式规范                   |
| `workflows/ai/integrate.md`        | 确认 AI Service 已就绪（依赖前置） |
| 已有组件 `RecentChatsCard.vue`     | AI 对话入口的 UI 占位              |
| supabase MCP                       | 如需要存储对话记录                 |
| `execution-plan/ai/`               | 规划指引：约束/最佳实践/决策策略   |
| `execution-engine/ai/`             | 执行指引：约束/最佳实践/决策策略   |

## 3. 执行步骤

### Step 1：确认对话交互模式

- 流式（streaming）还是非流式（一次性返回）
- 是否支持多轮对话，上下文窗口大小
- 对话上下文管理策略：内存保持 / 数据库持久化 / 滑动窗口
- 确认 AI Service 已正确集成（参考 `integrate.md`）

### Step 2：后端对话 API

创建对话相关后端模块：

```
apps/backend/src/
└── modules/chat/
    ├── chat.module.ts              — 模块定义
    ├── chat.controller.ts          — 对话端点（POST /chat/completions）
    ├── chat.service.ts             — 对话业务逻辑
    ├── chat.service.spec.ts        — 单元测试
    └── dto/
        ├── chat-request.dto.ts     — 请求参数校验
        └── chat-response.dto.ts    — 响应格式定义
```

- POST `/chat/completions` 接收 `{ messages: Message[], stream?: boolean }`
- 流式响应使用 SSE（Server-Sent Events）
- 非流式响应返回完整 JSON
- 接入 Supabase 数据库保存对话历史（如需要持久化）

### Step 3：前端集成

基于已有 `RecentChatsCard.vue` 扩展或新建对话页面：

```
apps/frontend/app/
├── pages/chat.vue                            — 对话页面
├── components/business/chat/
│   ├── ChatMessages.vue                      — 消息列表
│   └── ChatInput.vue                         — 输入框
└── composables/useChat.ts                    — 对话逻辑 composable
```

- `useChat.ts` 封装发送消息、接收响应、管理消息状态
- 流式模式使用 `EventSource` 或 `fetch` + `ReadableStream`
- 非流式模式使用标准 `fetch` POST
- 消息渲染区分用户/助手角色，支持 Markdown 渲染
- 利用已有 `RecentChatsCard.vue` 作为入口跳转到对话页面
- 国际化文本统一管理，新增 locale key 遵循 `i18n.md` 规范

### Step 4：验证

- 发送对话请求，确认流式/非流式响应正确
- 多轮对话上下文保持正确，不丢失历史
- 消息渲染正常：角色区分、Markdown、代码块
- 错误状态（网络超时、API 错误）在前端有反馈
- 确认 `RecentChatsCard.vue` 导航到对话页面正常

## 4. 完成检查

- [ ] 对话 API 端点正常工作，流式/非流式按需支持
- [ ] 多轮对话上下文管理正确
- [ ] 前端消息渲染正确，角色区分明确
- [ ] 错误状态在前端有友好提示
- [ ] `RecentChatsCard.vue` 作为入口正常工作
- [ ] 国际化文本覆盖所有新增 UI 文案

## 5. 输出

- `chat.module.ts` + `chat.controller.ts` + `chat.service.ts` — 后端对话模块
- `chat-request.dto.ts` + `chat-response.dto.ts` — 请求/响应 DTO
- `pages/chat.vue` — 对话页面
- `ChatMessages.vue` + `ChatInput.vue` — 对话 UI 组件
- `useChat.ts` — 对话逻辑 composable
