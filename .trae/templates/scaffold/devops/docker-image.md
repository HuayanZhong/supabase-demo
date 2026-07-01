# Docker 镜像骨架

适用：为 apps 下的应用构建生产镜像（多阶段构建）

## 输出文件

`apps/{app_name}/Dockerfile`

## 骨架内容

```dockerfile
FROM node:24-alpine AS base
RUN corepack enable
WORKDIR /repo

FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/{app_name}/package.json ./apps/{app_name}/
COPY packages/*/package.json ./packages/
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/{app_name}/node_modules ./apps/{app_name}/node_modules
COPY . .
RUN pnpm --filter {app_name} build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /repo/apps/{app_name}/{build_output} ./{build_output}
COPY --from=builder /repo/apps/{app_name}/package.json ./package.json
COPY --from=builder /repo/node_modules ./node_modules
EXPOSE {port}
CMD ["node", "{entry_file}"]
```

## 填充规则

| 占位             | 替换为                                                                      |
| ---------------- | --------------------------------------------------------------------------- |
| `{app_name}`     | workspace 包名，如 `backend`                                                |
| `{build_output}` | 构建产物目录，backend 用 `dist`，frontend 用 `.output`                      |
| `{port}`         | 容器对外端口，如 `3000`                                                     |
| `{entry_file}`   | 启动入口，backend 用 `dist/main.js`，frontend 用 `.output/server/index.mjs` |

## 后处理

- 基础镜像 Node 版本与 `.nvmrc` 一致（当前为 24）
- 在仓库根目录添加 `.dockerignore`，排除 `node_modules`、`dist`、`.output`、`.turbo`、`.git`
- frontend 的构建产物是 `.output`，不是 `dist`，CMD 入口也不同
- 镜像内不要打包 `.env`，敏感配置通过运行时环境变量注入
