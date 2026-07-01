---
title: Trae Subagent 开发指南
description: 项目级 Subagent 的编写规范、最佳实践和参考手册
---

# Trae Subagent 开发指南

## 概述

Subagent 是通过 Markdown 文件定义的专用智能体，SOLO Agent 会在识别到合适任务时自动调用对应的 Subagent。每个 Subagent 拥有独立的上下文窗口，中间推理和执行过程不会污染主对话上下文。

### 调用机制

1. **用户发送消息** → SOLO Agent 判断任务类型
2. **匹配 `description`** → 将用户意图与所有可用 Subagent 的 description 匹配
3. **决定是否调用** → 高度相关时自动委派
4. **执行任务** → Subagent 在自己的上下文和工具权限范围内工作
5. **返回结果** → Subagent 返回结果给 SOLO Agent，由 SOLO Agent 汇总呈现

### 文件位置

| 类型                   | 路径                                               |
| ---------------------- | -------------------------------------------------- |
| **用户级**（跨项目）   | macOS/Linux: `~/.trae-cn/agents/{name}.md`         |
|                        | Windows: `%userprofile%/.trae-cn/agents/{name}.md` |
| **项目级**（当前项目） | `{project_folder}/.trae/agents/{name}.md`          |

### 覆盖规则

- 项目级 Subagent 覆盖同名的用户级 Subagent
- 同级别同名 Subagent，只有最先加载的生效

---

## 配置文件结构

Subagent 配置文件由 **YAML frontmatter** + **系统提示词** 两部分组成。

### 基础模板

````markdown
---
name: my-agent
description: Describes when SOLO Agent should invoke this Subagent
model: Doubao-Seed-2.1-Pro
tools: Read, Glob, Grep, Edit, Write, Bash, WebSearch, WebFetch, LSP, TodoWrite
disallowedTools:
mcpServers:
  - nuxt-ui
  - mcp_supabase
---

你是 ...，专精于 ...。

## 执行流程

1. **理解需求** — ...
2. **检查已有代码** — ...
3. **查询文档** — ...
4. **实现** — ...
5. **验证** — ...

## 项目上下文

...

## 行为边界

...

## 验证

```bash
pnpm lint
pnpm format
pnpm check-types
```
````

````

### frontmatter 字段说明

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `name` | string | **是** | 唯一标识。字母开头，含字母/数字/连字符 `-`，字母或数字结尾，≤50 字符。 |
| `description` | string | **是** | 触发场景描述。越具体调度越准确。 |
| `model` | string | 否 | 指定模型。不填则使用 SOLO Agent 当前选择的模型。 |
| `tools` | string | 否 | 允许的工具列表，英文逗号分隔。不填则默认全部工具。 |
| `disallowedTools` | string | 否 | 禁止的工具列表。优先级高于 `tools`。 |
| `mcpServers` | list | 否 | 允许调用的 MCP Server 名称。需先在 IDE 中配置并启用。 |

> **注意**：`tools` 和 `disallowedTools` 同时出现时，`disallowedTools` 优先级更高。

---

## 可用模型

| 模型名称 | `model` 字段填入值 |
|----------|-------------------|
| Doubao-Seed-2.1-Pro | `Doubao-Seed-2.1-Pro` |
| Doubao-Seed-2.1-Turbo | `Doubao-Seed-2.1-Turbo` |
| Doubao-Seed-Code | `Doubao_1_6` |
| MiniMax-M3 | `minimax-m3` |
| MiniMax-M2.7 | `minimax-m2.7` |
| GLM-5.2 | `glm-5.2` |
| GLM-5.1 | `glm-5.1` |
| GLM-5V-Turbo | `glm-5v-turbo` |
| GLM-5 | `glm-5` |
| DeepSeek-V4-Pro | `DeepSeek-V4-Pro` |
| DeepSeek-V4-Flash | `DeepSeek-V4-Flash` |
| Kimi-K2.7-Code | `kimi-k2.7-code` |
| Kimi-K2.6 | `kimi-k2.6` |
| Qwen3.7-Plus | `qwen-3.7-plus` |
| Qwen3.6-Plus | `qwen-3.6-plus` |

