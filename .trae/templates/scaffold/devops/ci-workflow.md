# CI Workflow 骨架

适用：新建 GitHub Actions CI 工作流

## 输出文件

`.github/workflows/ci-{name}.yml`

## 骨架内容

```yaml
name: CI {Name}

on:
  push:
    branches: [main]
    paths:
      - "apps/{app_name}/**"
      - "packages/**"
      - "pnpm-lock.yaml"
      - "turbo.json"
  pull_request:
    branches: [main]
    paths:
      - "apps/{app_name}/**"
      - "packages/**"
      - "pnpm-lock.yaml"
      - "turbo.json"

jobs:
  { job_name }:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Install pnpm
        uses: pnpm/action-setup@v6
        with:
          version: 11.4.0

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version-file: ".nvmrc"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm --filter {app_name} lint

      - name: Check format
        run: pnpm --filter {app_name} format

      - name: Type check
        run: pnpm --filter {app_name} check-types

      - name: Build
        run: pnpm --filter {app_name} build
```

## 填充规则

| 占位         | 替换为                              |
| ------------ | ----------------------------------- |
| `{Name}`     | 显示名，如 `Frontend`               |
| `{app_name}` | `frontend` / `backend` / `packages` |
| `{job_name}` | kebab-case job ID，如 `frontend`    |

## 后处理

- 确认 `paths` 过滤只触发受影响的 workflow
- 如果 app 需要环境变量，在 repo Settings → Secrets 中配置
