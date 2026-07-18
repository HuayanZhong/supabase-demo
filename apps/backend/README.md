# backend

NestJS 后端应用，MikroORM + PostgreSQL。

## 技术栈

- **框架：** NestJS v11
- **ORM：** MikroORM + PostgreSQL
- **校验：** `class-validator` + `class-transformer`（`ValidationPipe` 全局启用）
- **Auth：** 和风天气 JWT（Ed25519 签名，`node:crypto`）
- **Swagger：** 统一 `{ code, data, msg }` 响应格式（`@ApiDataResponse` / `@ApiErrorResponse`）
- **缓存：** `lru-cache`（天气数据 30 分钟过期）
- **日志：** `nestjs-pino`

## 关键配置

| 项目         | 值                         | 说明                   |
| ------------ | -------------------------- | ---------------------- |
| 全局路由前缀 | `/api`                     | 所有接口以 `/api` 开头 |
| 端口         | `process.env.PORT ?? 4000` | 默认 4000              |
| 数据库       | `DATABASE_URL` 环境变量    | MikroORM 连接串        |

## 模块结构

```
src/
├── modules/
│   ├── locations/         # 位置管理（CRUD + 和风天气 GeoAPI 搜索）
│   │   ├── dto/           # CreateLocationInputDto / UpdateLocationDto
│   │   ├── entities/      # Location entity
│   │   └── types/         # GeoCityResponse 类型定义
│   ├── weathers/          # 实时天气（LRU 缓存 + 和风天气 API）
│   │   ├── types/         # QWeather 响应类型
│   │   └── vo/            # WeatherVo 视图对象
│   ├── quotes/            # 名言管理（CRUD）
│   │   ├── dto/           # CreateQuoteDto / UpdateQuoteDto
│   │   └── entities/      # Quote entity
│   └── qweather/          # 和风天气基础设施
│       ├── qweather-jwt.service.ts   # JWT 签名（Ed25519，10 分钟过期 + 缓存）
│       └── qweather-api.service.ts   # 通用 HTTP 请求封装（JWT + fetch + 错误处理）
├── common/
│   ├── decorators/
│   │   └── api-data-response.decorator.ts  # @ApiDataResponse / @ApiErrorResponse
│   ├── filters/
│   │   └── all-exceptions.filter.ts  # 全局异常 → { code, data: null, msg }
│   └── interceptors/
│       └── transform.interceptor.ts  # 成功响应 → { code, data, msg }
├── health/                # 健康检查（/api/health）
└── types/
    └── response.ts        # 统一响应类型定义
```

## 响应格式

所有接口响应统一格式：

**成功**（`TransformInterceptor` 包装）：

```json
{ "code": 200, "data": { ... }, "msg": "success" }
```

**异常**（`AllExceptionsFilter` 包装）：

```json
{ "code": 404, "data": null, "msg": "位置不存在" }
```

`code` 值与 HTTP 状态码一致（如 201 Created → `code: 201`）。

## API 端点

| 方法   | 路径                             | 说明                        |
| ------ | -------------------------------- | --------------------------- |
| GET    | `/api/health`                    | 健康检查                    |
| GET    | `/api/locations/search?keyword=` | 搜索城市（和风天气 GeoAPI） |
| POST   | `/api/locations`                 | 通过经纬度创建位置          |
| GET    | `/api/locations`                 | 获取所有位置                |
| GET    | `/api/locations/:id`             | 获取单个位置                |
| PATCH  | `/api/locations/:id`             | 更新位置                    |
| DELETE | `/api/locations/:id`             | 删除位置                    |
| GET    | `/api/weathers?locationId=`      | 获取实时天气                |
| POST   | `/api/quotes`                    | 创建名言                    |
| GET    | `/api/quotes`                    | 获取所有名言                |
| GET    | `/api/quotes/:id`                | 获取单条名言                |
| PATCH  | `/api/quotes/:id`                | 更新名言                    |
| DELETE | `/api/quotes/:id`                | 删除名言                    |

## 环境变量

| 变量                      | 必需 | 说明              |
| ------------------------- | ---- | ----------------- |
| `PORT`                    | 否   | 端口（默认 4000） |
| `DATABASE_URL`            | 是   | PostgreSQL 连接串 |
| `WEATHER_API_HOST`        | 是   | 和风天气 API Host |
| `WEATHER_JWT_PRIVATE_KEY` | 是   | JWT Ed25519 私钥  |
| `WEATHER_JWT_KID`         | 是   | JWT 凭据 ID       |
| `WEATHER_JWT_SUB`         | 是   | JWT 项目 ID       |

## 开发

```bash
pnpm dev          # nest start --watch
pnpm build        # nest build
pnpm check-types  # tsc --noEmit
```
