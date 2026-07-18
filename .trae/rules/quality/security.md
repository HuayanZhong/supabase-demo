---
alwaysApply: false
description: 安全约束，涉及认证/Auth/API Key/数据校验时生效
---

- API Key、数据库密码、JWT Secret 等凭证通过环境变量读取
- 禁止将 `.env` 文件、密钥文件提交到 Git
- 前端通过 `@supabase/ssr` 处理认证，不使用 localStorage 存储 token
- 用户输入必须做校验（前端 Zod schema + 后端 DTO class-validator）
- 数据库查询使用 MikroORM 的参数化查询，避免 SQL 注入
- Supabase RLS（行级安全）在数据表级别控制访问权限
- 涉及删除文件、表结构变更、数据销毁的操作，必须先向用户展示操作内容并获确认
- 依赖安全：运行 `pnpm audit` 检查依赖漏洞，生产环境部署前必须修复 High 及以上级别漏洞
