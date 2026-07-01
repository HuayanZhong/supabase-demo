# CI/CD 流程配置

**对应 Agent：** `devops-architect`

## 触发条件

- 用户要求「配置 CI/CD」「修改 GitHub Actions」「调整构建流程」等
- 分析或修改 `.github/workflows/` 下的 YAML 文件

## 准备工作

- 加载 Skill：`turborepo`（任务编排规则）
- 读取 `turbo.json`（确认 build/lint/check-types/format 任务定义）
- 读取 `.github/workflows/` 下现有的 YAML 文件（了解当前 CI 结构）

## 执行步骤

### Step 1: 分析 CI 需求

确定本次改动需要包含的阶段和顺序，当前项目 CI 已覆盖：

| 阶段        | 命令                              | 说明                      |
| ----------- | --------------------------------- | ------------------------- |
| lint        | `pnpm --filter <app> lint`        | oxlint 代码规范检查       |
| format      | `pnpm --filter <app> format`      | oxfmt 格式检查            |
| check-types | `pnpm --filter <app> check-types` | TypeScript 类型检查       |
| build       | `pnpm --filter <app> build`       | 编译打包（由 turbo 编排） |

按需求决定：

- 是否是新增 workflow 还是修改已有 workflow
- 是否需要新增阶段（如 test、deploy、security scan）
- 触发条件是否需要调整（push/pull_request、path filters、branches）

### Step 2: 修改/创建 workflow YAML

参考现有模板（`ci-frontend.yml`），按以下模式编写：

```yaml
name: CI <AppName>

on:
  push:
    branches: [main]
    paths:
      - "apps/<app>/**"
      - "packages/**"
      - "pnpm-lock.yaml"
      - "turbo.json"
  pull_request:
    branches: [main]
    paths:
      - "apps/<app>/**"
      - "packages/**"
      - "pnpm-lock.yaml"
      - "turbo.json"

jobs:
  <app>:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v6
      - uses: pnpm/action-setup@v6
        with:
          version: 11.4.0
      - uses: actions/setup-node@v6
        with:
          node-version-file: ".nvmrc"
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter <app> lint
      - run: pnpm --filter <app> format
      - run: pnpm --filter <app> check-types
      - run: pnpm --filter <app> build
```

注意点：

- pnpm 版本固定为 `11.4.0`（与 `package.json` 中 `packageManager` 一致）
- Node.js 版本通过 `.nvmrc` 文件读取
- 使用 `--frozen-lockfile` 确保 lockfile 一致性
- path filters 要覆盖 app 目录 + 共享包 + 根级配置

### Step 3: 验证

- 确认 YAML 语法正确（不缩进错误、不混用 tab/space）
- 确认所有引用的 script 在各 app 的 `package.json` 中真实存在
- 确认触发条件（`on.*.paths`）覆盖了必要文件变更
- 确认不触发不必要的 job（如 frontend 变更不应触发 backend job）

### Step 4: 建议手动触发一次验证

推送分支后，在 GitHub 仓库 `Actions` 标签页观察 workflow 是否触发、各步骤是否通过。

## 完成检查

- [ ] workflow YAML 语法正确
- [ ] 各 step 引用的 script 存在
- [ ] 触发条件合理、覆盖面适当
- [ ] 不触发无关 job（path filter 正确）

## 输出

- 修改或新建的 `.github/workflows/*.yml` 文件
- 如新增 workflow，在 PR description 或 commit message 中注明触发条件和行为
