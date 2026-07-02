# Constraint — 共享包执行阶段硬约束

## 执行前约束

- 开始执行前，必须先读取对应 `workflows/shared/{task-type}.md`（types / i18n / lint / add-package）了解执行步骤
- 开始执行前，必须先读取 `execution-plan/shared/` 了解规划约束/启发/策略
- 开始执行前，必须先通过 `runtime/router.md` 确认分配的资源（rules、skills、MCP）

## 类型约束

- 跨模块共享的类型必须定义在 `packages/types/` 中，不得在 `apps/` 下重复定义
- Zod schema 必须使用 **Zod v4** API，命名格式 `xxxSchema`，推断类型命名 `Xxx`（`z.infer`）
- Zod schema 和推断类型必须同时导出，不得只导出其一
- Schema 变更后必须运行 `pnpm --filter types check-types` 和 `pnpm check-types` 验证所有引用方兼容性
- 类型定义中不得包含业务逻辑，只做数据结构描述

## i18n 约束

- 新增翻译 key 必须同步更新全部 **4 个语言文件**（zh-CN / en-US / ja-JP / ko-KR），不得遗漏任一语言
- 新增翻译文件必须导出并在 `packages/i18n/src/index.ts` 中注册
- 语言 locale code 必须与 `@nuxtjs/i18n` 配置一致
- 不得删除已被代码引用的翻译 key
- 删除 key 前必须通过 `Grep` 搜索确认所有引用方已移除

## Lint 约束

- lint 配置变更后必须运行 `pnpm lint` 验证通过
- 不得引入与现有规则冲突的新规则
- 规则变更必须同步更新对应的 rules 文档（`packages/lint-config/`）
- 规则变更必须明确注释规则用途和启用原因

## 范围约束

- **不得修改 `apps/` 下的业务代码** — 共享包任务仅限 `packages/` 目录
- 破坏性类型变更（删除字段、改字段类型、合并/拆分 Schema）必须：
  - 在输出中明确标注为 **BREAKING CHANGE**
  - 列出所有受影响的包和应用
  - 同步更新所有引用方代码

## 包结构约束

- 新增共享包必须在 `pnpm-workspace.yaml` 中注册
- 新增包必须配置 `turbo.json` 中的 pipeline
- 新增包名称遵循 `@supabase/<name>` 格式

## 错误处理约束

- 执行中遇到错误时，必须停止当前步骤并记录错误信息
- 阻断性错误（类型错误、语法错误、依赖缺失）必须修复后才能继续
- `pnpm check-types` 失败时不得继续后续步骤
- `pnpm lint` 失败时记录但可继续，完成后统一修复
- 同一错误连续 2 次修复失败时暂停执行并上报
