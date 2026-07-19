# Growth OS

一个以 AI 为核心的个人成长操作系统。

Growth OS 不是聊天机器人，也不是简单的 AI 知识库，而是一个能够围绕用户目标持续提供支持、记录成长过程，并帮助用户不断调整成长路径的智能平台。

**Every Goal Deserves a Growing Companion.**

## 产品愿景

传统 AI 产品擅长回答问题，但不会真正理解一个人的长期目标和成长过程。每一次对话都是新的开始，缺乏持续的上下文。

Growth OS 要解决的是：**如何让 AI 从"回答问题"升级为"陪伴成长"。**

### 为什么需要 Growth OS

现实中每个人都会制定目标：想成为前端工程师、想学习视频剪辑、想准备考试、想完成创业项目、想培养阅读习惯。

但这些目标通常都会遇到同样的问题：

- 学了一段时间，不知道自己学到了什么
- 遇到瓶颈，却不知道问题出在哪里
- 学习内容越来越多，却没有形成自己的知识体系
- 制定了计划，但无法长期坚持
- AI 每次都要重新介绍自己的背景

## 核心概念

Growth OS 围绕三个核心对象展开：

### Goal（目标）

任何成长都从一个目标开始。系统不限制目标类型，允许用户围绕任何长期目标建立自己的成长空间。

例如：成为 AI 工程师、学会 Premiere、完成一个产品、通过英语六级、减重 10 公斤。

### Project（成长空间）

每一个目标对应一个独立的成长空间。Project 是 AI 理解这个目标的上下文容器，包含：

- 对话记录
- 学习资料 / 上传的文档
- 待完成事项
- 阶段总结
- AI 的建议与洞察

```
📁 AI 工程师成长
    ├── 对话
    ├── 学习资料
    ├── 每日总结
    ├── Todo
    └── AI Insights

📁 剪辑学习
📁 创业项目
📁 英语学习
```

每一个 Project 都拥有独立的上下文，AI 能够基于这个空间持续提供更加精准的建议。

### Growth（成长）

Growth OS 关注的是成长，而不是记录。系统会不断整理用户在 Project 中留下的信息，帮助用户回答：

- 我已经完成了什么？
- 我目前卡在哪里？
- 下一步应该做什么？
- 我的成长速度如何？
- 哪些知识已经掌握？哪些需要重新学习？

## 典型使用流程

假设用户希望学习 NestJS：

1. **创建 Project** — "Nest 学习"
2. **与 AI 交流** — 提问学习中遇到的问题
3. **上传资料** — 官方文档、教程
4. **记录笔记** — 保存学习心得和思考
5. **制定计划** — 设定阶段性目标

随着使用时间增加，Project 会不断积累上下文。今天学习 Module，明天学习 Provider，后天上传文档，几天后记录总结——所有这些内容都成为 AI 理解用户学习状态的依据。

未来再次提问时，AI 不需要重新了解背景，而是结合整个学习过程给出更符合当前阶段的建议。

## 产品特点

### 长期上下文

不仅关注当前一次对话，而是关注整个目标的发展过程。AI 能够结合历史记录、资料和当前状态，持续提供连贯的帮助。

### 成长记录

用户的成长过程被自然沉淀，可以回顾学习路线、完成情况、阶段总结、思考过程。不再依赖手动整理，在日常使用中逐渐形成。

### AI 洞察

相比传统聊天机器人，Growth OS 更强调 AI 的分析能力：

- 当前目标是否停滞？
- 是否偏离最初计划？
- 哪些知识点出现重复提问？
- 是否应该调整学习路线？

### 可扩展的成长平台

不限于某一种场景，可以服务于：程序员学习、视频剪辑、英语学习、考试备考、创业项目、个人习惯养成。任何需要长期积累的目标，都可以通过 Growth OS 建立属于自己的成长空间。

## MVP 范围

第一版专注于建立最基础的成长闭环：

```
创建 Project → 开始聊天 → 保存历史记录 → 持续积累上下文 → AI 基于上下文进行回复
```

验证两个核心问题：

1. Project 是否能够成为用户长期成长的容器？
2. AI 是否能够随着 Project 的积累提供越来越有价值的帮助？

后续迭代方向：知识库、成长分析、自动观察、智能规划。

---

## 技术栈

