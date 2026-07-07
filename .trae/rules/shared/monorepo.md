---
alwaysApply: false
description: Monorepo 治理规范，涉及子包创建/依赖管理/构建配置时生效
---

- 新子包在 `packages/` 下创建，包名遵循 `@supabase/{name}` 格式
- 子包 package.json 的 exports 使用 `./src/index.ts` 直接输出源码
- 子包 tsconfig.json 继承根配置，使用 `noEmit` + `allowImportingTsExtensions`
- 所有包的共同依赖通过 pnpm catalog 管理（`pnpm-workspace.yaml`）
- 新增依赖时优先使用 `catalog:` 协议引用已分组的依赖
- 构建依赖链在 `turbo.json` 的 pipeline 中声明
