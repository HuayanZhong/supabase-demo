# Constraint — 共享包规划硬约束

## 类型约束

- 跨模块共享的类型必须定义在 `packages/types/` 中，不得在 `apps/` 下重复定义
- Zod schema 命名格式 `xxxSchema`，推断类型命名 `Xxx`
- Schema 变更后，必须验证所有引用方是否兼容

## i18n 约束

- 新增翻译 key 必须同步更新全部 4 个语言文件（zh-CN / en / ja / ko）
- 所有新增翻译文件必须导出并在 `packages/i18n/index.ts` 中注册
- 新增语言的 locale code 必须与 `@nuxtjs/i18n` 配置一致
- 不得删除已被代码引用的翻译 key

## Lint 约束

- lint 配置变更后必须在所有 app 中验证（`pnpm lint` 在各目录下执行）
- 不得引入与现有规则冲突的新规则
- 规则变更必须同时更新对应的 rules 文档

## 包结构约束

- 新增共享包必须在 `pnpm-workspace.yaml` 中注册
- 新增包必须配置 `turbo.json` 中的 pipeline

## 范围约束

- 不得修改 `apps/` 下的业务代码
- 类型定义不得包含业务逻辑，只做数据结构描述
