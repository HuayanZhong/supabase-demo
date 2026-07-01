---
alwaysApply: false
description: CI/CD 与部署强制约束
scene: devops
---

# CI/CD 约束

- CI 配置文件必须放在 `.github/workflows/` 目录下
- 每次提交前必须通过 `pnpm check-types` 和 `pnpm lint`
- 禁止将密钥、token、密码硬编码到配置文件中，必须使用 Secrets
