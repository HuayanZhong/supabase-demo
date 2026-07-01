# 部署

**对应 Agent：** `devops-architect`

## 触发条件

- 用户要求「部署」「发布」「上线」「打包部署」
- 涉及 Dockerfile、Supabase CLI 部署、Edge Functions 部署

## 准备工作

- 加载 Skill：`turborepo`、`supabase`
- 读取 `turbo.json`（确认 build 任务定义）
- 读取各 app 的 `package.json`（确认 build/prod 命令）
- 检查 `.env` / `.env.example`（确认所需环境变量）
- 加载 `execution-plan/devops/`（规划指引：约束/最佳实践/决策策略）

## 执行步骤

### Step 1: 确认部署目标

判断部署类型：

| 类型                    | 说明                       | 所需工具         |
| ----------------------- | -------------------------- | ---------------- |
| Supabase Edge Functions | 无服务器函数部署           | Supabase CLI     |
| NestJS 后端 (Docker)    | 容器化部署到云平台         | Docker           |
| Nuxt 前端 (SSR/静态)    | SSR 部署或 `nuxt generate` | Node.js / Docker |

当前项目：

- **后端**: NestJS (`apps/backend/`)，构建产物在 `dist/`
- **前端**: Nuxt (`apps/frontend/`)，构建产物在 `.output/`（SSR）或 `dist/`（静态）
- **Supabase 集成**: 通过 `@supabase/supabase-js` + `@supabase/ssr`

### Step 2: 检查环境变量配置

使用 Supabase MCP 确认项目信息：

```bash
# 获取 Supabase 项目 URL 和 publishable keys
get_project_url
get_publishable_keys
```

检查 `.env` 是否包含：

| 变量                        | 用途              |
| --------------------------- | ----------------- |
| `SUPABASE_URL`              | Supabase 项目 URL |
| `SUPABASE_ANON_KEY`         | 匿名 key          |
| `SUPABASE_SERVICE_ROLE_KEY` | 服务角色 key      |
| `DATABASE_URL`              | 数据库连接串      |

> 仅开发环境可写 `.env`，生产环境通过 CI secrets 注入。

### Step 3: 确认构建配置

**后端（NestJS）**：

当前 `turbo.json` 中 `build` 任务已定义，后端通过 `nest build` 构建到 `dist/`。
如需 Docker 部署，需添加 Dockerfile：

```
apps/backend/Dockerfile   （暂无，如需要则创建）
```

**前端（Nuxt）**：

`nuxt build` 构建到 `.output/`，支持 Node.js Server 或静态导出。
如需容器化，同样添加 Dockerfile：

```
apps/frontend/Dockerfile  （暂无，如需要则创建）
```

### Step 4: 执行部署

**方式 A: Supabase CLI 部署 Edge Functions**

```bash
supabase functions deploy <function-name> --project-ref <ref>
```

**方式 B: CI 触发部署**

在 `.github/workflows/` 中添加部署 workflow，main 分支 build 通过后自动部署。
参考模式：

```yaml
name: Deploy

on:
  workflow_run:
    workflows: ["CI Frontend", "CI Backend"]
    types: [completed]
    branches: [main]

jobs:
  deploy:
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      # ... build steps ...
      # ... deploy to target platform ...
```

或使用 Supabase MCP 的部署工具：

```bash
deploy_edge_function <function-name> --file <path>
```

## 完成检查

- [ ] 部署目标明确（Supabase / Docker / 云平台）
- [ ] 环境变量已配置（本地 `.env` 或 CI secrets）
- [ ] 构建产物正确（`dist/` / `.output/`）
- [ ] 部署命令执行成功
- [ ] 验证线上服务可用

## 输出

- 部署后的服务 URL / 项目 ref
- 如新增 Dockerfile，列出文件路径
- 如需 CI 部署，修改 `.github/workflows/*.yml`
