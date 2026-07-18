---
name: shared-frontend-types
alwaysApply: false
description: 类型定义规范，涉及 @supabase/types 或数据模型定义时生效
---

- `@supabase/types` 定义前端 ViewModel（扁平、Presentational），供前端组件直接消费
- **新类型必须在 @supabase/types 中直接创建，不允许先内联在业务代码中再事后抽取**
- `@supabase/dal` 定义数据库 Entity（关联、索引、约束），使用 MikroORM 装饰器
- ViewModel 和 Entity 不应有 OOP 继承关系，但允许通过 TypeScript utility types（`Pick`、`Omit`、交集类型）共享基础字段定义
- ViewModel 中的嵌套数组（如 `recentActivities`、`milestones`）对应 Entity 层的独立表，通过外键关联
- ViewModel 中的 `id` 字段统一为 `string` 类型
- Entity 中的联合查询、预加载由 Repository 封装，不在 ViewModel 中暴露
- DTO（请求/响应类型）放在 `@supabase/types` 中，与 ViewModel 同级
- API 枚举类型统一放在 `@supabase/types`，使用 `as const` + 联合类型定义
