# backend

NestJS 后端应用，MikroORM + PostgreSQL。

## 技术栈

- **框架：** NestJS v11
- **ORM：** MikroORM + PostgreSQL
- **校验：** Zod（由 `@supabase/types` 提供 schema）
- **格式规范：** 所有响应统一包装为 `{ code, data, msg }`

## 关键配置

| 项目         | 值                         | 说明                   |
| ------------ | -------------------------- | ---------------------- |
| 全局路由前缀 | `/api`                     | 所有接口以 `/api` 开头 |
| 端口         | `process.env.PORT ?? 4000` | 默认 4000              |
| 数据库       | `DATABASE_URL` 环境变量    | MikroORM 连接串        |

## 架构约定

- **模块**：按业务域拆分 `src/` 子目录，每个模块包含 `controller` + `service` + `entity`
- **实体**：`*.entity.ts` 文件，由 MikroORM 管理迁移
- **响应格式**：成功走 `TransformInterceptor` → `{ code: 200, data, msg: "success" }`；异常走 `AllExceptionsFilter` → `{ code, data: null, msg }`
- **全局装饰器**已启用（`emitDecoratorMetadata`, `experimentalDecorators`）

## 开发

```bash
pnpm dev        # nest start --watch
pnpm build      # nest build
pnpm check-types
```

## 当前状态

项目处于早期阶段。当前仅有 `AppModule` 一个根模块。新增业务直接在 `src/` 下创建子模块目录（参照 NestJS 模块化结构），并在 `AppModule` 中注册即可。
