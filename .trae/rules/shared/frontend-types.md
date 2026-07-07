---
alwaysApply: false
description: 类型定义规范，涉及 @supabase/types 或数据模型定义时生效
---

- `@supabase/types` 定义前端 ViewModel（扁平、Presentational），供前端组件直接消费
- `@supabase/dal` 定义数据库 Entity（关联、索引、约束），使用 MikroORM 装饰器
- ViewModel 和 Entity 之间没有继承关系，NestJS Service 负责 Entity → ViewModel 转换
- ViewModel 中的嵌套数组（如 `recentActivities`、`milestones`）对应 Entity 层的独立表，通过外键关联
- ViewModel 中的 `id` 字段统一为 `string` 类型
- Entity 中的联合查询、预加载由 Repository 封装，不在 ViewModel 中暴露