---

## 可用工具

| 工具名 | 功能 | 适用场景 |
|--------|------|----------|
| `Read` | 读取文件或目录 | 几乎必选，用于理解代码 |
| `Glob` | 按文件名模式搜索 | 查找文件 |
| `Grep` | 按内容正则搜索 | 查找代码引用、模式匹配 |
| `Edit` | 编辑或删除文件 | 需要修改代码时使用 |
| `Write` | 创建或覆写文件 | 新建文件时使用 |
| `Bash` | 运行终端命令 | 运行测试、构建、git 操作 |
| `LSP` | Language Server 检查语法 | 获取诊断信息 |
| `TodoWrite` | 管理任务清单 | 复杂任务规划 |
| `WebSearch` | 联网搜索 | 查 API 文档、最新信息 |
| `WebFetch` | 抓取网页内容 | 精读文档页面 |
| `Skill` | 调用 Skill | 使用已安装的 Skill |
| `mcp__*__*` | 限定 MCP 工具 | 精确控制 MCP 工具权限 |

### 权限分级建议

| 类型 | 推荐工具 |
|------|----------|
| **只读审查型** | `Read, Glob, Grep, LSP, TodoWrite` |
| **读写实现型** | `Read, Glob, Grep, Edit, Write, Bash, LSP, TodoWrite` |
| **联网查询型** | `Read, Glob, Grep, WebSearch, WebFetch, LSP, TodoWrite` |
| **全功能型** | `Read, Glob, Grep, Edit, Write, Bash, WebSearch, WebFetch, LSP, TodoWrite` |

> **最小权限原则**：只给 Subagent 完成任务所需的最少工具，不要全部放开。

---

## MCP 集成

### 配置方式

```yaml
mcpServers:
 - nuxt-ui
 - mcp_supabase
````

### 限定工具调用

```yaml
tools: Read, Glob, mcp__nuxt-ui__get-component, mcp__supabase__execute_sql
```

> 限定 MCP 工具的格式：`mcp__{server_name}__{tool_name}`

---

## description 编写规范

`description` 决定了 SOLO Agent 何时调用该 Subagent，是**最重要的匹配信号**。

### 黄金公式

> **`{动作} {对象} when {触发条件}`**

### 示例

| 推荐（带 when 场景描述）                                                               | 不推荐（过于简短）   |
| -------------------------------------------------------------------------------------- | -------------------- |
| `Reviews code for quality and best practices when user asks for code review`           | `Code reviewer`      |
| `Generates unit tests for TypeScript files using Jest framework`                       | `Write tests`        |
| `Analyzes and explains complex Go code when user asks 'what does this do'`             | `Helper`             |
| `Creates or modifies Nuxt UI components when user asks to build or change frontend UI` | `Frontend developer` |

### 项目级 description 参考

参考本项目的 Subagent：

```yaml
# 前端 UI
description: 前端 UI 设计与实现，适用于 Nuxt UI 组件开发、页面布局、响应式设计、样式调整、图标选择等场景

# NestJS 后端
description: Designs and implements NestJS backend code when user asks to create or modify API endpoints, MikroORM entities, database schemas, NestJS modules/controllers/services, or backend infrastructure in the apps/backend directory

