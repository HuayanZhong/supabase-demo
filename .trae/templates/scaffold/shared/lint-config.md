# Lint Config 骨架

适用：新增或调整 oxlint / oxfmt 配置（项目统一使用 oxlint + oxfmt，不使用 prettier/eslint）

## 输出文件

| 内容               | 路径                                 |
| ------------------ | ------------------------------------ |
| app 级 oxlint 配置 | `apps/{app_name}/oxlint.config.ts`   |
| 共享 lint 预设     | `packages/lint-config/src/{name}.ts` |
| 格式化配置         | `.oxfmtrc.json`（项目根）            |

## 骨架内容（app 级 oxlint 配置）

```typescript
import { defineConfig } from "oxlint";
import base from "@supabase/lint-config/base";
// import backend from '@supabase/lint-config/backend';
// import frontend from '@supabase/lint-config/frontend';

export default defineConfig({
  extends: [base /* , backend | frontend */],
  ignorePatterns: ["dist", "node_modules", "coverage" /* , '.nuxt', '.output' */],
});
```

## 骨架内容（共享 lint 预设，新增到 packages/lint-config）

```typescript
// packages/lint-config/src/{name}.ts
import { defineConfig } from 'oxlint';

const {name}Config = defineConfig({
  plugins: [/* 'typescript', 'vue', 'import', 'unicorn' */],
  rules: {
    // 'no-debugger': 'error',
    // 'typescript/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
  env: {
    // node: true,
    // browser: true,
  },
});

export default {name}Config;
```

## 骨架内容（oxfmt 格式化配置）

```json
{
  "ignorePatterns": ["dist", "node_modules", "coverage", ".nuxt", ".output", ".vercel"]
}
```

## 填充规则

| 占位         | 替换为                               |
| ------------ | ------------------------------------ |
| `{app_name}` | `backend` / `frontend`               |
| `{name}`     | 共享预设名，如 `backend`、`frontend` |

## 必填项标注

| 项               | 必填 | 说明                                          |
| ---------------- | ---- | --------------------------------------------- |
| `extends`        | 是   | app 配置必须继承 `@supabase/lint-config/base` |
| `ignorePatterns` | 是   | 至少忽略 `dist`、`node_modules`               |
| `defineConfig`   | 是   | 必须用 oxlint 的 `defineConfig` 包裹          |

## 在 packages/lint-config 中注册新预设

`packages/lint-config/package.json` 的 `exports` 字段添加子路径：

```json
{
  "exports": {
    "./base": "./src/base.ts",
    "./backend": "./src/backend.ts",
    "./frontend": "./src/frontend.ts",
    "./{name}": "./src/{name}.ts"
  }
}
```

## 常用 oxlint 规则参考

| 规则                             | 推荐等级 | 用途                        |
| -------------------------------- | -------- | --------------------------- |
| `no-debugger`                    | `error`  | 禁止遗留 debugger           |
| `typescript/no-unused-vars`      | `warn`   | 未使用变量（忽略 `_` 前缀） |
| `eqeqeq`                         | `error`  | 强制严格相等                |
| `prefer-const`                   | `warn`   | 优先 const                  |
| `typescript/no-extraneous-class` | `warn`   | 后端允许带装饰器的类        |

## 后处理

- 新增预设后，在 `packages/lint-config/package.json` 的 `exports` 注册子路径
- app 配置改动后运行 `pnpm --filter {app_name} lint` 验证
- 格式化改动后运行 `pnpm --filter {app_name} format:fix` 修正
- 项目不使用 prettier / eslint，禁止引入新的格式化工具链
