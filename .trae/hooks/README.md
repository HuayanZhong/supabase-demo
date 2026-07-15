# Trae IDE Hooks — 安全拦截

## 设计理念

**Hooks 只做安全拦截**：需要逻辑判断的阻断操作（保护 mcp.json、拦截破坏性 SQL）。

**规则注入由 Trae IDE 内置机制处理**：通过 `alwaysApply` 字段控制始终生效或按意图匹配。

## 文件结构

```
.trae/hooks.json              # Hook 配置文件（IDE 读取入口）
.trae/hooks/
├── README.md                  # 本文档
├── enforce-code-standards.ps1 # PreToolUse(Write) — 安全拦截（允许写入）
├── protect-mcp-json.ps1       # PreToolUse(Write) — 拦截 .trae/mcp.json 写入
├── protect-sql.ps1            # PreToolUse(execute_sql) — 拦截破坏性 SQL
└── inject-credentials.ps1     # PreToolUse(chrome-devtools) — 注入本地凭证到 AI 上下文

.trae/rules/                   # 规则文件（由 Trae IDE 内置机制注入）
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
PreToolUse(DeleteFile|Edit|Write) ─────→ protect-mcp-json.ps1（安全拦截）
  │                                   └─ enforce-code-standards.ps1（安全拦截）
  │
PreToolUse(execute_sql) → protect-sql.ps1（安全拦截）
  │
PreToolUse(chrome-devtools) → inject-credentials.ps1（注入本地凭证）
  │
  ▼
[工具执行]
```

## 事件明细

| 事件                                | Hook 脚本                  | 类型     | 作用                                         | 说明         |
| ----------------------------------- | -------------------------- | -------- | -------------------------------------------- | ------------ |
| PreToolUse(DeleteFile\|Edit\|Write) | protect-mcp-json.ps1       | 安全拦截 | 拦截 `.trae/mcp.json` 写入，含明文 Token     | 写文件前     |
| PreToolUse(DeleteFile\|Edit\|Write) | enforce-code-standards.ps1 | 安全拦截 | 允许写入（规则注入由 Trae IDE 内置机制处理） | 写代码前     |
| PreToolUse(execute_sql)             | protect-sql.ps1            | 安全拦截 | 拦截 DROP/TRUNCATE/DELETE 等破坏性 SQL       | 执行 SQL 前  |
| PreToolUse(chrome-devtools)         | inject-credentials.ps1     | 注入凭证 | 读取本地凭证文件注入到 AI 上下文             | 浏览器操作前 |

## 规则注入机制

规则注入由 Trae IDE 内置机制处理，分为两类：

| 生效方式     | 说明                       | 文件                                                                        |
| ------------ | -------------------------- | --------------------------------------------------------------------------- |
| **始终生效** | Session 期间始终存在       | `language.md`、`naming.md`、`comments.md`                                   |
| **智能生效** | 任务涉及对应领域时自动触发 | `backend/*`、`frontend/*`、`shared/*`、`quality/*`、`git-commit-message.md` |

## 使用前提

1. 在 IDE 中启用项目 Hook：**设置 → Hooks → 配置 → 项目 Hook → 创建**
2. Hook 运行方式建议：**沙箱运行**
3. 查看运行日志：**设置 → Hooks → 运行方式 → 查看日志**