| 层级       | 技术                                  | 版本     | 备注                         |
| ---------- | ------------------------------------- | -------- | ---------------------------- |
| **核心**   |                                       |          |                              |
| 包管理     | pnpm + workspace                      | 11.4.0   | Turborepo 编排               |
| 构建编排   | Turborepo                             | ^2.9.18  | task pipeline + 缓存         |
| 语言       | TypeScript                            | ^6.0.3   | 全栈类型安全                 |
| 运行时     | Node.js                               | 24       | 见 `.nvmrc`                  |
| **前端**   |                                       |          |                              |
| 框架       | Nuxt                                  | ^4.4.8   | SSR + 文件路由               |
| UI 框架    | @nuxt/ui                              | ^4.9.0   | Tailwind CSS v4 驱动         |
| 国际化     | @nuxtjs/i18n                          | ^10.4.0  | 4 语言（zh-CN/en/ja/ko）     |
| 图表       | vue-echarts + echarts                 | —        | 数据可视化                   |
| 字体       | @nuxt/fonts                           | ^0.14.0  | Public Sans + JetBrains Mono |
| 图片       | @nuxt/image                           | ^2.0.0   | 自动优化                     |
| 样式       | Tailwind CSS                          | ^4.3.1   | 工具类优先                   |
| 状态/校验  | Zod + Vue                             | ^4.4.3   | 运行时校验                   |
| **后端**   |                                       |          |                              |
| 框架       | NestJS                                | ^11.1.27 | Controller/Service/Module    |
| ORM        | MikroORM                              | ^7.1.4   | PostgreSQL + 迁移 + Seeder   |
| 数据库     | PostgreSQL（Supabase 托管）           | —        | 关系型数据库                 |
| 认证       | @supabase/supabase-js                 | —        | JWT + 全局 Guard             |
| 缓存       | @nestjs/cache-manager + cache-manager | —        | 模块级 TTL 缓存              |
| 限流       | @nestjs/throttler                     | —        | 全局 + 接口级                |
| API 文档   | @nestjs/swagger                       | —        | OpenAPI 自动生成             |
| 配置       | @nestjs/config + dotenv               | —        | 环境变量管理                 |
| 日志       | nestjs-pino + pino                    | —        | 结构化日志 + 请求追踪        |
| 安全       | helmet                                | —        | HTTP 头加固                  |
| 校验       | class-validator + class-transformer   | —        | DTO 校验                     |
| 数据填充   | @faker-js/faker                       | —        | 测试数据生成                 |
| **测试**   |                                       |          |                              |
| 单元测试   | Vitest                                | —        | 前端 + 后端                  |
| E2E 测试   | @nestjs/testing + supertest           | —        | 后端接口测试                 |
| UI 测试    | @nuxt/test-utils + @vue/test-utils    | —        | 前端组件测试                 |
| 浏览器     | playwright-core                       | —        | 端到端 UI 测试               |
| **工具链** |                                       |          |                              |
| Lint       | oxlint                                | ^1.70.0  | Rust 编写的 linter           |
| 格式化     | oxfmt + Prettier                      | ^0.55.0  | 代码格式化                   |
| Git Hooks  | Husky + lint-staged                   | —        | 提交前自动检查               |
| CI/CD      | GitHub Actions                        | —        | 3 条流水线                   |

## 项目结构

