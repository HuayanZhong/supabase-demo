# Constraint — 前端执行阶段硬约束

## 执行前约束

- 开始执行前，必须先读取对应 `workflows/frontend/{task-type}.md` 了解执行步骤
- 开始执行前，必须先读取 `execution-plan/frontend/` 了解规划约束/启发/策略
- 开始执行前，必须先通过 `runtime/frontend/router.md` 确认分配的资源（rules、skills、MCP）

## 资源调用约束

- 使用不熟悉的 Nuxt UI 组件前，必须通过 `nuxt-ui MCP → search-components / get-component` 确认 API
- 不确定图标的正确名称时，必须通过 `nuxt-ui MCP → search-icons` 查询，不得猜测
- 涉及 Supabase Auth/DB 问题时，必须通过 `supabase MCP → list_tables / execute_sql` 确认
- 调用 MCP 前必须先通过 Read 读取对应的工具描述文件，确认参数后再调用
- 不得直接调用未在 workflow 资源表中列出的 MCP 或 skill

## 执行过程约束

- 执行必须严格按 `workflows/frontend/{task-type}.md` 的步骤顺序进行，不得跳过
- 每一步完成后必须确认输出是否符合预期，确认后再进入下一步
- 执行过程中发现计划外的文件需要修改时，必须先上报再修改，不得擅自追加
- 涉及创建文件时，必须先确认目标路径是否存在，不存在则先创建目录
- 涉及修改文件时，必须先 Read 当前内容再修改，不得凭记忆重写
- 不得在单个工具调用中写入超过 200 行的文件（应分段写入）

## 验证约束

- 完成文件写入后，必须立即执行 `pnpm check-types` 验证类型
- `pnpm check-types` 失败时，不得继续后续步骤，必须修复类型错误
- 所有步骤完成后，必须依次执行 `pnpm lint` → `pnpm format` 验证代码质量
- 涉及 UI 变更时，必须注明验证方式（开发服务器预览 / 截图检查）

## 错误处理约束

- 执行中遇到错误时，必须停止当前步骤并记录错误信息，不得尝试绕过
- 错误分为两类：
  - **阻断性错误**（类型错误、语法错误、依赖缺失）— 必须修复后才能继续
  - **非阻断性错误**（lint 警告、格式问题）— 记录但可继续，完成后统一修复
- 连续 2 次修复尝试仍失败时，必须暂停执行并上报，不得无限制重试
- 修改必须可回滚（通过 git），破坏性变更前必须执行 `git stash` 或提交当前工作区
