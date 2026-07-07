---
alwaysApply: false
description: 测试规范，涉及编写/运行/审查测试时生效
---

- 前端测试文件放在 `apps/frontend/test/{unit|e2e|nuxt}/` 下
- 测试文件命名：`*.test.ts` 或 `*.spec.ts`
- 单元测试使用 Vitest + `@vue/test-utils`
- E2E 测试使用 Playwright，优先通过 `webapp-testing` Skill 辅助
- 后端测试需要时才创建，使用 NestJS 的 `@nestjs/testing` TestFactory
- 修改逻辑时，同时更新或补充对应模块的测试
