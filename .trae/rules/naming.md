---
alwaysApply: true
description: 命名规范，全项目通用
---

- 文件名：kebab-case（`user-profile.vue`、`mikro-orm.config.ts`）
- 目录名：kebab-case
- 类名、接口名、类型名：PascalCase（`UserEntity`、`ProjectRepository`）
- 变量名、函数名、方法名：camelCase（`getUserById`、`isLoading`）
- 常量：`UPPER_SNAKE_CASE`（全大写 + 下划线分隔），如 `DEFAULT_PAGE_SIZE`、`MAX_RETRY_COUNT`
- 数据库表名、列名：snake_case（`user_projects`、`created_at`）
- 类型声明文件：`*.types.ts`（长文件名）或放在类型文件内（短文件名）
