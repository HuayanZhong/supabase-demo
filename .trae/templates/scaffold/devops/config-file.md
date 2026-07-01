# Config File 骨架

适用：新建或修改环境配置文件

## 输出文件

| 场景               | 文件                                                              |
| ------------------ | ----------------------------------------------------------------- |
| 环境变量（项目级） | 项目根 `.env.example`                                             |
| 后端环境变量       | `apps/backend/.env.example`                                       |
| 前端环境变量       | `apps/frontend/.env.example`                                      |
| Nuxt 配置          | `apps/frontend/nuxt.config.ts`（在 `runtimeConfig` 段）           |
| NestJS 配置        | `apps/backend/src/app.module.ts`（通过 `ConfigModule.forRoot()`） |

## .env.example 格式

```env
# {描述}
{VAR_NAME}={示例值}
```

## 填充规则

| 占位         | 替换为                   |
| ------------ | ------------------------ |
| `{VAR_NAME}` | UPPER_SNAKE_CASE 变量名  |
| `{描述}`     | 中文注释说明该变量的用途 |
| `{示例值}`   | 开发环境可用的示例值     |

## 注意事项

- `.env` 文件不得提交到 git，`.env.example` 才是版本控制文件
- `apps/` 下各子包的 `.env` 用于覆盖根配置
- 新增环境变量后需要同时更新 `.env.example` 和部署平台（CI / Vercel 等）的配置
- Nuxt 中环境变量通过 `runtimeConfig.public` 暴露给客户端
