# Trae IDE Hooks — 安全拦截 + 规则注入

## 设计理念

**Hooks 做两件事**：

1. **安全拦截**：需要逻辑判断的阻断操作（保护 mcp.json、拦截破坏性 SQL）
2. **规则注入**：按生命周期注入 agent 规则和 tool 规则指针

**规则文件由 AI 自行读取**：Hooks 只输出"请阅读 xx.md"，不读取规则文件内容。

## 文件结构

```
.trae/hooks.json              # Hook 配置文件（IDE 读取入口）
.trae/hooks/
├── README.md                  # 本文档
├── inject-agent-roles.ps1     # SessionStart — 注入角色定义
├── inject-agent-routing.ps1   # UserPromptSubmit — 注入路由决策 + 执行规范
├── inject-tool-rules.ps1      # PreToolUse — 按工具名注入工具规则
├── inject-quality-rules.ps1   # Stop — 注入质量验证规范
├── enforce-code-standards.ps1 # PreToolUse(Write) — 安全拦截（允许写入）+ 注释规范
├── protect-mcp-json.ps1       # PreToolUse(Write) — 拦截 .trae/mcp.json 写入
├── protect-sql.ps1            # PreToolUse(execute_sql) — 拦截破坏性 SQL
└── inject-credentials.ps1     # PreToolUse(chrome-devtools) — 注入本地凭证到 AI 上下文

.trae/rules/                   # 规则文件（由 Hooks 注入指针，AI 自行读取）
├── README.md                  # 规则体系总览
├── language.md                # 语言约束
├── naming.md                  # 命名规范
├── comments.md                # 注释风格
├── git-commit-message.md      # Commit 格式
├── agent/                     # Agent 治理
│   ├── routing.md             # 任务路由决策
│   ├── roles.md               # 角色与资源
│   ├── execution.md           # 执行规范
│   ├── search.md              # 文档检索
│   ├── safety.md              # 安全约束
│   └── quality.md             # 质量验证
├── tool/                      # MCP 工具规则（10 个文件）
├── backend/                   # 后端领域规则
├── frontend/                  # 前端领域规则
├── shared/                    # 跨包共享规则
└── quality/                   # 质量保证规则
```

## 生命周期联动图

```
Session 创建
  │
  ▼
SessionStart → inject-agent-roles.ps1（注入角色定义）
  │
  ▼
UserPromptSubmit → inject-agent-routing.ps1（注入路由决策 + 执行规范）
  │
  ▼
PreToolUse(DeleteFile|Edit|Write) ─────→ protect-mcp-json.ps1（安全拦截）
  │                                   └─ enforce-code-standards.ps1（安全拦截 + 注释规范）
  │
PreToolUse(execute_sql) → protect-sql.ps1（安全拦截）
  │
PreToolUse(chrome-devtools) → inject-credentials.ps1（注入本地凭证）
  │
PreToolUse(MCP 工具) → inject-tool-rules.ps1（按工具名注入工具规则）
  │
  ▼
[工具执行]
  │
  ▼
Stop → inject-quality-rules.ps1（注入质量验证规范）
```

## 事件明细

| 事件                                | Hook 脚本                  | 类型     | 作用                                     | 说明         |
| ----------------------------------- | -------------------------- | -------- | ---------------------------------------- | ------------ |
| SessionStart                        | inject-agent-roles.ps1     | 规则注入 | 注入角色定义指针                         | 会话开始时   |
| UserPromptSubmit                    | inject-agent-routing.ps1   | 规则注入 | 注入路由决策 + 执行规范指针              | 用户提交时   |
| PreToolUse(DeleteFile\|Edit\|Write) | protect-mcp-json.ps1       | 安全拦截 | 拦截 `.trae/mcp.json` 写入，含明文 Token | 写文件前     |
| PreToolUse(DeleteFile\|Edit\|Write) | enforce-code-standards.ps1 | 安全拦截 | 允许写入 + 注入注释规范指针              | 写代码前     |
| PreToolUse(execute_sql)             | protect-sql.ps1            | 安全拦截 | 拦截 DROP/TRUNCATE/DELETE 等破坏性 SQL   | 执行 SQL 前  |
| PreToolUse(chrome-devtools)         | inject-credentials.ps1     | 注入凭证 | 读取本地凭证文件注入到 AI 上下文         | 浏览器操作前 |
| PreToolUse(MCP 工具)                | inject-tool-rules.ps1      | 规则注入 | 按工具名匹配注入 tool/\*.md 规则指针     | 工具调用前   |
| Stop                                | inject-quality-rules.ps1   | 规则注入 | 注入质量验证规范指针                     | 会话结束时   |

## 规则注入机制

### 生命周期注入

| 事件             | 注入规则                            | 说明                         |
| ---------------- | ----------------------------------- | ---------------------------- |
| SessionStart     | `agent/roles.md`                    | 会话开始时注入角色定义       |
| UserPromptSubmit | `agent/routing.md` + `execution.md` | 用户提交时注入路由和执行规范 |
| PreToolUse       | `tool/*.md`（按工具名匹配）         | 工具调用前注入工具规则       |
| Stop             | `agent/quality.md`                  | 会话结束时注入质量验证规范   |

### 始终生效规则

以下规则通过 `alwaysApply: true` 始终生效，无需 Hook 注入：

| 生效方式     | 说明                 | 文件                                      |
| ------------ | -------------------- | ----------------------------------------- |
| **始终生效** | Session 期间始终存在 | `language.md`、`naming.md`、`comments.md` |

## 使用前提

1. 在 IDE 中启用项目 Hook：**设置 → Hooks → 配置 → 项目 Hook → 创建**
2. Hook 运行方式建议：**沙箱运行**
3. 查看运行日志：**设置 → Hooks → 运行方式 → 查看日志**
