# Docker Compose 骨架

适用：本地编排多服务（前端、后端、Postgres、Supabase 等）

## 输出文件

`docker-compose.yml`（项目根目录）

## 骨架内容

```yaml
services:
  # ---------- 后端 ----------
  backend:
    build:
      context: .
      dockerfile: apps/backend/Dockerfile
    container_name: {project}-backend
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - PORT=3000
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - {project}-net
    restart: unless-stopped

  # ---------- 前端 ----------
  frontend:
    build:
      context: .
      dockerfile: apps/frontend/Dockerfile
    container_name: {project}-frontend
    environment:
      - NUXT_PUBLIC_API_BASE=http://backend:3000
    ports:
      - "3001:3000"
    depends_on:
      - backend
    networks:
      - {project}-net
    restart: unless-stopped

  # ---------- 数据库 ----------
  postgres:
    image: postgres:16-alpine
    container_name: {project}-postgres
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - {project}-net
    restart: unless-stopped

# ---------- 数据卷 ----------
volumes:
  postgres-data:

# ---------- 网络 ----------
networks:
  {project}-net:
    driver: bridge
```

## 填充规则

| 占位        | 替换为                       |
| ----------- | ---------------------------- |
| `{project}` | 项目短名，如 `supabase-demo` |

## 必填项标注

| 项            | 必填 | 说明                                    |
| ------------- | ---- | --------------------------------------- |
| `services`    | 是   | 至少包含一个服务                        |
| `volumes`     | 否   | 有状态服务（如 Postgres）必须挂载持久卷 |
| `networks`    | 是   | 服务间通过命名网络通信                  |
| `healthcheck` | 否   | 被依赖的底层服务建议配置健康检查        |
| `depends_on`  | 否   | 声明启动顺序，配合 `condition` 等待就绪 |

## 环境变量

在项目根 `.env` 中提供（不提交到 git），`.env.example` 给出示例：

```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/app
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=app
```

## 常用命令

| 命令                             | 用途             |
| -------------------------------- | ---------------- |
| `docker compose up -d`           | 后台启动全部服务 |
| `docker compose up --build`      | 重新构建并启动   |
| `docker compose down`            | 停止并移除容器   |
| `docker compose logs -f backend` | 跟踪某服务日志   |

## 后处理

- 确认 `.env` 已被 `.gitignore` 忽略，仅提交 `.env.example`
- 容器间通信用服务名（如 `postgres`、`backend`），不要用 `localhost`
- 主机端口与容器端口映射避免与本地已占用端口冲突
- 生产环境不要在 compose 中硬编码密码，改用 secrets 或外部注入
