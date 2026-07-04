# @supabase/lint-config

Oxlint 规则配置包，按环境拆分、按需组合。

## 包名

`@supabase/lint-config`

## 导出入口

| 路径                             | 用途                        |
| -------------------------------- | --------------------------- |
| `@supabase/lint-config/base`     | 所有项目通用基础规则        |
| `@supabase/lint-config/frontend` | 前端 (Nuxt/Vue) 补充规则    |
| `@supabase/lint-config/backend`  | 后端 (NestJS/Node) 补充规则 |

## 各配置说明

### base（必选）

**插件：** typescript、unicorn、import

**关键规则：**
| 规则 | 级别 | 说明 |
|------|------|------|
| `no-debugger` | error | 禁止 debugger |
| `eqeqeq` | error | 强制全等 `===` |
| `no-var` | error | 禁止 var |
| `typescript/no-unused-vars` | warn | 未使用变量（`_` 前缀参数忽略） |
| `prefer-const` | warn | 优先 const |
| `unicorn/no-array-for-each` | warn | 禁用 forEach |
| `no-console` | off | 允许 console |
| `correctness` | error | 正确性类全部 error |
| `suspicious` / `perf` | warn | 可疑/性能类 warn |

### frontend（前端项目补充）

**插件：** vue

**环境：** browser + node

**全局变量（40+ readonly）：** `definePageMeta`、`defineNuxtConfig`、`useFetch`、`useState`、`navigateTo`、`NuxtLink`、`NuxtPage`、`NuxtLayout` 等 Nuxt 自动导入的全局函数。

用于 `.oxlintrc.json` 或 `oxlint.config.ts`，与 base 配置组合使用：

```json
{
  "extends": ["@supabase/lint-config/base", "@supabase/lint-config/frontend"]
}
```

### backend（后端项目补充）

**环境：** node

**特殊规则：**
| 规则 | 级别 | 说明 |
|------|------|------|
| `typescript/no-extraneous-class` | warn | 允许带装饰器的类（NestJS Service/Controller） |

## 使用方式

前端项目组合 `base` + `frontend`：

```json
{
  "extends": ["@supabase/lint-config/base", "@supabase/lint-config/frontend"]
}
```

后端项目组合 `base` + `backend`：

```json
{
  "extends": ["@supabase/lint-config/base", "@supabase/lint-config/backend"]
}
```
