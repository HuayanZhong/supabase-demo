# Trae IDE Hooks — Rules + Hooks 生命周期联动

## 设计理念

**Hooks 只做两件事：**

1. **安全拦截** — 需要逻辑判断的阻断操作（保护 mcp.json、拦截破坏性 SQL）
2. **指向规则** — 在正确的生命周期节点告诉 AI "去读 xx.md"

**规则只维护在 `.trae/rules/` 的 `.md` 文件中**，hooks 不做文件读取和内容注入。
AI 收到指针后自己会去读规则文件，确保规则始终是单源 truth。

## 文件结构

```
.trae/hooks.json              # Hook 配置文件（IDE 读取入口）
.trae/hooks/
├── README.md                  # 本文档
├── session-start.ps1          # SessionStart — 指向 language.md + monorepo.md + agent-catalog.md
├── classify-intent.ps1        # UserPromptSubmit — 指向 agent-routing.md
├── enforce-code-standards.ps1 # PreToolUse(Write) — 指向 naming.md + comments.md + frontend/comments.md + frontend/i18n.md + agent-catalog.md
├── protect-mcp-json.ps1       # PreToolUse(Write) — 拦截 .trae/mcp.json 写入
├── protect-sql.ps1            # PreToolUse(execute_sql) — 拦截破坏性 SQL
├── inject-credentials.ps1     # PreToolUse(chrome-devtools) — 注入本地凭证到 AI 上下文
├── remind-logging.ps1         # PostToolUse — 提示 Stop 阶段记日志
├── validate-output.ps1        # Stop — 检查任务日志，缺失则阻断+指向 task-logging.md + agent-catalog.md
└── quality-reminder.ps1       # Notification(idle_prompt) — 质量提醒

.trae/rules/                   # 规则文件（hooks 只做指针，不读取内容）
├── README.md                  # 规则体系总览
├── agent-routing.md           # 命中规则：路由决策 + 冲突解决
├── agent-catalog.md           # Agent 操作目录（按章节分阶段注入）
├── language.md
├── naming.md
├── comments.md
├── task-logging.md
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
SessionStart ──────────→ session-start.ps1
  │                       指向: language.md + monorepo.md + agent-catalog.md（角色与资源）
  ▼
UserPromptSubmit ──────→ classify-intent.ps1
  │                       指向: agent-routing.md（路由决策）
  ▼
PreToolUse(Write) ─────→ protect-mcp-json.ps1（安全拦截）
  │                   └─ enforce-code-standards.ps1
  │                        指向: naming.md + comments.md + （backend/comments.md 或 frontend/comments.md，按文件路径智能选择）+ frontend/i18n.md + agent-catalog.md（安全约束）
  │
PreToolUse(execute_sql) → protect-sql.ps1（安全拦截）
  │
PreToolUse(chrome-devtools) → inject-credentials.ps1（注入本地凭证）
  │
  ▼
[工具执行]
  │
  ▼
PostToolUse ───────────→ remind-logging.ps1
  │                       提示: "Stop 阶段按 task-logging.md 输出日志"
  │
  (循环回 PreToolUse)
  │
  ▼
Stop ──────────────────→ validate-output.ps1
  │                       检查输出中是否已有"任务日志"
  │                       → 有: 允许停止
  │                       → 无: 阻断 + 指向 task-logging.md + agent-catalog.md（质量验证）
  ▼
Notification(idle_prompt) → quality-reminder.ps1
                          异步提醒: check-types / lint / format:fix / audit
```

## 事件明细

