# Agents — 子智能体（Subagent）

## 职责

`agents/` 存放通过 Markdown 文件定义的子智能体（Subagent）。内置 Agent 会在识别到合适任务时自动调用对应的 Subagent，每个 Subagent 拥有独立的上下文窗口，中间推理不污染主对话历史。

```
用户消息
  │
  ▼
Agent 判断意图 ──匹配 description──▶ Subagent（独立上下文执行）
  │                                    │
  └── 不匹配 → Agent 自行处理          │
                                       ▼
                               结果返回 Agent 汇总
```

## 文件结构

```
.trae/agents/
├── README.md                  # 本文档
├── logs/                      # Subagent 调用日志
│   └── agent-invoke.log       # 格式：[时间戳] agent-name | 用户请求：描述
│
├── test-completer.md          # P0 - 测试补全
├── i18n-validator.md          # P1 - 翻译完整性
├── migration-reviewer.md      # P1 - 迁移审查
├── api-tester.md              # P2 - API 调试
├── security-auditor.md        # P2 - 安全审计
└── architecture-doctor.md     # P3 - 架构审查
```

## Subagent 清单

### 优先级 P0（核心）

| Subagent           | description 触发关键词                             | 工具绑定                                                                        | 模式        |
| ------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------- | ----------- |
| **test-completer** | write tests、add test、testing、写测试、提高覆盖率 | Read, Glob, Grep, Write, WebSearch, WebFetch, RunCommand, GetDiagnostics, Skill | 读写 + 验证 |

### 优先级 P1（高频）

| Subagent               | description 触发关键词                  | 工具绑定                                            | 模式 |
| ---------------------- | --------------------------------------- | --------------------------------------------------- | ---- |
| **i18n-validator**     | translation、i18n、locale、国际化、翻译 | Read, Glob, Grep, RunCommand, Skill                 | 只读 |
| **migration-reviewer** | migration、migrate、迁移、改表、Entity  | Read, Glob, Grep, GetDiagnostics, RunCommand, Skill | 只读 |

### 优先级 P2（中频）

| Subagent             | description 触发关键词                      | 工具绑定                                                 | 模式               |
| -------------------- | ------------------------------------------- | -------------------------------------------------------- | ------------------ |
| **api-tester**       | debug API、test endpoint、swagger、接口调试 | Read, Glob, Grep, RunCommand, WebSearch, WebFetch, Skill | 读写（调本地 API） |
| **security-auditor** | security review、audit、安全检查、漏洞      | Read, Glob, Grep, RunCommand, Skill                      | 只读               |

### 优先级 P3（低频）

| Subagent                | description 触发关键词                | 工具绑定                            | 模式                 |
| ----------------------- | ------------------------------------- | ----------------------------------- | -------------------- |
| **architecture-doctor** | architecture review、架构检查、一致性 | Read, Glob, Grep, RunCommand, Skill | 只读                 |
| **review-verifier**     | review、审查、验证、审核、verifier    | Read, Glob, Grep, Skill, MCP只读    | 只读（只审查不修改） |

## 与 routing.md Agent 选型表的关系

本目录的自定义 Subagent 是 `routing.md` Agent 选型表的**补充实现**，并非替代。选型表中的内置 Agent（如 `backend-architect`、`frontend-architect`、`api-test-pro`、`performance-expert`、`compliance-checker`、`general_purpose_task`）由 IDE 运行时内置，无需在 `.trae/agents/` 中定义。

| 内置 Agent 类型                                                                                                                              | 来源                | 使用时机                                                        |
| -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | --------------------------------------------------------------- |
| `backend-architect`, `frontend-architect`, `ui-designer`, `performance-expert`, `api-test-pro`, `compliance-checker`, `general_purpose_task` | IDE 内置            | 按 routing.md 选型表通过 `Task(subagent_type=...)` 调用         |
| 本目录的 6 个自定义 Subagent                                                                                                                 | `.trae/agents/*.md` | 同样通过 `Task(subagent_type=...)` 调用，按场景匹配 description |

> 路由规则见 `.trae/rules/agent/routing.md` 的 `Agent 选型` 和 `Skill 触发规则` 章节。

## 命名规范

- 文件名：kebab-case（`test-completer.md`）
- `name` 字段：字母开头，只含字母/数字/连字符，以字母或数字结尾，≤50 字符
- `description` 字段：包含触发关键词，越具体调度越准

## 调用机制

Agent 当前版本自动路由存在已知限制，遵循 `routing.md` 的手动路由策略：

1. 用户发送消息
2. Agent 执行 routing.md 的 **执行前自检**（门禁 A/B/C/D）
3. 门禁 B 命中 Agent 选型表 → 通过 `Task(subagent_type=...)` 委派
4. 匹配失败 → Agent 自行处理

## 日志

每次调用记录在 `logs/agent-invoke.log`，格式：

```
[yyyy-MM-dd HH:mm:ss] agent-name | 用户请求：关键词描述
```

## 行为约束

- 只读 Subagent（i18n-validator / migration-reviewer / security-auditor / architecture-doctor）不修改任何源码
- 所有 Subagent 执行前先读项目实际源码，不凭记忆盲写
- 所有 Subagent 执行前先读对应 Skill + 官方文档确认当前版本 API
- 新增 Subagent 需按此模板补充 README 清单
