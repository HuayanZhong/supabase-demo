---
alwaysApply: false
description: Supabase 数据库工具，用于数据库操作、SQL 执行、表结构查询，涉及数据库查询/迁移时自动触发
---

# Supabase MCP

## 用途

Supabase 数据库工具，用于数据库操作、SQL 执行、表结构查询。

## 触发条件

- 涉及数据库操作
- SQL 执行
- 表结构查询
- 数据库迁移
- 数据查询

## 使用示例

```
任务：查询数据库表结构
→ 自动匹配：supabase MCP

任务：执行 SQL 查询
→ 自动匹配：supabase MCP

任务：创建数据库迁移
→ 自动匹配：supabase MCP
```

## 注意事项

- 执行破坏性操作前必须确认
- 注意 SQL 注入防护
- 敏感操作需要用户确认