| 事件                        | Hook 脚本                  | 类型     | 作用                                                                                                                                    | 说明           |
| --------------------------- | -------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| SessionStart                | session-start.ps1          | 指向规则 | 注入项目上下文 + 指向 language.md、monorepo.md、agent-catalog.md                                                                        | 会话初始化     |
| UserPromptSubmit            | classify-intent.ps1        | 指向规则 | 指向 agent-routing.md，要求意图分类+Agent选型                                                                                           | 每次用户发消息 |
| PreToolUse(Write)           | protect-mcp-json.ps1       | 安全拦截 | 拦截 `.trae/mcp.json` 写入，含明文 Token                                                                                                | 写文件前       |
| PreToolUse(Write)           | enforce-code-standards.ps1 | 指向规则 | 指向 naming.md + comments.md + （backend/comments.md 或 frontend/comments.md，按文件路径智能选择）+ frontend/i18n.md + agent-catalog.md | 写代码前       |
| PreToolUse(execute_sql)     | protect-sql.ps1            | 安全拦截 | 拦截 DROP/TRUNCATE/DELETE 等破坏性 SQL                                                                                                  | 执行 SQL 前    |
| PreToolUse(chrome-devtools) | inject-credentials.ps1     | 注入凭证 | 读取本地凭证文件注入到 AI 上下文                                                                                                        | 浏览器操作前   |
| PostToolUse                 | remind-logging.ps1         | 指向规则 | 轻量提醒 Stop 阶段输出任务日志                                                                                                          | 每次工具执行后 |
| Stop                        | validate-output.ps1        | 指向规则 | 检查任务日志，缺失则阻断+指向 task-logging.md + agent-catalog.md                                                                        | 输出结束前     |
| Notification(idle_prompt)   | quality-reminder.ps1       | 通知     | 提醒运行质量检查和审计                                                                                                                  | 任务完成       |

## 规则 ↔ Hook 映射

| 规则文件                                    | 生命周期事件                          | 注入方式 |
| ------------------------------------------- | ------------------------------------- | -------- |
| language.md                                 | SessionStart                          | 指针     |
| monorepo.md                                 | SessionStart                          | 指针     |
| agent-catalog.md （角色与资源）             | SessionStart                          | 指针     |
| agent-routing.md                            | UserPromptSubmit                      | 指针     |
| naming.md                                   | PreToolUse(Write)                     | 指针     |
| comments.md                                 | PreToolUse(Write)                     | 指针     |
| backend/comments.md 或 frontend/comments.md | PreToolUse(Write)，按文件路径智能选择 | 指针     |
| frontend/i18n.md                            | PreToolUse(Write)                     | 指针     |
| agent-catalog.md （安全约束）               | PreToolUse(Write)                     | 指针     |
| task-logging.md                             | Stop（+ PostToolUse 提醒）            | 指针     |
| agent-catalog.md （质量验证）               | Stop                                  | 指针     |
| 本地凭证                                    | PreToolUse(chrome-devtools)           | 读取     |

**不通过 hooks 的规则**（自然激活，遗忘风险低）：
nestjs.md、error-handling.md、backend/logging.md、database.md（非安全部分）、
nuxt.md、styles.md、frontend/quality.md、frontend/components.md、
frontend/dashboard-layout.md、frontend/delivery-checklist.md、frontend/echarts.md、
frontend/layout-bfc.md、frontend/no-decoration.md、frontend/task-stability.md、
security.md、testing.md、dependencies.md、env-vars.md、frontend-types.md、git-commit-message.md

## Logger 抑制机制

指令流程（如 `/audit`）自带 logger/报告输出，无需 PostToolUse 重复提醒。
手动压缩上下文时同样不需要。

**机制**：在执行前创建 `.trae/.hooks-mute` 标记文件，`remind-logging.ps1` 检测到后静默退出。
执行结束后（如审计报告输出后）删除该文件，恢复提醒。

```powershell
# 抑制 logger 提醒
New-Item -ItemType File -Path ".trae/.hooks-mute" -Force

# ... 执行指令流程 ...

# 恢复 logger 提醒
Remove-Item ".trae/.hooks-mute" -Force
```

> 标记文件被 `.gitignore` 忽略，不会进入版本控制。
> 异常退出导致标记残留时，下一次指令执行前会被 `-Force` 覆盖或手动删除即可。

## 使用前提

1. 在 IDE 中启用项目 Hook：**设置 → Hooks → 配置 → 项目 Hook → 创建**
2. Hook 运行方式建议：**沙箱运行**
3. 查看运行日志：**设置 → Hooks → 运行方式 → 查看日志**
