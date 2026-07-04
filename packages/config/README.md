# @supabase/config

共享配置工具包，提供环境变量解析和 URL 规整等工具函数。

## 包名

`@supabase/config`

## 导出入口

| 路径               | 内容                                         |
| ------------------ | -------------------------------------------- |
| `@supabase/config` | 统一入口，re-export env + normalize 全部导出 |

## 导出函数

### env — 环境变量解析

基于 Zod schema 的类型安全环境变量解析。

| 函数                           | 返回类型            | 说明                                          |
| ------------------------------ | ------------------- | --------------------------------------------- |
| `parseEnv(schema, env, opts?)` | `z.infer<TSchema>`  | 用 Zod schema 解析环境变量，失败抛 `EnvError` |
| `envString()`                  | Zod string          | 必填字符串                                    |
| `envOptionalString()`          | Zod string          | 可选字符串                                    |
| `envUrlString()`               | Zod URL string      | URL 格式校验                                  |
| `envHostPortString()`          | Zod regex           | `host:port` 格式                              |
| `envIntString()`               | Zod coerced int     | 正整数                                        |
| `envNonNegativeIntString()`    | Zod coerced int     | 非负整数                                      |
| `envBoolString()`              | Zod coerced boolean | 布尔值                                        |

### normalize — URL 规整

| 函数                    | 说明                                      |
| ----------------------- | ----------------------------------------- |
| `normalizePrefix(path)` | 标准化路由前缀，确保 `/` 开头、无末尾斜杠 |
| `normalizeBaseUrl(url)` | 标准化基础 URL，移除末尾斜杠              |
| `joinUrl(base, path)`   | 拼接 URL，自动处理斜杠分隔                |

## 使用示例

```ts
import { parseEnv, envString, envUrlString, envIntString } from "@supabase/config";

const schema = z.object({
  DATABASE_URL: envUrlString(),
  PORT: envIntString(),
  API_KEY: envString(),
});

const config = parseEnv(schema, process.env, { label: "backend" });
```

## 使用规范

- 所有函数为纯函数，无副作用
- `parseEnv` 应在应用启动时调用一次，返回值即可作为全局配置对象使用
- 新增 env 解析器函数在 `src/env.ts` 中添加，并在 `src/index.ts` 中 re-export