```
supabase-demo/
│
├── apps/
│   ├── frontend/                    # Nuxt 前端应用
│   │   ├── app/
│   │   │   ├── app.vue              # 根组件
│   │   │   ├── assets/css/          # 全局样式
│   │   │   ├── components/          # 通用组件
│   │   │   │   ├── business/auth/   # 认证相关（Login / Register）
│   │   │   │   └── common/          # 公共组件（LocaleSelect 等）
│   │   │   ├── composables/         # 组合式函数
│   │   │   ├── layouts/             # 布局（default / dashboard）
│   │   │   └── pages/               # 页面路由
│   │   │       ├── index.vue        # 首页（登录/注册）
│   │   │       └── home/            # 后台首页
│   │   ├── server/                  # 服务端 API
│   │   │   ├── api/auth/            # 认证接口（login / register）
│   │   │   ├── middleware/          # 中间件
│   │   │   └── utils/               # 服务端工具函数
│   │   └── nuxt.config.ts
│   │
│   └── backend/                     # NestJS 后端应用
│       ├── src/
│       │   ├── main.ts              # 入口文件
│       │   ├── app.module.ts        # 根模块
│       │   ├── common/              # 公共层（与业务无关的基础设施抽象）
│       │   │   ├── decorators/      # @ApiDataResponse, @Public 等
│       │   │   ├── filters/         # AllExceptionsFilter 全局异常捕获
│       │   │   └── interceptors/    # TransformInterceptor 统一响应包装
│       │   ├── infra/               # 基础设施层（外部依赖的具体实现）
│       │   │   ├── api-clients/     # 第三方 API 客户端
│       │   │   │   └── qweather/    # JWT 认证 + 天气/地理 API 封装
│       │   │   ├── config/          # 配置管理（Pino 日志等）
│       │   │   └── database/        # 数据库
│       │   │       ├── supabase/    # Supabase 客户端 + Guard + Auth 接口
│       │   │       └── seeders/     # 数据填充（LocationFactory）
│       │   ├── modules/             # 业务模块（按领域拆分）
│       │   │   ├── health/          # 健康检查（VERSION_NEUTRAL）
│       │   │   ├── locations/       # 位置管理 CRUD
│       │   │   ├── quotes/          # 每日一言
│       │   │   └── weathers/        # 天气查询（缓存 + 限流）
│       │   └── shared/              # 共享类型
│       │       └── types/           # Response<T> 等通用类型
│       │
│       ├── mikro-orm.config.ts      # MikroORM 配置
│       ├── nest-cli.json
│       └── tsconfig.json
│
├── packages/                        # 共享包
│   ├── i18n/                        # @supabase/i18n（zh-CN / en / ja / ko）
│   │   ├── src/index.ts
│   │   └── locales/
│   ├── types/                       # @supabase/types（Zod schema）
│   │   └── src/auth/
│   └── lint-config/                 # @supabase/lint-config（oxlint + prettier）
│
├── .trae/                           # AI 治理框架
│   ├── rules/                       # 编码规则（40+ 文件，按领域分层）
│   │   ├── agent/                   #   Agent 职责、路由、安全、质量门禁
│   │   ├── backend/                 #   NestJS / MikroORM / 错误处理 / 日志
│   │   ├── frontend/                #   Nuxt / i18n / 组件 / ECharts / a11y
│   │   ├── shared/                  #   Monorepo / 依赖 / env 变量
│   │   ├── quality/                 #   测试 / 安全审计
│   │   └── tool/                    #   MCP 工具使用规范
│   ├── hooks/                       # PowerShell 钩子脚本
│   ├── hooks.json                   # 钩子生命周期绑定
│   ├── agents/                      # Subagent 定义（6 个：api-tester、审计等）
│   │   └── logs/                    # Subagent 调用日志
│   ├── skills/                      # Skills junction（17 个，指向 .agents/skills/）
│   ├── commands/                    # 自定义指令（retro / audit）
│   ├── snapshots/                   # 报告存档
│   │   ├── retro/                   #   协作复盘报告
│   │   └── audit/                   #   架构审计报告
│   └── templates/                   # 代码模板
│
├── .env.example                     # 环境变量模板
├── .github/workflows/               # CI 流水线（ci-frontend / ci-backend / ci-packages）
├── .husky/                          # Git hooks（lint-staged 自动检查）
├── turbo.json                       # Turborepo 任务编排
├── pnpm-workspace.yaml              # pnpm 工作空间 + 版本 catalog
└── package.json                     # 根 package.json
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

完整环境变量列表见 `.env.example`。在 `apps/backend/` 下创建 `.env` 文件：

```env
DATABASE_URL=postgresql://user:password@host:5432/postgres
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
WEATHER_API_HOST=your-api-host.qweatherapi.com
WEATHER_JWT_PRIVATE_KEY=your-ed25519-private-key-pem
WEATHER_JWT_KID=your-credential-id
WEATHER_JWT_SUB=your-project-id
```

前端 Supabase 配置通过 `NUXT_PUBLIC_` 前缀的环境变量注入 `runtimeConfig`。

### 启动开发服务器

```bash
# 同时启动前后端
pnpm dev

# 仅启动前端（http://localhost:3000）
pnpm --filter frontend dev

# 仅启动后端
pnpm --filter backend dev
```

### 构建

```bash
pnpm build
```

### 代码检查

```bash
pnpm lint
pnpm check-types
```

## 后端 API 约定

- 所有路由统一前缀 `/api/v1`（健康检查例外，使用 `VERSION_NEUTRAL`）
- 响应格式经 `TransformInterceptor` 统一包装为 `{ code, data, msg }`
- 成功响应使用 `@ApiDataResponse` 装饰器生成 Swagger schema
- 错误响应使用 `@ApiErrorResponse` 或 `@ApiErrorResponses` 装饰器
- 异常经 `AllExceptionsFilter` 统一捕获处理（含 429 限流日志）
- 认证使用 Supabase JWT，通过全局 `SupabaseGuard` 保护，公开接口用 `@Public()` 跳过
- 限流使用 `@nestjs/throttler`，接口级别通过 `@Throttle()` 自定义
- ORM 使用 MikroORM，实体文件遵循 `*.entity.ts` 命名

## 后端架构

采用 **四层架构**，依赖方向严格单向：

```
modules（业务） → infra（基础设施） → common（公共抽象）
   ↓
