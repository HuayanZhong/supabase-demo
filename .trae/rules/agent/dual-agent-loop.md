---
alwaysApply: false
description: 双Agent协作循环规则，定义主Agent与审查Agent(review-verifier)的协作生命周期、循环控制与收敛机制，集成 TRAE-code-review / TRAE-debugger 技能，由 UserPromptSubmit hook 注入
---

# 双Agent协作循环（Dual-Agent Loop）

## 概述

将主Agent与审查Agent分离，通过独立上下文的审查环节提升代码质量和安全性。审查Agent拥有**独立的上下文窗口**，不共享主Agent的推理过程。

本循环集成了两个内置技能：

| 技能               | 集成位置                            | 作用                          |
| ------------------ | ----------------------------------- | ----------------------------- |
| `TRAE-code-review` | Phase 2 计划审查 + Phase 4 结果审查 | 提供结构化代码审查方法论      |
| `TRAE-debugger`    | Phase 5 收敛检测 → Debugger 分支    | 3次修复失败后启用科学调试流程 |

### 循环模型

```
标准 Agent Loop:      上下⽂收集 → 执⾏ → 验证 → 重复
                            │        │      │
Dual-Agent Loop:            │        │      │
  Phase 1 (主Agent): 计划生成 ────────┘      │
  Phase 2 (审查Agent): 计划审查 + TRAE-code-review ─┘
  Phase 3 (主Agent): 任务执⾏ ────────────────┐
  Phase 4 (审查Agent): 结果审查 + TRAE-code-review ─┘
  Phase 5 (主Agent): 收敛检测
    ├─ 成功 → 完成
    └─ 3次FAIL → TRAE-debugger → 人工介入
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

**Skill 强注入：**

- 审查Agent必须先调用 `Skill("TRAE-code-review")` 获取审查框架
- 然后按 TRAE-code-review 的方法论执行范围确定和上下文收集

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

**Skill 强注入：**

- 审查Agent必须先调用 `Skill("TRAE-code-review")` 获取审查框架
- 然后按 TRAE-code-review 的方法论执行意图推断、问题扫描、交叉验证
- 再调用对应的**领域 Skill**（如 `nestjs-best-practices`）获取领域规范比对

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

| 检测项                    | 阈值                       | 动作                                         |
| ------------------------- | -------------------------- | -------------------------------------------- |
| 任务已完成且无未处理 FAIL | —                          | 输出总结，任务结束                           |
| 结果相同                  | 连续两轮 FAIL 原因完全一致 | 先触发 Debugger，不直接人工介入              |
| 最大循环次数              | 3 轮 Phase 4 FAIL          | **先触发 TRAE-debugger**，再决定是否人工介入 |

#### Debugger 介入流程

当 Phase 4 连续 3 次 FAIL 或连续两轮原因相同时，不直接 AskUserQuestion，改为：

```
  3次 FAIL / 重复 FAIL
    │
    ▼
  Skill("TRAE-debugger") → 启动科学调试流程
    │
    ├─ 假设提出 → 插桩采集 → 证据分析 → 根因定位
    │
    ▼
  Debugger 输出根因分析报告
    │
    ├─ 根因明确 → 主Agent按 Debugger 建议修复 → 回到 Phase 3
    └─ 根因不明 → AskUserQuestion 人工介入
```

**具体执行：**

1. **主Agent** 在当前上下文调用 `Skill("TRAE-debugger")`
2. Debugger 遵循其科学调试流程：假设提出 → 插桩采集 → 证据分析 → 根因定位
3. Debugger 输出**根因分析报告**（包含假设验证结果、关键日志证据、修复建议）
4. 主Agent根据 Debugger 的报告决定：
   - 根因明确 → 按建议修复，回到 Phase 3 重新执行
   - 根因不明或 Debugger 也无法定位 → `AskUserQuestion` 人工介入
5. Debugger 清理：根因明确且修复后，由 Debugger 自动清理插桩代码和调试产物

**经验记录：** Debugger 定位的根因必须记录到 `learning.md`。记录格式：

```
## [日期] 根因记录：{问题简述}
- 模块: {模块名}
- 根因: {Debugger 分析结果}
- 修复: {修复方案摘要}
- 预防: {如何避免再犯}
```

> 连续 2 次触发 Debugger 仍无法定位根因 → 强制人工介入。

## 审查Agent防幻觉约束

审查Agent在输出审查结论前，必须通过以下自检：

1. 是否调用了 `Skill("TRAE-code-review")`？（未调用 → 结论无效）
2. 每条结论是否至少调用了 1 次工具（Read/Glob/Grep/SearchCodebase/MCP只读工具/Skill）？
3. 所有引用的行号、文件名、函数名是否都通过 Read 实际确认？
4. 是否混入了工具调用结果中不存在的信息？

违反以上任意一条的结论视为无效审查。

## 与现有规则的联动

| 规则                       | 作用                                                                                |
| -------------------------- | ----------------------------------------------------------------------------------- |
| `routing.md`               | Agent选型表决定哪些任务需经过审查                                                   |
| `skill-triggers.md`        | Skill 触发规则表（TRAE-code-review / TRAE-debugger 触发条件）                       |
| `agent-forced-triggers.md` | 审查验证/Debugger 强制触发条件                                                      |
| `execution.md`             | 长任务处理流程中整合双Agent循环 + Debugger兜底                                      |
| `quality.md`               | Phase 4 结果审查包含 quality.md 检查项；Phase 5 收敛通过后结果记入 task log         |
| `safety.md`                | Phase 2 安全审查引用 safety.md 约束                                                 |
| `logging.md`               | 审查Agent/Debugger 调用记入 agent-invoke.log；Phase 5 quality 检查结果记入 task log |
| `learning.md`              | Debugger 根因分析结果记录到 learning.md                                             |
