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
├── agent-routing.md           # 命中规则：路由决策 + 冲突解决
├── agent-catalog.md           # Agent 操作目录（按章节分阶段注入）
├── language.md
├── naming.md
├── comments.md
├── git-commit-message.md
├── shared/monorepo.md
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
PreToolUse(Write) ─────→ protect-mcp-json.ps1（安全拦截）
  │                   └─ enforce-code-standards.ps1（安全拦截）
  │
PreToolUse(execute_sql) → protect-sql.ps1（安全拦截）
  │
PreToolUse(chrome-devtools) → inject-credentials.ps1（注入本地凭证）
  │
  ▼
[工具执行]
```

## 事件明细

| 事件                        | Hook 脚本                  | 类型     | 作用                                         | 说明         |
| --------------------------- | -------------------------- | -------- | -------------------------------------------- | ------------ |
| PreToolUse(Write)           | protect-mcp-json.ps1       | 安全拦截 | 拦截 `.trae/mcp.json` 写入，含明文 Token     | 写文件前     |
| PreToolUse(Write)           | enforce-code-standards.ps1 | 安全拦截 | 允许写入（规则注入由 Trae IDE 内置机制处理） | 写代码前     |
| PreToolUse(execute_sql)     | protect-sql.ps1            | 安全拦截 | 拦截 DROP/TRUNCATE/DELETE 等破坏性 SQL       | 执行 SQL 前  |
| PreToolUse(chrome-devtools) | inject-credentials.ps1     | 注入凭证 | 读取本地凭证文件注入到 AI 上下文             | 浏览器操作前 |

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
