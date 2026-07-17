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

| Subagent           | description 触发关键词                             | 工具绑定                                                       | 模式        |
| ------------------ | -------------------------------------------------- | -------------------------------------------------------------- | ----------- |
| **test-completer** | write tests、add test、testing、写测试、提高覆盖率 | Read, Glob, Grep, Write, WebSearch, WebFetch, Bash, LSP, Skill | 读写 + 验证 |

### 优先级 P1（高频）

| Subagent               | description 触发关键词                  | 工具绑定                           | 模式 |
| ---------------------- | --------------------------------------- | ---------------------------------- | ---- |
| **i18n-validator**     | translation、i18n、locale、国际化、翻译 | Read, Glob, Grep, Bash, Skill      | 只读 |
| **migration-reviewer** | migration、migrate、迁移、改表、Entity  | Read, Glob, Grep, LSP, Bash, Skill | 只读 |

### 优先级 P2（中频）

| Subagent             | description 触发关键词                      | 工具绑定                                           | 模式               |
| -------------------- | ------------------------------------------- | -------------------------------------------------- | ------------------ |
| **api-tester**       | debug API、test endpoint、swagger、接口调试 | Read, Glob, Grep, Bash, WebSearch, WebFetch, Skill | 读写（调本地 API） |
| **security-auditor** | security review、audit、安全检查、漏洞      | Read, Glob, Grep, Bash, Skill                      | 只读               |

### 优先级 P3（低频）

| Subagent                | description 触发关键词                | 工具绑定                      | 模式 |
| ----------------------- | ------------------------------------- | ----------------------------- | ---- |
| **architecture-doctor** | architecture review、架构检查、一致性 | Read, Glob, Grep, Bash, Skill | 只读 |

## 命名规范

- 文件名：kebab-case（`test-completer.md`）
- `name` 字段：字母开头，只含字母/数字/连字符，以字母或数字结尾，≤50 字符
- `description` 字段：包含触发关键词，越具体调度越准

## 调用机制

Agent 当前版本自动路由存在已知限制，采用手动路由策略：

1. 用户发送消息
2. Agent 识别意图，匹配 Subagent 的 `description`
3. 匹配成功 → Agent 通过 Task 工具委派给对应 Subagent
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
