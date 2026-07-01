# 工作流：接入 AI 模型/服务

对应 agent：`ai-integration-engineer`

---

## 1. 触发条件

- 请求包含：接入 AI 模型、LLM、大模型、OpenAI、Anthropic、AI API 等关键词
- 新增 AI 服务提供方或切换模型

## 2. 准备工作

| 资源                                     | 用途                           |
| ---------------------------------------- | ------------------------------ |
| `rules/project-architecture.md`          | 了解项目结构和现有 AI 相关代码 |
| `skill/supabase`                         | 如有需要部署 Edge Function     |
| supabase MCP                             | 查询 Supabase 项目状态         |
| 环境变量配置文件 `.env` / `.env.example` | 确认密钥管理方式               |

## 3. 执行步骤

### Step 1：确认集成需求

- 确定选型：OpenAI / Anthropic / 其它服务商
- 明确用途：对话、嵌入、函数调用等
- 确定调用位置：后端 Service 直接调用 / Supabase Edge Function 代理

### Step 2：API 密钥管理

- 在 `apps/backend/.env`（或根目录 `.env`）中定义环境变量，如 `AI_API_KEY`、`AI_MODEL`
- 在对应的 `.env.example` 中添加占位说明，**不硬编码密钥到源码**
- 在 Supabase Dashboard 的 Edge Function secrets 中添加对应密钥（如使用 Edge Function）
- 确保 `.env` 已加入 `.gitignore`

### Step 3：实现 AI Service 封装

在后端创建统一的 AI Service 模块：

```
apps/backend/src/
└── modules/ai/
    ├── ai.module.ts          — 模块定义
    ├── ai.service.ts         — 核心服务：请求/响应封装
    ├── ai.service.spec.ts    — 单元测试
    └── interfaces/
        ├── ai-request.interface.ts   — 请求接口定义
        └── ai-response.interface.ts  — 响应接口定义
```

- 封装请求/响应接口，统一错误处理
- 实现指数退避重试逻辑（建议最多 3 次）
- 支持流式响应（流式场景需返回 Observable 或 AsyncIterator）

### Step 4：对接 Supabase Edge Function（可选）

如果选择通过 Edge Function 代理 AI 调用：

- 在 `supabase/functions/` 下创建函数
- 使用 supabase MCP 的 `deploy_edge_function` 部署
- 后端通过 Supabase 客户端调用该 Edge Function

### Step 5：验证

- 运行单元测试：`pnpm --filter backend exec vitest run modules/ai`
- 使用 curl/Postman 测试 API 调用，确认响应格式正确
- 检查密钥是否泄漏：确认日志和环境变量均不打印密钥原文
- 确认错误重试机制在超时/限流时正常工作

## 4. 完成检查

- [ ] API 调用正常，返回预期格式
- [ ] 密钥仅通过环境变量注入，无硬编码
- [ ] 错误重试逻辑覆盖超时、限流、服务不可用场景
- [ ] 流式/非流式两种模式按需支持

## 5. 输出

- `ai.module.ts` + `ai.service.ts` — AI Service 模块
- `ai-request.interface.ts` + `ai-response.interface.ts` — 类型定义
- 环境变量更新到 `.env` / `.env.example` / Supabase secrets
