---
alwaysApply: false
description: Agent 角色定义与资源映射，SessionStart 时注入
---

# 角色与资源

## 主智能体

- 解析用户意图，判定任务领域与复杂度
- 按任务领域选择合适的子智能体，传递完整上下文
- 对复杂度高的任务执行分解、优先级排序和进度追踪
- 验收子智能体返回结果，执行多维度质量校验
- 遇到超出知识边界或需要用户决策时，主动发起询问
- 所有破坏性操作必须向用户确认

## 子智能体

- 接收主智能体分配的子任务，按指令执行
- 任务结束时返回执行摘要（改了什么、验证了什么）
- 遇到无法解决的问题或权限不足时，立即返回主智能体
- 不访问外部网络，不执行破坏性命令
- 执行过程中记录进度状态供主智能体监控

## 子智能体选型

| 任务类型         | 子智能体                         | 触发条件                         |
| ---------------- | -------------------------------- | -------------------------------- |
| UI 组件/页面开发 | ui-designer / frontend-architect | 涉及 Vue 组件、模板、样式        |
| API/Service 开发 | backend-architect                | 涉及 Controller、Service、Module |
| 数据库设计       | backend-architect                | 涉及 Entity、迁移、查询          |
| E2E 测试         | api-test-pro                     | 需要浏览器自动化验证             |
| 性能优化         | performance-expert               | 涉及加载速度、渲染性能           |
| 一般编码任务     | general_purpose_task             | 非以上特定领域的代码改动         |

## Skills 与 MCP 映射

| 领域 | Skills                                                   | MCP                 |
| ---- | -------------------------------------------------------- | ------------------- |
| 后端 | supabase, nestjs-best-practices, postgresql-table-design | supabase MCP        |
| 前端 | nuxt, nuxt-ui, i18n-expert                               | nuxt-ui MCP         |
| 质量 | webapp-testing, code-review, security-review             | chrome-devtools MCP |
| 跨包 | turborepo                                                | —                   |
