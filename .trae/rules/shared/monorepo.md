---
alwaysApply: false
description: Monorepo 治理规范，涉及子包创建/依赖管理/构建配置时生效
---

- 新子包在 `packages/` 下创建，包名遵循 `@supabase/{name}` 格式
- 子包 package.json 的 exports 使用 `./src/index.ts` 直接输出源码
- 子包 tsconfig.json 继承根配置，使用 `noEmit` + `allowImportingTsExtensions`
- 若子包 exports 指向含 `.ts` 扩展名导入的源码文件，所有直接 consumer（apps 及其他子包）的 tsconfig.json 也必须添加 `allowImportingTsExtensions: true`
- 依赖管理见 `dependencies.md`（使用 pnpm catalog 管理）
- 构建依赖链在 `turbo.json` 的 pipeline 中声明
- turbo.json 最小 pipeline 配置参考已有子包（如 `@supabase/config` 的 `build` → `dependsOn: ["^build"]`）
