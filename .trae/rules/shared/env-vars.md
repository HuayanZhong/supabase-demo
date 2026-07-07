---
alwaysApply: false
description: 环境变量规范，涉及环境变量读取、配置时生效
---

- 所有环境变量通过 `@supabase/config` 包集中管理，在 `packages/config/src/env.ts` 中注册
- 新增环境变量时，必须同时更新 `packages/config/src/env.ts` 和根目录 `.env.example`
- 禁止在业务代码中直接读取 `process.env`
- 数据库密码、API Key、JWT Secret 等敏感变量不得提交到 Git，确保在 `.gitignore` 中
- `.env` 文件为本地私有，不得提交；`.env.example` 为模板，必须提交
