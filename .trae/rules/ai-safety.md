---
alwaysApply: true
---

# AI 行为安全约束

- 禁止删除未读取过的文件
- 禁止修改超出任务描述范围的文件
- 禁止运行未确认的破坏性命令（`rm -rf`、`drop table`、`reset --hard`）
- 修改代码前必须先读取目标文件，禁止凭空覆盖
- 涉及破坏性操作时，必须先输出操作计划，等待确认

## 规则文件修改白名单（BUG-022 修复）

AI 在治理任务（evolution 自迭代、bug 修复、文档增强）中需要修改 `.trae/` 文件。为区分"合法治理修改"vs"越界修改"，按以下规则：

### 允许修改的场景

| 场景                 | 允许修改范围                    | 必须的日志         |
| -------------------- | ------------------------------- | ------------------ | --------------------- |
| evolution 自迭代     | `.trae/` 下所有文件             | `[EVOLVE:apply] OK | target=xxx`           |
| bug 修复（已确认）   | bug 报告中列出的 affected_files | `[GUARD:scope] OK  | scope=affected_files` |
| 文档增强（用户要求） | 用户明确指定的文件              | `[ROUTE:match] OK  | domain=meta`          |
| 测试用例执行         | `.trae/memory/sessions/tests/`  | `[EVAL:step] OK    | scope=tests/`         |

### 禁止修改的场景

- 任务描述不涉及 `.trae/` 但 AI 试图修改 → 越界，BLOCKED
- 修改 `.trae/rules/ai-safety.md`（本文件）→ 必须人工确认，不得 AI 自主修改
- 修改 `.trae/rules/` 下其他规则文件 → 必须有 evolution 上下文 + `[EVOLVE:apply]` 日志

### 白名单校验机制

scope 守卫对 `.trae/` 路径特殊处理：

1. 检查任务是否为治理任务（domain=meta 或 route=fast-path FALLBACK reason=governance）
2. 检查是否有 `[EVOLVE:apply]` 或 `[ROUTE:match] domain=meta` 日志
3. 都没有 → 视为越界修改，输出 `[GUARD:scope] BLOCKED | file=.trae/xxx;reason=非治理任务`

### 自指保护

本文件（ai-safety.md）是治理框架的安全基石，修改时必须：

- 输出操作计划
- 等待人工确认
- 不得通过 AI 自主迭代修改（即使 evolution 也不行）
