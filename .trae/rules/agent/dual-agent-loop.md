---
alwaysApply: false
description: 双Agent协作循环规则，定义主Agent与审查Agent(review-verifier)的协作生命周期、循环控制与收敛机制，由 UserPromptSubmit hook 注入
---

# 双Agent协作循环（Dual-Agent Loop）

## 概述

将主Agent与审查Agent分离，通过独立上下文的审查环节提升代码质量和安全性。审查Agent拥有**独立的上下文窗口**，不共享主Agent的推理过程。

### 循环模型（参考 Claude Code Agent Loop）

```
标准 Agent Loop:      上下⽂收集 → 执⾏ → 验证 → 重复
                            │        │      │
Dual-Agent Loop:            │        │      │
  Phase 1 (主Agent): 计划生成 ────────┘      │
  Phase 2 (审查Agent): 计划审查 ──────────────┘
  Phase 3 (主Agent): 任务执⾏ ────────────────┘
  Phase 4 (审查Agent): 结果审查 ──────────────┐
  Phase 5 (主Agent): 收敛检测 ←───────────────┘
```

## Phase 定义

### Phase 1: 计划生成（主Agent）

主Agent在**开始任何代码改动前**，必须先输出一个 SVO（Subject-Verb-Object）结构计划：

```
## Plan Manifest
- taskSummary: 一句话任务描述

| ID | Subject | Verb | Object | 验证⽅式 |
|----|---------|------|--------|----------|
| P1 | {文件名/模块} | create/update/delete/refactor | {预期产出} | {验证命令} |
```

每个计划项必须附带**验证方式**，作为 Phase 4 的评判依据。

### Phase 2: 计划审查（审查Agent）

通过 `Task(subagent_type=general_purpose_task)` 调用 `review-verifier`，在**独立上下文窗口**中执行。

审查Agent仅接收 Plan Manifest，不接触主Agent的推理过程。

**审查维度：**

| 维度     | 检查项                     |
| -------- | -------------------------- |
| 完整性   | 所有必要文件/模块是否覆盖  |
| 结构合规 | SVO 格式是否正确           |
| 验证方式 | 每项都附带可执行的验证命令 |
| 安全影响 | 是否涉及敏感数据/权限变更  |
| 依赖顺序 | 计划项拓扑序是否正确       |

**审查结果：**

- PASS → 进入 Phase 3
- FAIL → 退回 Phase 1 修改，附带原因

### Phase 3: 任务执行（主Agent）

按审查通过的 Plan Manifest 逐项实施。

- 每完成一项勾选 `[done]`
- 文件修改前保留快照（依 `agent/safety.md`）
- 所有改动结果在 Phase 4 汇总提交给审查Agent

### Phase 4: 结果审查（审查Agent）

通过 `Task(subagent_type=general_purpose_task)` 调用 `review-verifier`，在**独立上下文窗口**中执行。

审查Agent仅接收：原始 Plan Manifest + 改动文件清单。

**审查维度：**

| 维度     | 检查项                         |
| -------- | ------------------------------ |
| 功能正确 | 验证方式是否可执行且通过       |
| 格式规范 | 符合 naming.md / comments.md   |
| 安全合规 | 无新增安全风险                 |
| 覆盖完整 | Plan Manifest 所有项 100% 覆盖 |
| 无副作用 | 未擅自修改计划外文件           |

**审查结果：**

- PASS → 进入 Phase 5，标记完成
- PASS_WITH_WARNINGS → 标注警告，仍可完成
- FAIL → 退回 Phase 3 修复，附带原因

### Phase 5: 收敛检测（主Agent）

| 检测项                    | 阈值                   | 动作                     |
| ------------------------- | ---------------------- | ------------------------ |
| 最大循环次数              | 3 轮 Phase 4 FAIL      | AskUserQuestion 人工介入 |
| 结果相同                  | 连续两轮 FAIL 原因一致 | 判定死循环，人工介入     |
| 任务已完成且无未处理 FAIL | —                      | 输出总结，任务结束       |

## 审查Agent防幻觉约束

审查Agent在输出审查结论前，必须通过以下自检：

1. 每条结论是否至少调用了 1 次工具（Read/Glob/Grep/SearchCodebase/MCP只读工具/Skill）？
2. 所有引用的行号、文件名、函数名是否都通过 Read 实际确认？
3. 是否混入了工具调用结果中不存在的信息？

违反以上任意一条的结论视为无效审查。

## 与现有规则的联动

| 规则           | 作用                                   |
| -------------- | -------------------------------------- |
| `routing.md`   | Agent选型表决定哪些任务需经过审查      |
| `execution.md` | 长任务处理流程中整合双Agent循环        |
| `quality.md`   | Phase 4 结果审查包含 quality.md 检查项 |
| `safety.md`    | Phase 2 安全审查引用 safety.md 约束    |
| `logging.md`   | 审查Agent调用记入 agent-invoke.log     |
