# 项目配置变更

**对应 Agent：** `devops-architect`

## 触发条件

- 用户要求「修改配置」「调整 nuxt.config」「改 tsconfig」
- 涉及 `turbo.json`、`nuxt.config.ts`、`tsconfig.json`、oxlint 等配置文件
- 新增或修改 packages 下的共享配置包

## 准备工作

- 读取 `turbo.json`（根级任务编排配置）
- 读取目标 app 的配置文件（`nuxt.config.ts`、`tsconfig.json` 等）
- 读取共享配置包 `packages/lint-config/`
- 加载 `execution-plan/devops/`（规划指引：约束/最佳实践/决策策略）
- 加载 `execution-engine/devops/`（执行指引：约束/最佳实践/决策策略）

## 执行步骤

### Step 1: 确认变更范围

判断本次配置变更属于：

| 配置文件                | 位置               | 影响范围        |
| ----------------------- | ------------------ | --------------- |
| `turbo.json`            | 根目录             | 全局构建编排    |
| `tsconfig.json`         | 各 app 和 packages | TypeScript 编译 |
| `nuxt.config.ts`        | `apps/frontend/`   | Nuxt 行为       |
| 各 app `package.json`   | `apps/*/`          | script / deps   |
| `pnpm-workspace.yaml`   | 根目录             | 工作空间配置    |
| `packages/lint-config/` | 共享包             | lint 规则       |
| `.lintstagedrc.json`    | 根目录             | Git hooks 检查  |
| `.nvmrc`                | 根目录             | Node.js 版本    |

### Step 2: 修改配置

遵循原则：

1. **保持现有风格** — 现有配置文件用什么格式、什么缩进、什么命名风格，保持一致
2. **就近原则** — app 级别的配置放在各 app 目录下，共享配置放在 packages 下
3. **不重复声明** — 如果 turbo.json 已定义 build/lint/check-types 任务，各 app 按其 pipeline 执行，不额外声明
4. **catalog 引用** — 依赖版本在 `pnpm-workspace.yaml` 的 catalogs 中统一管理，不在子包 package.json 中写具体版本号

示例 — 修改 `turbo.json` 添加 test 任务：

```json
{
  "tasks": {
    "test": {
      "description": "运行测试",
      "dependsOn": ["^test"],
      "outputs": []
    }
  }
}
```

### Step 3: 验证

根据变更类型运行对应检查：

```bash
# TypeScript 配置变更
pnpm check-types

# Lint 配置变更
pnpm lint

# 构建相关配置变更
pnpm build

# Format 配置变更
pnpm format

# 整体验证（所有 app）
turbo run lint format check-types build
```

关键验证点：

- `nuxt.config.ts` 变更后需运行 `pnpm --filter frontend build` 或 `dev` 确认无启动错误
- `tsconfig.json` 变更后需运行 `pnpm check-types` 确认类型检查通过
- `turbo.json` 变更后需确认所有引用的 task 在各 app 的 `package.json` scripts 中存在

## 完成检查

- [ ] 配置文件语法正确（JSON/YAML/TypeScript 无语法错误）
- [ ] 所有引用的 script 在对应 package.json 中存在
- [ ] `pnpm check-types` 通过
- [ ] `pnpm lint` 通过（如改动 lint 配置）
- [ ] `pnpm build` 通过（如改动构建相关配置）

## 输出

- 修改的配置文件路径及变更摘要
- 验证命令及其结果
