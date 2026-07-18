---
alwaysApply: false
description: 任务路由决策规则，定义意图分类、Agent 选型和任务摘要，由 classify-intent.ps1 在 UserPromptSubmit 时注入
---

# 任务路由决策

## 执行前自检（前置门禁）

**在开始任何代码改动、配置修改或文件操作之前，必须逐项检查以下门禁条件。全部通过后方可继续。**

```
门禁 A: 本任务是否命中 Skill 触发规则？
  ├─ 是 → 先调用 Skill() 工具，获取辅助信息后再继续执行
  ├─ 否 → 跳过
  └─ 约束: Skill 调用是硬性要求，不得自行推断替代

门禁 B: 本任务是否命中 Agent 选型表（下方）？
  ├─ 是 → 使用 Task(subagent_type=...) 分配子智能体执行
  ├─ 否 → 自行执行
  └─ 约束: 命中则强制使用 Agent，不得降级自行实现

门禁 C: 本任务是否满足并行执行条件（见并行策略）？
  ├─ 是 → 同一消息中多 Task 并行启动
  └─ 否 → 串行执行

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

### Skill 触发规则

**以下场景必须调用对应 Skill 辅助执行，不得跳过。** 触发条件采用"宽匹配"策略——只要任务涉及对应技术栈的任何操作（读、写、改、查、配），均命中。

| #   | 触发场景（宽匹配）                                                                                                      | Skill                     | 命中标志                                                   |
| --- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------- | ---------------------------------------------------------- |
| 1   | **任何 NestJS 代码操作**（Controller/Service/Module/Guard/Filter/Interceptor/中间件/DTO/pipe 的新建、修改、审查、重构） | `nestjs-best-practices`   | 出现 `@Module` `@Controller` `@Injectable` 等装饰器        |
| 2   | **任何 MikroORM 操作**（Entity/Repository/迁移/查询/种子数据的读写、修改、生成、调试）                                  | `mikro-orm-docs`          | 出现 `@Entity` `@Repository` `em.` 等                      |
| 3   | **任何数据库操作**（表设计、索引创建、查询优化、SQL 审核、Schema 变更）                                                 | `postgresql-table-design` | 涉及 `sql` `table` `index` `query` 关键词                  |
| 4   | **任何 Supabase 操作**（Auth/DB/Storage/Edge Functions/Realtime/RLS/迁移）                                              | `supabase`                | 涉及 `supabase` 关键词或操作 Supabase 资源                 |
| 5   | **任何 Nuxt 操作**（页面新建/修改、数据获取、路由配置、中间件、SSR/SSG 配置）                                           | `nuxt`                    | 涉及 `.vue` 页面或 `useFetch` `useAsyncData` 等 composable |
| 6   | **使用 Nuxt UI 组件库**（添加/配置/定制组件、主题、布局）                                                               | `nuxt-ui`                 | 出现 `<U` 前缀组件或 `@nuxt/ui` 引用                       |
| 7   | **涉及 Turborepo Monorepo 配置**（turbo.json、pipeline、缓存、remote cache、filter）                                    | `turborepo`               | 涉及 `turbo.json` 或 monorepo 构建配置                     |
| 8   | **编写或修改测试**（单元测试、集成测试、E2E 测试）                                                                      | `test-driven-development` | 涉及 `.spec.ts` `.test.ts` 或 `describe` `it` `expect`     |

> 命中标志为参考信号，不要求精确匹配——只要任务**实质涉及**对应技术栈即触发。
>
> **调用方式**：Skill 通过 `Skill()` 工具在当前会话中直接调用，不创建子 Agent。调用后读取 Skill 提供的上下文信息再继续执行。
>
> **多命中策略**：如果当前任务同时命中多个 Skill，优先调用排在表中最前面的 2 个。如果这 2 个 Skill 存在依赖关系（如 `supabase` 依赖 `postgresql-table-design`），按依赖顺序串行调用。

#### Skill 触发示例

| 用户说                                   | 命中 Skill(s)                          | 原因                            |
| ---------------------------------------- | -------------------------------------- | ------------------------------- |
| "给 locations 加个分页查询"              | `nestjs-best-practices`                | NestJS Service 修改             |
| "Supabase 数据库加个 users 表"           | `supabase` + `postgresql-table-design` | 同时涉及 Supabase 和表设计      |
| "新建一个 Nuxt 页面显示天气数据"         | `nuxt` + `nuxt-ui`                     | 新页面 + 可能用 Nuxt UI 组件    |
| "加了 Controller 但 Swagger 不显示"      | `nestjs-best-practices`                | NestJS Controller 相关问题      |
| "把后端 API 路径从 /api/v0 改成 /api/v1" | 无 Skill 命中                          | 纯配置变更（main.ts），直接执行 |
| "Entity 加了新字段，写迁移"              | `mikro-orm-docs`                       | MikroORM 迁移操作               |

## Agent 选型

根据意图分类结果选择执行策略。**以下选型为强制约束**，主智能体必须使用匹配的 Agent 类型执行核心任务。

| 分类                | 执行策略         | Agent 选型                                      |
| ------------------- | ---------------- | ----------------------------------------------- |
| 前端 UI/页面        | **专属 Agent**   | `ui-designer` / `frontend-architect`            |
| 后端 API/Service/DB | **专属 Agent**   | `backend-architect`                             |
| 代码审查            | **并行多 Agent** | `code-review`(Skill) + `security-review`(Skill) |
| 测试编写            | **专属 Agent**   | `test-completer`                                |
| 全栈/跨领域         | **并行多 Agent** | `frontend-architect` + `backend-architect`      |
| 性能优化            | **专属 Agent**   | `performance-expert`                            |
| API 测试            | **专属 Agent**   | `api-test-pro`                                  |
| 合规/法律           | **专属 Agent**   | `compliance-checker`                            |
| 简单任务            | **单 Agent**     | `general_purpose_task`                          |

### 安全 Agent 强制触发

以下场景 **必须** 调用 `security-review` Skill，不可降级：

| 触发条件                                       | 说明                   |
| ---------------------------------------------- | ---------------------- |
| 新建或修改包含表单输入的页面/组件              | 检查 XSS、输入验证     |
| 新建或修改 settings / profile / account 类页面 | 检查敏感数据暴露、CSRF |
| 新增或修改 API 端点                            | 检查认证、授权、注入   |
| 涉及用户输入的任何变更                         | 检查输入净化           |

### Agent 并行执行策略

满足以下条件时，**必须同时启动多个 Agent（同一消息中并行 Task 调用）**：

| 条件                           | 并行策略                                                      |
| ------------------------------ | ------------------------------------------------------------- |
| 任务同时涉及"实现 + 审核"      | `frontend-architect`(实现) + `security-review`(安全审核) 并行 |
| 变更涉及 3+ 个独立文件         | 按文件/模块拆分为 N 个 `general_purpose_task` 并行执行        |
| 多语言同步（locale JSON 变更） | 1 个 Agent 负责所有语言文件（批量操作）                       |
| 后端任务涉及多个独立业务模块   | 每个模块分配一个 `backend-architect` 并行执行                 |

> 并行启动的子 Agent 必须各有独立明确的职责边界，避免重复工作。
> 对于后端开发，如果任务涉及 2+ 个独立业务模块（locations/weathers/quotes 等），优先拆分为并行 Subagent；但如果涉及模块间依赖重构（如通用基础设施 qweather），则串行执行。

### Agent 选型降级条件（严格）

仅当满足以下任一条件时，主智能体可自行执行：

| 条件                             | 示例                       | 归档要求           |
| -------------------------------- | -------------------------- | ------------------ |
| 推荐 Agent 不可达（环境限制）    | 当前无对应 Agent 可用      | 任务日志中注明原因 |
| 单行变更（纯文案/单 class 修正） | 修改一行文案、换一个 class | 标注"单行变更降级" |
| 仅注释变更（不涉及逻辑修改）     | 补充 JSDoc、加行内注释     | 标注"注释变更"     |
| Agent 返回不合格需接管           | Agent 输出不达标           | 记录不合格原因     |

> **禁止降级**：新建文件、涉及 3+ 行逻辑变更、涉及用户数据/表单、页面级重写 — 以上场景无论多"简单"，必须使用对应 Agent。

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
