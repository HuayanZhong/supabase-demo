# supabase-demo

Supabase 全栈 Demo 项目，采用 Monorepo 架构，包含 Nuxt 前端和 NestJS 后端。

## 技术栈

| 层级       | 技术                                    | 版本              |
| ---------- | --------------------------------------- | ----------------- |
| 包管理     | pnpm + pnpm workspace                   | 11.4.0            |
| 构建编排   | Turborepo                               | ^2.9.18           |
| Node.js    | Node.js                                 | 24（见 `.nvmrc`） |
| **前端**   |                                         |                   |
| 框架       | Nuxt                                    | latest            |
| UI 框架    | @nuxt/ui（基于 Tailwind CSS）           | latest            |
| 国际化     | @nuxtjs/i18n + @supabase/i18n（内部包） | latest            |
| 字体       | @nuxt/fonts                             | latest            |
| 图片       | @nuxt/image                             | latest            |
| 样式       | Tailwind CSS                            | latest            |
| 校验       | Zod                                     | ^4.4.3            |
| **后端**   |                                         |                   |
| 框架       | NestJS                                  | ^11.1.27          |
| ORM        | MikroORM（PostgreSQL）                  | ^7.1.4            |
| 数据库     | PostgreSQL（Supabase 托管）             | -                 |
| **工具链** |                                         |                   |
| 语言       | TypeScript                              | ^6.0.3            |
| Lint       | oxlint                                  | ^1.70.0           |
| 格式化     | oxfmt + Prettier                        | ^0.55.0           |
| Git Hooks  | Husky + lint-staged                     | ^9 / ^17          |
| CI         | GitHub Actions                          | -                 |

## 项目结构

```
supabase-demo/
├── apps/
│   ├── frontend/                # Nuxt 前端应用
│   │   ├── app/
│   │   │   ├── app.vue          # 根组件
│   │   │   ├── assets/css/      # 全局样式
│   │   │   ├── components/      # 通用组件
│   │   │   │   └── common/
│   │   │   │       └── LocaleSelect.vue  # 语言切换组件
│   │   │   └── pages/           # 页面路由
│   │   │       └── index.vue
│   │   ├── nuxt.config.ts       # Nuxt 配置
│   │   ├── oxlint.config.ts     # 前端 oxlint 配置
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── backend/                 # NestJS 后端应用
│       ├── src/
│       │   ├── main.ts          # 入口文件（端口 4000）
│       │   ├── app.module.ts    # 根模块
│       │   ├── app.controller.ts
│       │   ├── app.service.ts
│       │   ├── types/           # 类型定义
│       │   │   └── request.ts
│       │   └── common/
│       │       ├── filters/     # 全局异常过滤器
│       │       │   └── all-exceptions.filter.ts
│       │       └── interceptors/ # 全局响应拦截器
│       │           └── transform.interceptor.ts
│       ├── mikro-orm.config.ts  # MikroORM 配置（PostgreSQL）
│       ├── nest-cli.json
│       ├── oxlint.config.ts     # 后端 oxlint 配置
│       ├── package.json
│       ├── tsconfig.json
│       └── tsconfig.build.json
│
├── packages/
│   ├── i18n/                    # 共享国际化包 @supabase/i18n
│   │   ├── src/index.ts         # 导出入口（含 langDir）
│   │   ├── locales/             # 翻译文件
│   │   │   ├── zh-CN.json       # 简体中文
│   │   │   ├── en.json          # English
│   │   │   ├── ja.json          # 日本語
│   │   │   └── ko.json          # 한국어
│   │   └── package.json
│   │
│   └── lint-config/             # 共享 lint 配置 @supabase/lint-config
│       └── src/
│           ├── base.ts          # 基础规则
│           ├── frontend.ts      # 前端扩展规则
│           └── backend.ts       # 后端扩展规则
│
├── .github/workflows/ci.yml     # CI 流水线（lint → typecheck → build）
├── .husky/                      # Git hooks
│   ├── pre-commit               # lint-staged（格式化 + lint）
│   ├── post-commit              # 提交后钩子
│   └── post-checkout            # checkout 后钩子
├── .trae/rules/                 # AI 编码规则
├── turbo.json                   # Turborepo 任务配置
├── pnpm-workspace.yaml          # pnpm 工作空间 + 版本 catalog
├── pnpm-lock.yaml
├── package.json                 # 根 package.json（全局 scripts）
├── tsconfig.json                # 根 TypeScript 配置
├── .oxfmtrc.json                # oxfmt 格式化配置
├── .lintstagedrc.json           # lint-staged 配置
├── .nvmrc                       # Node.js 版本锁定（24）
├── .gitignore
└── skills-lock.json             # AI skills 锁文件
```

## 快速开始

### 环境要求

- Node.js 24
- pnpm 11.4.0
- PostgreSQL 数据库（推荐使用 Supabase）

### 安装依赖

```bash
pnpm install
```

### 配置环境变量

在 `apps/backend/` 下创建 `.env` 文件，配置数据库连接：

```env
DATABASE_URL=postgresql://user:password@host:5432/postgres
```

### 启动开发服务器

```bash
# 同时启动前后端
pnpm dev

# 仅启动前端（默认 http://localhost:3000）
pnpm --filter frontend dev

# 仅启动后端（默认 http://localhost:4000）
pnpm --filter backend dev
```

### 构建

```bash
pnpm build
```

### 代码检查

```bash
# 运行 lint
pnpm lint

# 类型检查
pnpm check-types
```

## 后端 API 约定

- 所有路由统一前缀 `/api`
- 响应格式经 `TransformInterceptor` 统一包装
- 异常经 `AllExceptionsFilter` 统一捕获处理
- ORM 使用 MikroORM，实体文件遵循 `*.entity.ts` 命名
- 数据库迁移通过 MikroORM Migrator 管理

## 前端 i18n

项目支持 4 种语言：简体中文（zh-CN）、English（en）、日本語（ja）、한국어（ko）。翻译文件集中在 `packages/i18n/locales/` 目录，前端通过 `@nuxtjs/i18n` 模块加载。

## CI 流水线

推送到 `main` 分支或发起 PR 时，GitHub Actions 自动运行：

1. **Lint** — oxlint 检查所有包
2. **Type Check** — TypeScript 类型检查
3. **Build** — 构建前后端产物
