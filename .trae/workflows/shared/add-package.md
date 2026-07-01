---
description: 新增共享包，由 devops-architect agent 执行
---

# 新增共享包 Workflow

## 触发条件

- 任务类型为 `add-package`（关键词：新建包、新增模块、add package）
- 执行 Agent：`devops-architect`
- 覆盖路径：`packages/{name}/`、`pnpm-workspace.yaml`、`turbo.json`

## 准备工作

### 1. 加载资源

| 资源                            | 说明                              |
| ------------------------------- | --------------------------------- |
| `rules/project-architecture.md` | 项目架构                          |
| `skill/turborepo`               | Monorepo 构建知识                 |
| `pnpm-workspace.yaml`           | 工作空间配置（catalogs 版本管理） |
| `turbo.json`                    | 全局任务编排配置                  |

### 2. 确认包范围

- **包名**：遵循 `@supabase/<name>` 命名约定
- **用途**：该包提供什么能力（类型 / 工具函数 / 配置等）
- **消费者**：哪些 app 或 package 将依赖该包
- **依赖项**：该包需要哪些外部依赖（优先从 catalogs 引用）

## 执行步骤

### Step 1 — 确定包名和作用

- 确认包名符合 `@supabase/<name>` 格式
- 确定包的功能边界和对外接口
- 列出该包的依赖（内部和外部），优先从 `pnpm-workspace.yaml` 的 catalogs 中引用

### Step 2 — 创建包骨架

- 创建 `packages/{name}/` 目录
- 创建 `package.json`：
  - `name`: `@supabase/<name>`
  - `type`: `module`
  - 依赖版本通过 `catalog:` 协议引用（如 `"zod": "catalog:dev"`）
  - 配置好 `exports`、`main`、`types` 字段
- 创建 `tsconfig.json`（参考其他 packages 的配置）
- 创建源码入口文件（如 `src/index.ts`）
- 遵循现有包的文件结构模式

### Step 3 — 注册到工作空间

- 在 `pnpm-workspace.yaml` 中确认 glob 模式 `"packages/*"` 已覆盖新包（通常不需要额外修改）
- 在 `turbo.json` 的 `tasks` 中确认新包所需的 pipeline 已存在；如需要自定义 task，追加配置
- 运行 `pnpm install` 安装依赖并更新 lockfile

### Step 4 — 验证

- 运行 `pnpm --filter <name> check-types` 确认类型检查通过
- 运行 `pnpm --filter <name> build` 确认编译正常
- 在消费方 app 中导入新包，验证导入路径和类型正确
- 运行 `pnpm check-types` 确认全项目类型检查通过
- 运行 `pnpm build` 确认全项目编译通过

## 完成检查

- [ ] `package.json` 配置完整（name、type、exports、main、types、dependencies）
- [ ] `tsconfig.json` 配置正确（参考已有包配置）
- [ ] 依赖版本通过 `catalog:` 协议引用，无硬编码版本号
- [ ] 源码入口文件存在且导出了预期内容
- [ ] `pnpm install` 无报错
- [ ] `pnpm --filter <name> check-types` 通过
- [ ] `pnpm --filter <name> build` 通过
- [ ] `pnpm check-types` 全项目通过
- [ ] `pnpm build` 全项目通过

## 输出

- 新增包摘要：包名、用途、依赖关系
- 文件变更清单：新增了哪些文件，修改了 `turbo.json`（如有）
- 验证结果：install、typecheck、build 结果
