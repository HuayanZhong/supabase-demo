---
alwaysApply: false
description: 任务路由决策规则，定义意图分类、Agent 选型和任务摘要，由 classify-intent.ps1 在 UserPromptSubmit 时注入
---

## 会话类型判定

**每轮响应前重新评估。** 根据当前用户消息语义判断：

- 消息涉及编码、重构、调试、审查、部署、配置、测试等正式开发任务 → 写入/更新 `.trae/.session-mode`，内容为 `dev`
- 其他（问候、提问、讨论、闲聊、非任务） → 写入/更新 `.trae/.session-mode`，内容为 `chat`

此文件由下一轮 UserPromptSubmit 的 hooks 读取，决定是否注入路由指令。
当会话从聊天切换到开发或反之，立即更新文件，下轮生效。

判断完毕后，继续以下路由决策。

## 任务路由决策

### 意图分类

收到用户请求后，先判定所属领域：

| 领域          | 判断依据                                      | 关联规则                                              |
| ------------- | --------------------------------------------- | ----------------------------------------------------- |
| 前端开发      | 涉及 Vue 组件、Nuxt 页面、样式、i18n、UI 布局 | `nuxt.md` `styles.md` `i18n.md` `frontend/quality.md` |
| 后端开发      | 涉及 Controller、Service、Module、Entity、API | `nestjs.md` `error-handling.md` `database.md`         |
| 代码审查/质量 | 用户要求审查、审计、安全检查、测试            | `security.md` `testing.md`                            |
| 配置/跨包     | 涉及 env、依赖、monorepo 结构、构建配置       | `dependencies.md` `env-vars.md` `monorepo.md`         |
| 元任务        | 涉及 hooks 配置、规则维护、项目审计           | 直接处理                                              |

> 如无法明确归属或存在歧义 → 用 `AskUserQuestion` 澄清

### Agent 选型

根据意图分类结果选择执行策略：

| 分类                | 执行策略         | Agent 选型                                      |
| ------------------- | ---------------- | ----------------------------------------------- |
| 前端 UI/页面        | **专属 Agent**   | `ui-designer` / `frontend-architect`            |
| 后端 API/Service/DB | **专属 Agent**   | `backend-architect`                             |
| 代码审查            | **并行多 Agent** | `code-review`(Skill) + `security-review`(Skill) |
| 全栈/跨领域         | **并行多 Agent** | `frontend-architect` + `backend-architect`      |
| 性能优化            | **专属 Agent**   | `performance-expert`                            |
| API 测试            | **专属 Agent**   | `api-test-pro`                                  |
| 合规/法律           | **专属 Agent**   | `compliance-checker`                            |
| 简单任务            | **单 Agent**     | `general_purpose_task`                          |

### 任务摘要

1. 用一句话总结用户要什么
2. 确认领域分类和 Agent 选型结果
3. 如有歧义或信息缺失 → `AskUserQuestion` 澄清

## 冲突解决

- 不同规则对同一事项有不同要求时，领域层 > 基础层 > 通用常识
- 同一规则文件内有冲突，以靠后的条目为准
- 主智能体无法裁决时，询问用户
