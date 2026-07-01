---
description: 新增或修改共享类型，由 backend-architect agent 执行
---

# 共享类型变更 Workflow

## 触发条件

- 任务类型为 `types`（关键词：类型、Schema、Zod）
- 执行 Agent：`backend-architect`
- 覆盖路径：`packages/types/`

## 准备工作

### 1. 加载资源

| 资源                               | 说明                                          |
| ---------------------------------- | --------------------------------------------- |
| `rules/frontend/frontend-types.md` | 类型定义规范（packages/types 结构、Zod 用法） |
| `rules/frontend/comments.md`       | 注释规范                                      |
| `execution-plan/shared/`           | 规划指引：约束/最佳实践/决策策略              |

### 2. 确认变更范围

- **新增 schema**：哪个模块、什么用途
- **修改 schema**：现有 schema 的字段增删改
- **删除 schema**：废弃的类型定义
- **判断是否为跨模块共享**：是 → 放 `packages/types`；否 → 放应用内局部类型

## 执行步骤

### Step 1 — 确认类型变更范围

- 读取 `packages/types/src/index.ts` 了解现有模块结构
- 读取目标模块（如 `packages/types/src/auth/index.ts`）的现有 schema
- 确认变更不破坏现有引用方的类型兼容性
- 如需新增模块，确认模块名称与功能命名一致

### Step 2 — 修改 packages/types 下对应文件

- 新增/修改 Zod schema 文件（`packages/types/src/<module>/index.ts`）
- 遵循规范：schema 用 `xxxSchema` 命名，类型用 `XxxSchema`（`z.infer`）
- 使用 **Zod v4** API，如有不确定先查 `https://zod.dev/v4`
- 如新增模块，同步创建目录和文件

### Step 3 — 更新引用

- 在 `packages/types/src/index.ts` 中添加/更新 re-export
- 在 `packages/types/package.json` 的 `exports` 中添加/更新子路径映射
- 搜索各 app 中通过 `@supabase/types` 或相对路径引用的旧类型，更新导入路径
- 确认消费方代码与新类型签名兼容

### Step 4 — 验证

- 运行 `pnpm --filter types check-types` 确认类型包自身无问题
- 运行 `pnpm check-types` 确认全项目类型检查通过
- 运行 `pnpm build` 确认全项目编译通过

## 完成检查

- [ ] schema 定义遵循 Zod v4 规范
- [ ] `packages/types/src/index.ts` re-export 已更新
- [ ] `packages/types/package.json` exports 已更新
- [ ] 所有引用方导入路径同步更新
- [ ] `pnpm check-types` 通过
- [ ] `pnpm build` 通过
- [ ] 未引入未使用的 import 或变量

## 输出

- 变更摘要：新增/修改/删除了哪些 schema 和类型
- 文件变更清单：修改了 `packages/types/` 下的哪些文件
- 引用方变更清单：更新了哪些 app 中的导入路径或使用代码
- 验证结果：typecheck 和 build 结果
