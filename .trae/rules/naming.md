---
alwaysApply: true
description: 命名规范，全项目通用
---

- 文件名：kebab-case（`user-profile.vue`、`mikro-orm.config.ts`）
- 目录名：kebab-case
- 类名、接口名、类型名：PascalCase（`UserEntity`、`ProjectRepository`）
- 变量名、函数名、方法名：camelCase（`getUserById`、`isLoading`）
- 常量：camelCase（不使用全大写），如 `defaultPageSize`
- 数据库表名、列名：snake_case（`user_projects`、`created_at`）
- 类型声明文件：`*.types.ts`（长文件名）或放在类型文件内（短文件名）
