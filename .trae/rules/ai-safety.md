---
alwaysApply: true
---

# ⚠️ 编码任务前必须执行（3 步，不可跳过）

**任何涉及创建/修改代码文件的任务开始前：**

```
Step 1: 读取 .trae/runtime/router.md → 输出 [ROUTE:check] 日志
Step 2: 读取 .trae/rules/README.md → 确认需加载的规则
Step 3: 分阶段执行，每阶段后做 lint/format/check-types
```

> 这三个步骤不是建议，是强制要求。没走就开写 = 违规。
> 纯对话可不走。单文件编辑可只走 Step 3。

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

## 强制执行检查点（GOV-002 修复）

每次开始实质性编码任务前（排除纯对话/问答），**必须先执行**：

1. 读取 `.trae/runtime/checkpoint.md`
2. 将其模板复制并填写到 `.trae/memory/runtime/{ISO时间戳}.checkpoint.md`
3. 填写前必须逐一读取对应规则文件
4. 有检查点文件 → 合法执行。无检查点文件 → 治理流程未走，视为违规
5. 每阶段完成后，修改 checkpoint 中对应阶段状态为 ✅ 再进入下一阶段
6. 全部完成并通过最终校验后，修改 checkpoint 状态为 ✅ 完成

### 例外

- 纯对话/问答（无任何文件创建修改）→ 跳过
- 快路径单文件编辑 → 跳过 checkpoint 但仍需跑 Step 3 检查

## 自指保护

本文件是治理框架的安全基石，修改时必须：

- 输出操作计划
- 等待人工确认
- 不得通过 AI 自主迭代修改（即使 evolution 也不行）