shared（共享类型，不依赖任何层）
```

| 层         | 职责                                           | 示例                                                              |
| ---------- | ---------------------------------------------- | ----------------------------------------------------------------- |
| `common/`  | 与业务无关的公共抽象（装饰器、过滤器、拦截器） | `@ApiDataResponse`、`AllExceptionsFilter`、`TransformInterceptor` |
| `infra/`   | 外部依赖的具体实现（API 客户端、数据库、配置） | QWeather API 客户端、Supabase Guard、Pino 配置                    |
| `modules/` | 按领域拆分的业务模块                           | locations、weathers、quotes、health                               |
| `shared/`  | 纯类型定义，不依赖任何其他层                   | `Response<T>`、DTO 基类                                           |

### 模块规范

- 每个业务模块遵循 NestJS 标准结构：`controller` + `service` + `module` + `entities/` + `dto/`
- Service 层使用 `Repository` 模式操作数据库
- 依赖注入严格限制在 `module` 的 `imports` 中声明
- 所有服务文件必须包含类型声明和注释

## AI 治理

项目通过 `.trae/` 目录下的治理框架约束 AI 协作行为：

- **40+ 编码规则**：按领域分层（agent / backend / frontend / shared / quality），挂钩子自动注入
- **6 个 Subagent**：api-tester、architecture-doctor、security-auditor、migration-reviewer、test-completer、i18n-validator
- **17 个 Skills**：通过 junction 引用 `.agents/skills/`，覆盖 NestJS、Nuxt、MikroORM 等关键技术栈
- **自定义命令**：`/retro`（协作复盘）、`/audit`（架构全量审计）
- **三层门禁**：Skill 检查 → Subagent 选型 → 并行判断，代码改动前自动触发

## 前端架构

采用 **Nuxt 4 目录结构**，按领域拆分配置和页面。

### 页面路由

| 路由                  | 页面                                 | 说明                       |
| --------------------- | ------------------------------------ | -------------------------- |
| `/`                   | `pages/index.vue`                    | 首页（登录/注册）          |
| `/verify-email`       | `pages/verify-email.vue`             | 邮箱验证                   |
| `/dashboard/home`     | `pages/dashboard/home/index.vue`     | 仪表盘首页（卡片概览）     |
| `/dashboard/ai`       | `pages/dashboard/ai/index.vue`       | AI 对话（成长助手）        |
| `/dashboard/goals`    | `pages/dashboard/goals/index.vue`    | 目标管理（看板/列表）      |
| `/dashboard/learn`    | `pages/dashboard/learn/index.vue`    | 学习中心（笔记/书签/知识） |
| `/dashboard/projects` | `pages/dashboard/projects/index.vue` | 项目空间（进展/文档/洞察） |
| `/dashboard/settings` | `pages/dashboard/settings/index.vue` | 个人设置（资料/通知/账号） |

### 布局

- `layouts/default.vue` — 公开页面布局（登录/注册）
- `layouts/dashboard.vue` — 认证后仪表盘布局（侧栏导航 + 主内容区）

### 组件分层

```
components/
├── business/          # 业务组件，按模块分组
│   ├── auth/          # 登录 / 注册表单
│   ├── ai/            # 对话侧栏、聊天输入、建议卡片
│   ├── goals/         # 目标看板卡片、每日打卡、时间图表
│   ├── home/          # 仪表盘卡片（天气/雷达图/得分/打卡/任务）
│   ├── learn/         # 学习概览、笔记、书签、知识图谱
│   ├── projects/      # 项目概览、文档、任务、设置标签页
│   └── settings/      # 个人资料、通知偏好、账号设置
└── common/            # 公共组件
    └── LocaleSelect.vue  # 语言切换器
```

### Composable 数据层

| Composable             | 职责                                  |
| ---------------------- | ------------------------------------- |
| `useAuth.ts`           | Supabase 登录/注册/登出/会话管理      |
| `useAi.ts`             | AI 对话流（历史消息、发送、流式回复） |
| `useProjects.ts`       | 项目 CRUD + 进度管理                  |
| `useLearn.ts`          | 学习记录、笔记、书签、知识整理        |
| `useGoals.ts`          | 目标制定、打卡、阶段总结              |
| `useSettings.ts`       | 个人资料、通知、账号设置              |
| `useChartTheme.ts`     | ECharts 图表主题（响应式配色）        |
| `useCreateSupabase.ts` | Supabase 客户端工厂                   |

### 认证流程

1. 全局 `auth.global.ts` middleware 拦截未认证请求
2. 登录/注册通过 Supabase Auth（邮箱密码）
3. 会话 token 通过 `@supabase/ssr` 持久化到 cookie
4. 登出自定义 `handleLogout()` 清除 cookie 并跳转首页

### 国际化

翻译文件集中在 `packages/i18n/locales/`，前端通过 `@nuxtjs/i18n` 模块加载，支持 4 种语言（zh-CN / en / ja / ko），页面组件使用 `useI18n()` composable 访问。`LocaleSelect.vue` 提供语言切换 UI。
