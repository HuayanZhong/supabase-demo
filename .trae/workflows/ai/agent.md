# 工作流：AI Agent 编排开发

对应 agent：`ai-integration-engineer`

---

## 1. 触发条件

- 请求包含：Agent、Tool calling、函数调用、智能体编排、自动化任务等关键词
- 需要构建能自主调用工具的 AI Agent

## 2. 准备工作

| 资源                            | 用途                                       |
| ------------------------------- | ------------------------------------------ |
| `rules/project-architecture.md` | 了解项目结构                               |
| `workflows/ai/integrate.md`     | 确认 AI Service 已就绪（依赖前置）         |
| `workflows/ai/chat.md`          | 确认对话功能已就绪（Agent 对话基础）       |
| `workflows/ai/rag.md`           | 确认向量检索可用（Agent 可使用的工具之一） |
| supabase MCP                    | 如 Agent 需要操作数据库                    |

## 3. 执行步骤

### Step 1：定义 Agent 能力边界

- 确定 Agent 的目标场景：客服问答、数据分析、任务编排等
- 确定可用的工具集：
  - 内部工具：数据库查询、RAG 检索、发送通知等
  - 外部工具：天气查询、计算器等（根据业务需求）
- 定义每个 Tool 的 schema（名称、描述、参数列表），确保描述足够精确以引导模型正确调用

创建工具定义文件：

```
apps/backend/src/
└── modules/agent/
    ├── agent.module.ts                — 模块定义
    ├── agent.service.ts               — Agent 编排核心
    ├── agent.service.spec.ts          — 单元测试
    ├── tools/
    │   ├── tool.interface.ts          — Tool 基础接口
    │   ├── database.tool.ts           — 数据库查询工具
    │   ├── rag-search.tool.ts         — RAG 检索工具
    │   └── ...                        — 更多工具
    └── interfaces/
        ├── agent-config.interface.ts  — Agent 配置接口
        └── agent-session.interface.ts — 会话管理接口
```

### Step 2：实现 Agent 核心

- 构建 ReAct（Reasoning + Acting）循环：
  1. 接收用户输入
  2. 将输入 + 可用工具定义 + 历史上下文发送给 LLM
  3. LLM 返回推理过程和工具调用请求
  4. 执行工具调用，获取结果
  5. 将工具结果送回 LLM 生成最终回复
  6. 返回回复给用户
- 实现工具调用的安全校验：参数校验、权限控制、超时处理
- 会话管理：支持多轮对话中的 Agent 状态保持
- 最大迭代限制（防止 Agent 无限循环，建议上限 10 次）

### Step 3：测试 Agent 行为

- 编写单元测试覆盖每个 Tool 的边界情况
- 编写集成测试覆盖完整的 Agent 编排流程：
  - 单工具调用场景
  - 多工具串联场景
  - 工具调用失败后 Agent 能自主纠错
  - 超过最大迭代次数时的降级处理
- 测试 Agent 在边界输入下的行为：空输入、过长输入、非法参数

### Step 4：前端集成（可选）

- 在对话界面添加 Agent 状态展示：思考中、调用工具、执行完成
- 工具调用过程可视化：展示调用了哪些工具、传入参数、返回结果
- 前端用户可查看 Agent 的推理过程（可选）

### Step 5：验证

- 运行测试：`pnpm --filter backend exec vitest run modules/agent`
- 端到端验证核心用例覆盖：
  - 正确的单步工具调用
  - 多步推理 + 工具调用链条
  - 工具调用失败后 Agent 自主恢复
  - 达到最大迭代次数后降级
- 确认 Agent 不会执行未定义的操作（安全边界）

## 4. 完成检查

- [ ] Agent 核心 ReAct 循环正常工作
- [ ] 每个 Tool 定义完整（名称、描述、参数、实现）
- [ ] 工具调用安全校验（参数校验、超时、权限）
- [ ] 最大迭代限制有效，超限后有降级行为
- [ ] 单元测试 + 集成测试覆盖核心场景
- [ ] 前端 Agent 状态展示（如需要）

## 5. 输出

- `agent.module.ts` + `agent.service.ts` — Agent 编排模块
- `tool.interface.ts` — 工具接口定义
- `*.tool.ts` — 各工具实现
- `agent-config.interface.ts` + `agent-session.interface.ts` — 类型定义
- 前端 Agent 状态展示组件（如需要）
