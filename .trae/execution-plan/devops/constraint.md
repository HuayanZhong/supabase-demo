# Constraint — DevOps 规划硬约束

## 配置约束

- 不得修改 Git 全局配置（用户名、邮箱等）
- 环境变量变更必须在 `.env.example` 中同步更新说明
- 依赖版本必须在 `pnpm-workspace.yaml` 的 `catalogs` 中统一管理，不得单独改子包的 `package.json`

## CI/CD 约束

- CI 配置变更后必须验证 GitHub Actions 能正常触发
- 不得在 CI 配置中硬编码敏感信息（密钥、token）
- 部署配置变更前必须先确认当前环境的状态

## 安全约束

- 涉及开放端口、跨域配置、权限变更的操作必须在计划中高亮标注
- 不得引入未审计的第三方 Action 或插件
- Docker 镜像不得使用 `latest` 标签

## 范围约束

- 不得修改 `apps/` 下的业务代码
- 不得修改 `packages/` 下的共享包业务逻辑
