# Shared Package 骨架

适用：在 `packages/` 下新建可被前后端复用的共享包

## 输出文件

| 文件                | 路径                               |
| ------------------- | ---------------------------------- |
| 包清单              | `packages/{name}/package.json`     |
| TS 配置             | `packages/{name}/tsconfig.json`    |
| 入口文件            | `packages/{name}/src/index.ts`     |
| oxlint 配置（可选） | `packages/{name}/oxlint.config.ts` |

## 骨架内容（package.json）

```json
{
  "name": "@supabase/{name}",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "lint": "oxlint",
    "format": "oxfmt --check .",
    "format:fix": "oxfmt .",
    "check-types": "tsc --noEmit"
  },
  "dependencies": {
    "zod": "catalog:dev"
  },
  "devDependencies": {
    "oxfmt": "catalog:dev",
    "oxlint": "catalog:dev",
    "typescript": "catalog:dev"
  }
}
```

## 骨架内容（tsconfig.json）

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "noEmit": true,
    "allowImportingTsExtensions": true
  },
  "include": ["src"]
}
```

## 骨架内容（入口文件 src/index.ts）

```typescript
// --- 统一出口，按子模块 re-export ---
// export * from './{sub-module}/index.ts';
```

## 填充规则

| 占位     | 替换为                                 |
| -------- | -------------------------------------- |
| `{name}` | 包名（不含 scope），如 `types`、`i18n` |

## 必填项标注

| 项              | 必填 | 说明                                     |
| --------------- | ---- | ---------------------------------------- |
| `name`          | 是   | 统一 `@supabase/{name}` scope            |
| `type`          | 是   | 必须 `"module"`，项目为 ESM              |
| `exports`       | 是   | 显式声明子路径，禁止整包 `import *`      |
| `private`       | 是   | 共享包不单独发布，必须 `true`            |
| `tsconfig` 继承 | 是   | 继承根 `tsconfig.json`，保持编译选项一致 |

## 依赖版本管理

依赖版本统一通过 pnpm catalog 管理，不要在共享包内写死版本：

```json
{
  "dependencies": {
    "zod": "catalog:dev"
  }
}
```

新增 catalog 版本时，在根 `pnpm-workspace.yaml` 的 `catalogs` 中声明。

## 在 apps 中引用

```json
// apps/backend/package.json
{
  "devDependencies": {
    "@supabase/{name}": "workspace:*"
  }
}
```

```typescript
import { something } from "@supabase/{name}";
```

## 后处理

- 在根 `pnpm-workspace.yaml` 的 `packages` 列表中确认 `packages/*` 通配已覆盖（默认已覆盖）
- 运行 `pnpm install` 重新链接 workspace
- 运行 `pnpm --filter @supabase/{name} check-types` 验证类型
- 在 `turbo.json` 的任务pipeline 中确认 `lint` / `format` / `check-types` 已对该包生效
