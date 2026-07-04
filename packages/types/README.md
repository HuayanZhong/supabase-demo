# @supabase/types

纯类型 + Zod schema 包，为 monorepo 提供共享类型定义。

## 包名

`@supabase/types`

## 导出入口

| 路径                   | 内容             |
| ---------------------- | ---------------- |
| `@supabase/types`      | 所有类型统一入口 |
| `@supabase/types/auth` | 仅认证相关类型   |

## 领域模块

所有类型由 `src/index.ts` 统一 re-export，按子域拆分在 `src/` 下。新增领域直接在 `src/` 下新建目录并在 `index.ts` 中 re-export 即可，本文件无需修改。

## 使用规范

- 使用 `import type { ... } from "@supabase/types"` 导入类型
- 所有组件/页面中涉及项目空间、学习空间的数据类型必须从此包导入，不得重复定义
- auth 类型通常配合 Zod schema 在服务端或表单组件中使用
