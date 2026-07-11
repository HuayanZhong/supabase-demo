---
alwaysApply: false
description: 命名规范，全项目通用
---

- 文件名：kebab-case（`user-profile.vue`、`mikro-orm.config.ts`）
- 目录名：kebab-case
- 类名、接口名、类型名：PascalCase（`UserEntity`、`ProjectRepository`）
- 枚举类型名：PascalCase（`UserRole`），枚举成员名：PascalCase（`Admin`、`Editor`）
- 变量名、函数名、方法名：camelCase（`getUserById`、`isLoading`）
- Vue ref/reactive 变量加 `Ref` 后缀：`userListRef`、`isLoadingRef`
- 常量：`UPPER_SNAKE_CASE`（全大写 + 下划线分隔），如 `DEFAULT_PAGE_SIZE`、`MAX_RETRY_COUNT`
- 数据库表名、列名：snake_case（`user_projects`、`created_at`）
- REST API 路径：kebab-case（`/api/user-profiles`）
- 类型声明文件：多类型时用 `*.types.ts`（如 `user.types.ts`），单个类型直接导出在所在模块文件中
- CSS 自定义类名：kebab-case（`.card-wrapper`、`.section-header`）
- 异常：约定俗成的文件名（`index.ts`、`main.ts`、`app.vue`）不受上述规则约束

## Nuxt 组件自动导入命名

- 组件路径到自动导入名的映射规则：`components/{domain}/{subdomain}/{Name}.vue` → `<{Domain}{Subdomain}{Name}>`
- 示例：`components/business/ai/AiConversationSidebar.vue` → `<BusinessAiConversationSidebar>`
- 示例：`components/business/home/StatGoalChart.vue` → `<BusinessHomeStatGoalChart>`
- **创建新组件时，必须确认自动导入名与现有组件一致的前缀模式**
