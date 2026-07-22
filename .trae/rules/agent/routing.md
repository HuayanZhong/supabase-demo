---
alwaysApply: false
description: 任务路由决策规则，定义意图分类、Agent 选型和任务摘要，由 UserPromptSubmit hook 注入。Skill 触发规则、强制触发条件与并行策略已解耦至独立文件。
---

# 任务路由决策

## 执行前自检（前置门禁）

**在开始任何代码改动、配置修改或文件操作之前，必须逐项检查以下门禁条件。全部通过后方可继续。**

```
门禁 A: 本任务是否命中 Skill 触发规则？
  ├─ 是 → 先调用 Skill() 工具，获取辅助信息后再继续执行
  ├─ 否 → 跳过
  └─ 约束: Skill 调用是硬性要求，不得自行推断替代
  └─ 参考: 完整 Skill 触发规则表见 skill-triggers.md

门禁 B: 本任务是否命中 Agent 选型表（下方）？
  ├─ 是 → 使用 Task(subagent_type=...) 分配子智能体执行
  ├─ 否 → 自行执行
  └─ 约束: 命中则强制使用 Agent，不得降级自行实现

门禁 C: 本任务是否满足并行执行条件？
  ├─ 是 → 同一消息中多 Task 并行启动
  ├─ 否 → 串行执行
  └─ 参考: 并行策略与降级条件见 agent-forced-triggers.md

门禁 D: 连续 N 轮无 Skill/Subagent 调用？
  ├─ 检查本会话中 Skill() 和 Task(subagent) 的调用次数
  ├─ 如果最近 5 轮用户消息中涉及代码/配置/测试类任务但 Skill 调用 = 0
  │  且 Subagent 调用 = 0 → 输出以下警告并询问用户：
  │  "⚠️ 本次会话已连续 {N} 轮代码任务未调用专家系统。建议强制触发 {推荐Skill/Agent列表}？"
  └─ 约束: 每日首次警告必须提出，之后每 5 轮重复一次
```

> 此门禁在 UserPromptSubmit 时注入，所有后续步骤必须在此检查通过后执行。

## 会话类型判定

**每轮响应前重新评估。** 根据当前用户消息语义判断：

- 消息涉及编码、重构、调试、审查、部署、配置、测试等正式开发任务 → 写入/更新 `.trae/.session-mode`，内容为 `dev`
- 其他（问候、提问、讨论、闲聊、非任务） → 写入/更新 `.trae/.session-mode`，内容为 `chat`

此文件由下一轮 UserPromptSubmit 的 hooks 读取，决定是否注入路由指令。
当会话从聊天切换到开发或反之，立即更新文件，下轮生效。

判断完毕后，继续以下路由决策。

## 意图分类

收到用户请求后，先判定所属领域：

| 领域          | 判断依据                                      | 关联规则                                                             |
| ------------- | --------------------------------------------- | -------------------------------------------------------------------- |
| 前端开发      | 涉及 Vue 组件、Nuxt 页面、样式、i18n、UI 布局 | `nuxt.md` `styles.md` `i18n.md` `frontend/quality.md`                |
| 后端开发      | 涉及 Controller、Service、Module、Entity、API | `nestjs.md` `nestjs-fundamentals/` `error-handling.md` `database.md` |
| 代码审查/安全 | 用户要求审查、审计、安全检查                  | `security.md` `testing.md`                                           |
| 测试编写      | 用户要求编写/补充/完善单元测试、函数测试      | `testing.md`                                                         |
| 配置/跨包     | 涉及 env、依赖、monorepo 结构、构建配置       | `dependencies.md` `env-vars.md` `monorepo.md`                        |
| 元任务        | 涉及 hooks 配置、规则维护、项目审计           | 直接处理                                                             |

> 如无法明确归属或存在歧义 → 用 `AskUserQuestion` 澄清

## Agent 选型

根据意图分类结果选择执行策略。**以下选型为强制约束**，主智能体必须使用匹配的 Agent 类型执行核心任务。

| 分类                | 执行策略         | Agent 选型                                      | 审查验证   |
| ------------------- | ---------------- | ----------------------------------------------- | ---------- |
| 前端 UI/页面        | **专属 Agent**   | `ui-designer` / `frontend-architect`            | P0/P1 强制 |
| 后端 API/Service/DB | **专属 Agent**   | `backend-architect`                             | P0/P1 强制 |
| 代码审查            | **并行多 Agent** | `code-review`(Skill) + `security-review`(Skill) | ❌ 跳过    |
| 测试编写            | **专属 Agent**   | `test-completer`                                | ❌ 跳过    |
| 全栈/跨领域         | **并行多 Agent** | `frontend-architect` + `backend-architect`      | 强制       |
| 性能优化            | **专属 Agent**   | `performance-expert`                            | 可选       |
| API 测试            | **专属 Agent**   | `api-test-pro`                                  | ❌ 跳过    |
| 合规/法律           | **专属 Agent**   | `compliance-checker`                            | ❌ 跳过    |
| 简单任务            | **单 Agent**     | `general_purpose_task`                          | 可选跳过   |

> **强制触发策略**：审查验证/安全/Debugger 自动触发、并行执行策略、降级条件 → 详见 `agent-forced-triggers.md`

### 优先级参考

| 优先级 | 定义                                   |
| ------ | -------------------------------------- |
| P0     | 用户明确要求的核心功能，阻塞后续任务   |
| P1     | 核心流程辅助功能，缺失会影响可用性     |
| P2     | 优化/增强/体验改进，缺失不影响核心流程 |

## Agent 使用审计

每轮任务日志中，必须对照上表逐项披露：

| 审计项         | 要求                                                  |
| -------------- | ----------------------------------------------------- |
| 预期 Agent     | 根据意图分类引用表格中的推荐 Agent                    |
| 实际 Agent     | 列出本轮实际使用的 Agent                              |
| 偏差原因       | 如实际 ≠ 预期，说明降级条件                           |
| 未使用 Agent   | 列出推荐但未使用的 Agent，无则写"无"                  |
| **Skill 调用** | **列出本轮调用的 Skill，若命中规则但未调用则标记 ❌** |

> 连续 3 轮"未使用 Agent"列出现同一 Agent 名 → 警告并询问用户是否强制触发。
> **连续 2 轮 Skill 调用为 ❌ → 自动执行门禁 D 的强制触发流程。**

## 任务摘要

1. 用一句话总结用户要什么
2. 确认领域分类和 Agent 选型结果
3. 如有歧义或信息缺失 → `AskUserQuestion` 澄清

## 相关规则

| 规则文件                   | 关联说明                                            |
| -------------------------- | --------------------------------------------------- |
| `skill-triggers.md`        | 完整 Skill 触发规则表与示例                         |
| `agent-forced-triggers.md` | 审查验证/安全/Debugger 强制触发、并行策略、降级条件 |
| `dual-agent-loop.md`       | 审查验证循环生命周期                                |
| `execution.md`             | 执行规范中的 Debugger 自动兜底                      |
