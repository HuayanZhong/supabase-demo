---
alwaysApply: false
description: Skill 触发规则表与示例，定义哪些场景必须调用对应 Skill 辅助执行
---

# Skill 触发规则

## 触发规则表

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
| 9   | **审查/验证/审核改动**（计划审查、结果审查、合规检查）                                                                  | `review-verifier`         | 涉及 review/审查/验证/审核/verifier 关键词                 |
| 10  | **结构化代码审查**（审查PR/差异/代码质量，输出结构化反馈）                                                              | `TRAE-code-review`        | 涉及 code review/代码审查/审查代码/审查PR 关键词           |
| 11  | **调试运行时 Bug**（需运行时证据、日志采集、复现分析的复杂问题）                                                        | `TRAE-debugger`           | 涉及 debug/调试/bug修复/运行时错误/日志分析 关键词         |

> 命中标志为参考信号，不要求精确匹配——只要任务**实质涉及**对应技术栈即触发。
>
> **调用方式**：Skill 通过 `Skill()` 工具在当前会话中直接调用，不创建子 Agent。调用后读取 Skill 提供的上下文信息再继续执行。
>
> **多命中策略**：如果当前任务同时命中多个 Skill，优先调用排在表中最前面的 2 个。如果这 2 个 Skill 存在依赖关系（如 `supabase` 依赖 `postgresql-table-design`），按依赖顺序串行调用。

## 触发示例

| 用户说                                   | 命中 Skill(s)                          | 原因                            |
| ---------------------------------------- | -------------------------------------- | ------------------------------- |
| "给 locations 加个分页查询"              | `nestjs-best-practices`                | NestJS Service 修改             |
| "Supabase 数据库加个 users 表"           | `supabase` + `postgresql-table-design` | 同时涉及 Supabase 和表设计      |
| "新建一个 Nuxt 页面显示天气数据"         | `nuxt` + `nuxt-ui`                     | 新页面 + 可能用 Nuxt UI 组件    |
| "加了 Controller 但 Swagger 不显示"      | `nestjs-best-practices`                | NestJS Controller 相关问题      |
| "把后端 API 路径从 /api/v0 改成 /api/v1" | 无 Skill 命中                          | 纯配置变更（main.ts），直接执行 |
| "Entity 加了新字段，写迁移"              | `mikro-orm-docs`                       | MikroORM 迁移操作               |
| "审查对 auth controller 的改动"          | `review-verifier` + `TRAE-code-review` | 双Agent审查 + 结构化审查技能    |
| "登录接口一直 500 错误"                  | `TRAE-debugger`                        | 需运行时诊断的 Bug              |

## 相关规则

| 规则文件     | 关联说明                                       |
| ------------ | ---------------------------------------------- |
| `routing.md` | 执行前门禁 A 检查 Skill 命中；Agent 使用审计表 |