# API 测试
description: Tests, validates, and analyzes API endpoints when user asks to test, benchmark, or verify backend APIs, or when implementing new endpoints that need contract validation and load testing
```

---

## 系统提示词编写规范

### 结构模板

````markdown
你是一个 {角色}，专精于 {专业领域}。

## 执行流程

1. **理解需求** — 明确任务范围和目标
2. **检查已有代码** — 搜索项目现有实现，保持风格一致
3. **查询文档** — API 不确定时联网查询，不凭记忆写代码
4. **实现** — 按项目约定编写代码
5. **验证** — 运行 lint / format / typecheck

## 项目背景

{必要的项目上下文，如目录结构、技术栈、约定}

## 行为边界

- {不能做的事情 1}
- {不能做的事情 2}

## 验证

```bash
{验证命令}
```
````

````

### 编写要点

| 要点 | 说明 |
|------|------|
| **角色定位** | 开头明确身份和专业领域 |
| **工作流程** | 用编号列表分步描述执行步骤 |
| **输出格式** | 如果期望特定格式（表格、JSON），明确说明 |
| **行为边界** | 说明哪些不应做（"只读不写"、"不修改后端代码"） |
| **项目上下文** | 补充目录结构、技术栈、代码风格 |
| **保持简洁** | Prompt 越短，调用成本越低，执行越稳定 |

---

## 项目级 Subagent 模式参考

### 模式 1：只读审查型

适用于代码审查、安全审计等只看不改的场景。

```yaml
tools: Read, Glob, Grep, LSP, TodoWrite
````

系统提示词关键点：

- 确定审查范围 → 读取代码 → 分析 → 输出报告
- 输出固定格式表格
- 明确"只读不写"

### 模式 2：读写实现型

适用于开发任务，需要读取、编写和验证代码。

```yaml
tools: Read, Glob, Grep, Edit, Write, Bash, LSP, TodoWrite
mcpServers:
  - nuxt-ui
```

系统提示词关键点：

- 先检查已有实现保持风格一致
- API 不确定时先查文档
- 实现后验证（lint/format/typecheck）

### 模式 3：联网查询型

适用于需要查阅最新文档或外部信息的任务。

```yaml
tools: Read, Glob, Grep, WebSearch, WebFetch, LSP, TodoWrite
```

### 模式 4：MCP 集成型

适用于对接外部平台能力。

```yaml
tools: Read, mcp__github__get_issue, mcp__github__update_issue
mcpServers:
  - GitHub
```

---

## 调试指南

### Subagent 没有被调用？

| 检查项                 | 排查方法                                |
| ---------------------- | --------------------------------------- |
| 功能开关               | 设置 → Beta → Subagents，确认开关已打开 |
| 文件路径               | 确认在正确的目录（项目级 vs 用户级）    |
| `name` 合法性          | 字母开头、字母/数字/连字符、≤50 字符    |
| `description` 是否存在 | 缺少 description 的文件不会被解析       |
| frontmatter 格式       | 标准 YAML，`---` 开头和结束，无 BOM     |
| description 匹配度     | 尝试在指令中使用 description 里的关键词 |

### Subagent 被调用但行为不符合预期？

| 检查项      | 排查方法                                 |
| ----------- | ---------------------------------------- |
| 工具权限    | tools 是否过多或不足，遵循最小权限原则   |
| Prompt 歧义 | 检查任务边界、输出格式、禁止事项是否明确 |
| 同名覆盖    | 是否存在同名 Subagent 被覆盖             |
| 项目上下文  | 是否缺少技术栈、代码风格、目录结构等背景 |
| MCP 配置    | mcpServers 名称是否与 IDE 配置一致       |

---

## 常见问题

### Q: tools 不填会怎样？

默认加载**全部可用工具**。建议显式声明以遵循最小权限原则。

### Q: model 不填会怎样？

使用 SOLO Agent 当前选择的模型。

### Q: 同一个 Subagent 可以配置多个 MCP Server 吗？

可以。在 `mcpServers` 列表中列出所有名称即可。

### Q: 项目级和用户级 Subagent 如何选择？

- **项目级**：跟随仓库，团队共享，适合固化项目规范
- **用户级**：跨项目生效，适合个人工作流

---

## 参考

- [Trae 官方文档 - 子智能体](https://docs.trae.cn/ide_subagents)
- 本项目 Subagent 位于 `.trae/agents/`
