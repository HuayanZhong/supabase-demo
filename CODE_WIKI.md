# Growth OS - Code Wiki

> 一个以 AI 为核心的个人成长操作系统

**版本**: 1.0.0  
**最后更新**: 2026-07-14  
**维护者**: Growth OS Team

---

## 目录

1. [项目概览](#项目概览)
2. [架构设计](#架构设计)
3. [技术栈](#技术栈)
4. [项目结构](#项目结构)
5. [核心模块详解](#核心模块详解)
6. [数据模型](#数据模型)
7. [API 接口](#api-接口)
8. [前端页面与组件](#前端页面与组件)
9. [共享包](#共享包)
10. [开发指南](#开发指南)
11. [部署说明](#部署说明)
12. [附录](#附录)

---

## 项目概览

### 产品愿景

Growth OS 不是聊天机器人，也不是简单的 AI 知识库，而是一个能够围绕用户目标持续提供支持、记录成长过程，并帮助用户不断调整成长路径的智能平台。

**核心理念**: Every Goal Deserves a Growing Companion.

### 核心概念

#### Goal（目标）
任何成长都从一个目标开始。系统不限制目标类型，允许用户围绕任何长期目标建立自己的成长空间。

#### Project（成长空间）
每一个目标对应一个独立的成长空间。Project 是 AI 理解这个目标的上下文容器，包含：
- 对话记录
- 学习资料 / 上传的文档
- 待完成事项
- 阶段总结
- AI 的建议与洞察

#### Growth（成长）
Growth OS 关注的是成长，而不是记录。系统会不断整理用户在 Project 中留下的信息，帮助用户回答：
- 我已经完成了什么？
- 我目前卡在哪里？
- 下一步应该做什么？
- 我的成长速度如何？
- 哪些知识已经掌握？哪些需要重新学习？

### MVP 范围

第一版专注于建立最基础的成长闭环：

```
创建 Project → 开始聊天 → 保存历史记录 → 持续积累上下文 → AI 基于上下文进行回复
```

---

## 架构设计

### 整体架构图

```
┌─────────────────────────────────────────────────────────┐
│                      前端应用层                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Nuxt 4 (Vue 3 + TypeScript)                     │  │
│  │  - 页面路由 (pages/)                              │  │
│  │  - 业务组件 (components/business/)                │  │
│  │  - 组合式函数 (composables/)                      │  │
│  │  - 服务端 API (server/api/)                       │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                      后端应用层                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  NestJS (TypeScript)                             │  │
│  │  - 控制器 (controllers/)                          │  │
│  │  - 服务层 (services/)                             │  │
│  │  - 模块 (modules/)                                │  │
│  │  - 全局过滤器/拦截器                              │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                      数据访问层                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  MikroORM + PostgreSQL                           │  │
│  │  - 实体定义 (entities/)                           │  │
│  │  - 数据迁移 (migrations/)                         │  │
│  │  - 仓储模式 (repositories/)                       │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                      外部服务层                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Supabase                                        │  │
│  │  - 认证 (Auth)                                    │  │
│  │  - 数据库 (PostgreSQL)                            │  │
│  │  - 实时订阅 (Realtime)                            │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Monorepo 架构

项目采用 pnpm workspace + Turborepo 的 monorepo 架构：

```
supabase-demo/
├── apps/                    # 应用层
│   ├── frontend/           # Nuxt 前端应用
│   └── backend/            # NestJS 后端应用
├── packages/               # 共享包
│   ├── config/            # 环境变量配置
│   ├── dal/               # 数据访问层（预留）
│   ├── i18n/              # 国际化资源
│   ├── lint-config/       # Lint 配置
│   ├── tools/             # 工具函数（预留）
│   ├── types/             # 类型定义
│   └── utils/             # 通用工具
└── docs/                  # 文档资源
```

### 依赖管理策略

使用 pnpm catalog 统一管理依赖版本：

- **dev**: 开发工具依赖（TypeScript、Lint 工具等）
- **backend**: 后端专用依赖（NestJS、MikroORM 等）
- **frontend**: 前端专用依赖（Nuxt、Vue、Nuxt UI 等）
- **test**: 测试依赖（Vitest、Playwright 等）
- **logger**: 日志依赖（Pino 等）

---

## 技术栈

### 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **Nuxt** | ^4.4.8 | Vue 3 全栈框架 |
| **Vue** | ^3.5.38 | 响应式 UI 框架 |
| **Nuxt UI** | ^4.9.0 | 基于 Tailwind CSS 的组件库 |
| **Tailwind CSS** | ^4.3.1 | 原子化 CSS 框架 |
| **@nuxtjs/i18n** | ^10.4.0 | 国际化支持 |
| **ECharts** | ^6.1.0 | 图表可视化 |
| **vue-echarts** | ^8.0.1 | ECharts Vue 组件 |
| **@supabase/ssr** | ^0.12.0 | Supabase SSR 集成 |
| **Zod** | ^4.4.3 | 数据校验 |

### 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **NestJS** | ^11.1.27 | Node.js 框架 |
| **MikroORM** | ^7.1.4 | TypeScript ORM |
| **PostgreSQL** | - | 关系型数据库 |
| **nestjs-pino** | ^4.6.1 | 结构化日志 |
| **class-validator** | ^0.15.1 | DTO 校验 |
| **class-transformer** | ^0.5.1 | 对象转换 |
| **dotenv** | ^17.4.2 | 环境变量加载 |

### 工具链

| 工具 | 版本 | 用途 |
|------|------|------|
| **pnpm** | 11.4.0 | 包管理器 |
| **Turborepo** | ^2.9.18 | Monorepo 构建编排 |
| **TypeScript** | ^6.0.3 | 类型系统 |
| **oxlint** | ^1.70.0 | 代码检查 |
| **oxfmt** | ^0.55.0 | 代码格式化 |
| **Husky** | ^9.1.7 | Git Hooks |
| **lint-staged** | ^17.0.7 | 暂存文件检查 |
| **Vitest** | ^4.1.9 | 单元测试 |
| **Playwright** | ^1.61.1 | E2E 测试 |

### 运行环境

- **Node.js**: 24（见 `.nvmrc`）
- **数据库**: PostgreSQL（Supabase 托管）

---

## 项目结构

### 根目录结构

```
supabase-demo/
├── apps/                          # 应用目录
│   ├── frontend/                 # 前端应用
│   └── backend/                  # 后端应用
├── packages/                     # 共享包
│   ├── config/                   # 环境变量配置
│   ├── dal/                      # 数据访问层
│   ├── i18n/                     # 国际化资源
│   ├── lint-config/              # Lint 配置
│   ├── tools/                    # 工具函数
│   ├── types/                    # 类型定义
│   └── utils/                    # 通用工具
├── docs/                         # 文档资源
├── .github/workflows/            # CI/CD 配置
├── .husky/                       # Git Hooks
├── .trae/                        # AI 编码规则
├── turbo.json                    # Turborepo 配置
├── pnpm-workspace.yaml           # pnpm 工作空间配置
├── package.json                  # 根 package.json
├── tsconfig.json                 # TypeScript 根配置
├── oxlintrc.json                 # oxlint 配置
├── .oxfmtrc.json                 # oxfmt 配置
└── README.md                     # 项目说明
```

### 前端应用结构

```
apps/frontend/
├── app/
│   ├── app.vue                   # 根组件
│   ├── assets/
│   │   └── css/
│   │       └── main.css          # 全局样式
│   ├── components/
│   │   ├── business/             # 业务组件
│   │   │   ├── ai/              # AI 相关组件
│   │   │   ├── auth/            # 认证组件
│   │   │   ├── goals/           # 目标管理组件
│   │   │   ├── home/            # 首页组件
│   │   │   ├── learn/           # 学习模块组件
│   │   │   ├── projects/        # 项目空间组件
│   │   │   └── settings/        # 设置组件
│   │   └── common/              # 通用组件
│   ├── composables/             # 组合式函数
│   ├── layouts/                 # 布局组件
│   │   ├── dashboard.vue        # Dashboard 布局
│   │   └── default.vue          # 默认布局
│   ├── middleware/              # 中间件
│   │   └── auth.global.ts       # 全局认证中间件
│   └── pages/                   # 页面路由
│       ├── index.vue            # 登录/注册页
│       ├── verify-email.vue     # 邮箱验证页
│       └── dashboard/           # Dashboard 页面
│           ├── home/
│           ├── goals/
│           ├── projects/
│           ├── learn/
│           ├── ai/
│           └── settings/
├── plugins/
│   └── echarts-passive-patch.client.ts  # ECharts 补丁
├── server/
│   ├── api/
│   │   └── auth/                # 认证 API
│   │       ├── login.post.ts
│   │       ├── register.post.ts
│   │       └── session.get.ts
│   ├── middleware/
│   │   └── log.ts               # 请求日志中间件
│   └── utils/
│       └── useCreateServerSupabase.ts  # 服务端 Supabase 客户端
├── public/                      # 静态资源
├── nuxt.config.ts               # Nuxt 配置
├── package.json
└── tsconfig.json
```

### 后端应用结构

```
apps/backend/
├── src/
│   ├── main.ts                  # 应用入口
│   ├── app.module.ts            # 根模块
│   ├── common/
│   │   ├── filters/
│   │   │   └── all-exceptions.filter.ts  # 全局异常过滤器
│   │   └── interceptors/
│   │       └── transform.interceptor.ts  # 全局响应拦截器
│   ├── config/
│   │   └── pino.ts              # Pino 日志配置
│   ├── modules/                 # 业务模块
│   │   ├── locations/           # 位置模块
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── locations.controller.ts
│   │   │   ├── locations.module.ts
│   │   │   └── locations.service.ts
│   │   ├── quotes/              # 引用模块（预留）
│   │   └── weathers/            # 天气模块
│   │       ├── types/
│   │       ├── vo/
│   │       ├── weathers.controller.ts
│   │       ├── weathers.module.ts
│   │       └── weathers.service.ts
│   └── types/
│       └── request.ts           # 请求类型定义
├── mikro-orm.config.ts          # MikroORM 配置
├── nest-cli.json                # NestJS CLI 配置
├── package.json
└── tsconfig.json
```

---

## 核心模块详解

### 后端核心模块

#### 1. 应用入口 (main.ts)

**文件**: `apps/backend/src/main.ts`

**职责**: 
- 初始化 NestJS 应用
- 配置全局中间件（拦截器、过滤器、管道）
- 设置全局路由前缀
- 启动 HTTP 服务器

**关键配置**:
```typescript
// 全局路由前缀
app.setGlobalPrefix("api");

// 全局响应拦截器
app.useGlobalInterceptors(new TransformInterceptor());

// 全局异常过滤器
app.useGlobalFilters(new AllExceptionsFilter());

// 全局验证管道
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));
```

#### 2. 根模块 (app.module.ts)

**文件**: `apps/backend/src/app.module.ts`

**职责**: 
- 注册所有业务模块
- 配置 MikroORM 数据库连接
- 配置日志系统

**导入模块**:
- `WeathersModule`: 天气服务模块
- `QuotesModule`: 引用服务模块（预留）
- `LocationsModule`: 位置服务模块
- `LoggerModule`: Pino 日志模块
- `MikroOrmModule`: 数据库 ORM 模块

#### 3. 全局异常过滤器 (AllExceptionsFilter)

**文件**: `apps/backend/src/common/filters/all-exceptions.filter.ts`

**职责**: 统一捕获所有异常并返回标准格式错误响应

**响应格式**:
```typescript
{
  code: number,      // HTTP 状态码
  data: null,        // 错误时为 null
  msg: string        // 错误消息
}
```

#### 4. 全局响应拦截器 (TransformInterceptor)

**文件**: `apps/backend/src/common/interceptors/transform.interceptor.ts`

**职责**: 统一包装成功响应为标准格式

**响应格式**:
```typescript
{
  code: 200,         // 固定为 200
  data: T,           // 实际数据
  msg: "success"     // 固定为 "success"
}
```

#### 5. 天气模块 (WeathersModule)

**文件**: `apps/backend/src/modules/weathers/`

**职责**: 提供实时天气查询服务，对接和风天气 API

**核心组件**:

##### WeathersController
- **路由**: `GET /api/weathers?city={city}`
- **方法**: `getWeather(city: string): Promise<WeatherVo>`

##### WeathersService
- **功能**: 
  - 内存缓存（30 分钟 TTL）
  - 调用和风天气 API
  - 数据转换与图标映射
- **关键方法**:
  - `getWeather(city)`: 获取天气（优先缓存）
  - `fetchWeather(city)`: 调用 API
  - `toVo(city, now)`: 数据转换
  - `mapIcon(code)`: 图标映射

##### WeatherVo (视图对象)
```typescript
interface WeatherVo {
  city: string;        // 城市名
  temp: number;        // 当前温度
  tempLow: number;     // 最低温度
  tempHigh: number;    // 最高温度
  condition: string;   // 天气状况
  icon: string;        // 图标名
  humidity: number;    // 湿度
  wind: string;        // 风速描述
  uvIndex: number;     // 紫外线指数
}
```

#### 6. 位置模块 (LocationsModule)

**文件**: `apps/backend/src/modules/locations/`

**职责**: 管理地理位置信息，用于天气查询的位置缓存

**核心组件**:

##### LocationsController
- **路由**: `/api/locations`
- **方法**:
  - `POST /`: 创建位置
  - `GET /`: 获取所有位置
  - `GET /:id`: 获取单个位置
  - `PATCH /:id`: 更新位置
  - `DELETE /:id`: 删除位置

##### LocationsService
- **依赖注入**:
  - `EntityManager`: MikroORM 实体管理器
  - `EntityRepository<Location>`: 位置仓储
- **方法**: CRUD 操作（当前为占位实现）

##### Location Entity
```typescript
@Entity()
class Location {
  @PrimaryKey()
  id: number;

  @Property({ unique: true })
  qweatherId: string;  // 和风天气 LocationID

  @Property()
  name: string;        // 位置名称

  @Property({ type: "decimal", precision: 10, scale: 6 })
  lat: number;         // 纬度

  @Property({ type: "decimal", precision: 10, scale: 6 })
  lon: number;         // 经度

  // ... 其他字段
}
```

#### 7. MikroORM 配置

**文件**: `apps/backend/mikro-orm.config.ts`

**关键配置**:
```typescript
{
  dbName: "postgres",
  clientUrl: process.env.DIRECT_URL || process.env.DATABASE_URL,
  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
  extensions: [Migrator],
  metadataProvider: TsMorphMetadataProvider,
  debug: true,
  schemaGenerator: {
    ignoreSchema: ["auth", "storage", "realtime", ...]
  }
}
```

**说明**:
- 使用 `DIRECT_URL`（session-mode pooler）用于迁移
- 使用 `DATABASE_URL`（transaction-mode pooler）用于运行时
- 忽略 Supabase 系统 schema

---

### 前端核心模块

#### 1. Nuxt 配置 (nuxt.config.ts)

**文件**: `apps/frontend/nuxt.config.ts`

**关键配置**:

```typescript
{
  modules: [
    "@nuxt/ui",           // UI 组件库
    "@nuxt/fonts",        // 字体优化
    "@nuxt/image",        // 图片优化
    "@nuxtjs/i18n",       // 国际化
    "@nuxt/test-utils/module"  // 测试工具
  ],
  
  i18n: {
    locales: ["zh-CN", "en", "ja", "ko"],
    langDir: "../../../packages/i18n/locales/",
    strategy: "no_prefix",
    defaultLocale: "zh-CN"
  },
  
  runtimeConfig: {
    public: {
      supabaseUrl: "",
      supabasePublishableKey: "",
      baseUrl: "http://localhost:3000"
    }
  },
  
  routeRules: {
    "/dashboard/**": { appLayout: "dashboard" }
  }
}
```

#### 2. 根组件 (app.vue)

**文件**: `apps/frontend/app/app.vue`

**职责**: 
- 配置 Nuxt UI 本地化
- 设置全局 Toast 提示时长（1500ms）
- 提供布局容器

**结构**:
```vue
<UApp :locale="locales[locale]" :toaster="{ duration: 1500 }">
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</UApp>
```

#### 3. Dashboard 布局 (dashboard.vue)

**文件**: `apps/frontend/app/layouts/dashboard.vue`

**职责**: 
- 提供 Dashboard 页面统一布局
- 侧边栏导航
- 用户信息显示
- 登出功能

**导航项**:
- Home（首页）
- Goals（目标中心）
- Projects（项目空间）
- Learn（学习与资料）
- AI（AI 对话）
- Settings（设置）

**功能组件**:
- `UDashboardGroup`: 布局容器
- `UDashboardSidebar`: 侧边栏
- `UNavigationMenu`: 导航菜单
- `UUser`: 用户信息展示
- `UColorModeSelect`: 主题切换
- `CommonLocaleSelect`: 语言切换

#### 4. 全局认证中间件 (auth.global.ts)

**文件**: `apps/frontend/app/middleware/auth.global.ts`

**职责**: 全局登录检查，未登录用户重定向到登录页

**逻辑**:
```typescript
// 公开路由放行
if (to.path === "/" || to.path === "/verify-email") {
  return;
}

// 检查认证状态
if (!(await checkAuth())) {
  // 显示 Toast 提示
  // 重定向到登录页
  return navigateTo("/");
}
```

#### 5. 组合式函数 (Composables)

##### useAuth
**文件**: `apps/frontend/app/composables/useAuth.ts`

**职责**: 认证状态管理

**方法**:
- `checkAuth()`: 检查认证状态（SSR 走后端接口，客户端读 cookie）
- `setAuthed()`: 登录成功后刷新 session
- `clearAuth()`: 退出登录

##### useCreateSupabase
**文件**: `apps/frontend/app/composables/useCreateSupabase.ts`

**职责**: 创建浏览器端 Supabase 客户端单例

**特点**:
- 使用 cookie 存储 session
- 单例模式，避免重复创建

##### useProjects
**文件**: `apps/frontend/app/composables/useProjects.ts`

**职责**: 项目数据管理（当前为 mock 数据）

**返回**:
- `projects`: 项目列表
- `currentProject`: 当前项目
- `setCurrentProject(id)`: 切换项目
- `healthMeta`: 健康状态元数据

##### useLearn
**文件**: `apps/frontend/app/composables/useLearn.ts`

**职责**: 学习数据管理（当前为 mock 数据）

**返回**:
- `knowledgeItems`: 知识库条目
- `notes`: 笔记列表
- `bookmarks`: 收藏列表
- `learningRecords`: 学习记录
- `stats`: 统计数据
- `weeklyTrend`: 周趋势数据

##### useAi
**文件**: `apps/frontend/app/composables/useAi.ts`

**职责**: AI 对话状态管理（当前为 mock 数据）

**返回**:
- `messages`: 消息列表
- `status`: 对话状态
- `conversations`: 会话列表
- `sendMessage(text)`: 发送消息
- `startNewConversation()`: 新建会话

##### useChartTheme
**文件**: `apps/frontend/app/composables/useChartTheme.ts`

**职责**: ECharts 图表主题配置

**返回**:
- `isDark`: 是否暗色模式
- `textColor`: 文本颜色
- `gridColor`: 网格颜色
- `areaColorStart/End`: 渐变区域颜色
- `radarAreaColor/LineColor/BorderColor`: 雷达图颜色

#### 6. 服务端 API

##### 登录接口
**文件**: `apps/frontend/server/api/auth/login.post.ts`

**路由**: `POST /api/auth/login`

**请求体**:
```typescript
{
  email: string,
  password: string
}
```

**响应**:
```typescript
// 成功
{
  user: {
    id: string,
    email: string
  }
}

// 失败
{
  error: {
    message: string
  }
}
```

##### 注册接口
**文件**: `apps/frontend/server/api/auth/register.post.ts`

**路由**: `POST /api/auth/register`

**请求体**:
```typescript
{
  email: string,
  password: string
}
```

**响应**: 同登录接口

**特殊配置**: `emailRedirectTo` 指向 `/verify-email`

##### 会话接口
**文件**: `apps/frontend/server/api/auth/session.get.ts`

**路由**: `GET /api/auth/session`

**响应**:
```typescript
{
  user: {
    id: string,
    email: string
  } | null
}
```

##### 服务端 Supabase 客户端
**文件**: `apps/frontend/server/utils/useCreateServerSupabase.ts`

**职责**: 创建服务端 Supabase 客户端，处理 cookie 读写

**特点**:
- 生产环境强制 `secure: true` 和 `sameSite: "strict"`
- 不设置 `httpOnly`（客户端 SDK 需要读写 cookie）

---

## 数据模型

### 认证相关

#### AuthSchema
**文件**: `packages/types/src/auth/index.ts`

```typescript
interface AuthSchema {
  email: string;      // 邮箱（必须合法）
  password: string;   // 密码（至少 8 位）
}
```

### 项目相关

#### Project
**文件**: `packages/types/src/project/index.ts`

```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "archived";
  progress: number;           // 0-100
  health: "healthy" | "warning" | "danger";
  members: number;
  tasks: { done: number; total: number };
  tags: string[];
  icon: string;
  color: "success" | "info" | "warning" | "primary";
  recentActivities: ProjectActivity[];
  milestones: ProjectMilestone[];
  documents: ProjectDocument[];
  taskList: ProjectTask[];
}
```

#### ProjectActivity
```typescript
interface ProjectActivity {
  id: string;
  type: "task_completed" | "comment_added" | "file_uploaded" | "task_created" | "milestone_reached";
  content: string;
  user: string;
  timestamp: string;  // 相对时间描述
}
```

#### ProjectMilestone
```typescript
interface ProjectMilestone {
  id: string;
  name: string;
  description: string;
  deadline: string;
  status: "pending" | "in_progress" | "completed";
}
```

#### ProjectDocument
```typescript
interface ProjectDocument {
  id: string;
  name: string;
  type: "doc" | "sheet" | "figma" | "markdown";
  updatedAt: string;
  updatedBy: string;
}
```

#### ProjectTask
```typescript
interface ProjectTask {
  id: string;
  name: string;
  assignee: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "doing" | "done";
  deadline: string;
}
```

### 学习相关

#### KnowledgeItem
**文件**: `packages/types/src/learn/index.ts`

```typescript
interface KnowledgeItem {
  id: string;
  title: string;
  summary: string;
  category: "frontend" | "backend" | "design" | "devops" | "ai" | "general";
  tags: string[];
  author: string;
  status: "draft" | "published" | "archived";
  viewCount: number;
  updatedAt: string;
}
```

#### Note
```typescript
interface Note {
  id: string;
  title: string;
  content: string;
  category: KnowledgeCategory;
  tags: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}
```

#### Bookmark
```typescript
interface Bookmark {
  id: string;
  title: string;
  url: string;
  description: string;
  source: "internal" | "external" | "github" | "article" | "video";
  tags: string[];
  savedAt: string;
}
```

#### LearningRecord
```typescript
interface LearningRecord {
  id: string;
  topic: string;
  category: KnowledgeCategory;
  duration: number;  // 分钟
  date: string;
  summary: string;
  source: string;
}
```

### 数据库实体

#### Location Entity
**文件**: `apps/backend/src/modules/locations/entities/location.entity.ts`

```typescript
@Entity()
class Location {
  @PrimaryKey()
  id: number;

  @Property({ unique: true })
  qweatherId: string;  // 和风天气 LocationID

  @Property()
  name: string;

  @Property({ type: "decimal", precision: 10, scale: 6 })
  lat: number;

  @Property({ type: "decimal", precision: 10, scale: 6 })
  lon: number;

  @Property({ nullable: true })
  adm2?: string;  // 上级行政区划

  @Property({ nullable: true })
  adm1?: string;  // 一级行政区域

  @Property({ nullable: true })
  country?: string;

  @Property({ nullable: true })
  tz?: string;  // 时区

  @Property({ nullable: true })
  utcOffset?: string;

  @Property({ type: "boolean", default: false })
  isDst?: boolean;  // 是否夏令时

  @Property({ nullable: true })
  type?: string;

  @Property({ type: "smallint", nullable: true })
  rank?: number;

  @Property({ nullable: true })
  fxLink?: string;  // 天气预报链接

  @Property({ onCreate: () => new Date() })
  createdAt: Date;

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date;
}
```

---

## API 接口

### 后端 API

所有接口统一前缀：`/api`

#### 天气接口

##### 获取实时天气
```
GET /api/weathers?city={city}
```

**参数**:
- `city`: 城市名称（如 "武汉"）

**响应**:
```json
{
  "code": 200,
  "data": {
    "city": "武汉",
    "temp": 28,
    "tempLow": 23,
    "tempHigh": 31,
    "condition": "多云",
    "icon": "i-lucide-cloud-sun",
    "humidity": 65,
    "wind": "东南风 12km/h",
    "uvIndex": 0
  },
  "msg": "success"
}
```

**说明**:
- 缓存有效期：30 分钟
- 数据来源：和风天气 API
- 图标映射：lucide 图标库

#### 位置接口

##### 创建位置
```
POST /api/locations
```

**请求体**:
```json
{
  "qweatherId": "101200101",
  "name": "武汉",
  "lat": 30.592849,
  "lon": 114.305542,
  "adm2": "武汉",
  "adm1": "湖北",
  "country": "中国",
  "tz": "Asia/Shanghai",
  "utcOffset": "+08:00",
  "isDst": false,
  "type": "city",
  "rank": 10,
  "fxLink": "https://www.qweather.com/weather/wuhan.html"
}
```

**响应**:
```json
{
  "code": 200,
  "data": "This action adds a new location",
  "msg": "success"
}
```

##### 获取所有位置
```
GET /api/locations
```

**响应**:
```json
{
  "code": 200,
  "data": "This action returns all locations",
  "msg": "success"
}
```

##### 获取单个位置
```
GET /api/locations/:id
```

**响应**:
```json
{
  "code": 200,
  "data": "This action returns a #1 location",
  "msg": "success"
}
```

##### 更新位置
```
PATCH /api/locations/:id
```

**请求体**: 同创建接口（部分字段）

**响应**:
```json
{
  "code": 200,
  "data": "This action updates a #1 location",
  "msg": "success"
}
```

##### 删除位置
```
DELETE /api/locations/:id
```

**响应**:
```json
{
  "code": 200,
  "data": "This action removes a #1 location",
  "msg": "success"
}
```

#### 引用接口（预留）

##### CRUD 操作
```
POST /api/quotes
GET /api/quotes
GET /api/quotes/:id
PATCH /api/quotes/:id
DELETE /api/quotes/:id
```

**说明**: 当前为占位实现，返回固定字符串

### 前端 Server API

#### 认证接口

##### 登录
```
POST /api/auth/login
```

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**成功响应**:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

**失败响应**:
```json
{
  "error": {
    "message": "Invalid login credentials"
  }
}
```

##### 注册
```
POST /api/auth/register
```

**请求体**: 同登录接口

**响应**: 同登录接口

**特殊配置**: 注册后发送验证邮件，重定向到 `/verify-email`

##### 获取会话
```
GET /api/auth/session
```

**响应**:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

或

```json
{
  "user": null
}
```

---

## 前端页面与组件

### 页面路由

| 路径 | 页面 | 布局 | 认证 | 说明 |
|------|------|------|------|------|
| `/` | 登录/注册页 | default | 否 | 首页，未登录用户访问 |
| `/verify-email` | 邮箱验证页 | default | 否 | 注册后邮箱验证成功页 |
| `/dashboard/home` | 首页 | dashboard | 是 | 仪表盘首页 |
| `/dashboard/goals` | 目标中心 | dashboard | 是 | 目标管理页面 |
| `/dashboard/projects` | 项目空间 | dashboard | 是 | 项目管理页面 |
| `/dashboard/learn` | 学习与资料 | dashboard | 是 | 学习模块页面 |
| `/dashboard/ai` | AI 对话 | dashboard | 是 | AI 聊天页面 |
| `/dashboard/settings` | 设置 | dashboard | 是 | 用户设置页面 |

### 业务组件

#### AI 模块 (components/business/ai/)

##### AiChatInput
- **职责**: AI 聊天输入框
- **功能**: 文本输入、发送消息

##### AiConversationSidebar
- **职责**: AI 会话侧边栏
- **功能**: 显示会话列表、切换会话、新建会话

##### AiEmptyState
- **职责**: AI 空状态提示
- **功能**: 无会话时显示欢迎界面和建议问题

##### AiSuggestions
- **职责**: AI 建议展示
- **功能**: 显示快捷问题建议

#### 认证模块 (components/business/auth/)

##### Login
- **职责**: 登录表单
- **功能**: 邮箱密码登录、表单校验、错误提示

##### Register
- **职责**: 注册表单
- **功能**: 邮箱密码注册、表单校验、错误提示

#### 目标模块 (components/business/goals/)

##### GoalListCard
- **职责**: 目标列表卡片
- **功能**: 网格视图展示目标

##### GoalKanbanCard
- **职责**: 目标看板卡片
- **功能**: 看板视图展示目标

##### GoalDailyCheckin
- **职责**: 每日目标签到
- **功能**: 每日打卡、连续天数统计

##### GoalTimeChart
- **职责**: 目标时间图表
- **功能**: 工时分布可视化

#### 首页模块 (components/business/home/)

##### StatGoalChart
- **职责**: 目标统计图表
- **功能**: 目标完成率可视化

##### StatTaskGauge
- **职责**: 任务仪表盘
- **功能**: 任务完成情况仪表盘

##### StatStreakBar
- **职责**: 连续完成条
- **功能**: 连续学习天数展示

##### StatScoreGauge
- **职责**: 分数仪表盘
- **功能**: 综合评分展示

##### TodayPlanCard
- **职责**: 今日计划卡片
- **功能**: 显示今日待完成任务

##### GrowthRadarCard
- **职责**: 增长雷达图卡片
- **功能**: 多维度能力雷达图

##### WorkspaceCard
- **职责**: 工作区卡片
- **功能**: 快速访问常用功能

##### RecentChatsCard
- **职责**: 最近聊天卡片
- **功能**: 显示最近 AI 对话

##### RecentFilesCard
- **职责**: 最近文件卡片
- **功能**: 显示最近访问的文件

##### CalendarWeatherCard
- **职责**: 日历天气卡片
- **功能**: 显示日历和实时天气

#### 学习模块 (components/business/learn/)

##### LearnHeader
- **职责**: 学习模块头部
- **功能**: 标题、标签页导航

##### LearnOverviewTab
- **职责**: 学习概览标签页
- **功能**: 学习统计、趋势图表

##### LearnKnowledgeTab
- **职责**: 知识库标签页
- **功能**: 知识库条目列表、分类筛选

##### LearnNotesTab
- **职责**: 笔记标签页
- **功能**: 笔记列表、置顶标记

##### LearnBookmarksTab
- **职责**: 收藏标签页
- **功能**: 收藏列表、来源分类

##### LearnRecordsTab
- **职责**: 学习记录标签页
- **功能**: 学习记录列表、时长统计

#### 项目模块 (components/business/projects/)

##### ProjectHeader
- **职责**: 项目头部
- **功能**: 项目信息、标签页导航

##### ProjectOverviewTab
- **职责**: 项目概览标签页
- **功能**: 项目基本信息、健康状态

##### ProjectProgressTab
- **职责**: 项目进展标签页
- **功能**: 里程碑时间线

##### ProjectTasksTab
- **职责**: 项目任务标签页
- **功能**: 任务看板、任务列表

##### ProjectDocumentsTab
- **职责**: 项目文档标签页
- **功能**: 文档列表、文件管理

##### ProjectAiInsightsTab
- **职责**: AI 洞察标签页
- **功能**: AI 分析建议

##### ProjectSettingsTab
- **职责**: 项目设置标签页
- **功能**: 项目配置

#### 设置模块 (components/business/settings/)

##### SettingsProfile
- **职责**: 个人资料设置
- **功能**: 头像、昵称、 bio 编辑

##### SettingsAccount
- **职责**: 账户设置
- **功能**: 邮箱、密码、双因素认证

##### SettingsNotifications
- **职责**: 通知设置
- **功能**: 邮件通知、推送通知、周报开关

### 通用组件 (components/common/)

##### LocaleSelect
- **职责**: 语言切换选择器
- **功能**: 支持 zh-CN、en、ja、ko 四种语言

---

## 共享包

### @supabase/config

**路径**: `packages/config/`

**职责**: 环境变量配置与校验

**导出**:

#### 环境变量校验
```typescript
// 校验环境变量
parseEnv(schema, env, opts?)

// 环境变量 schema
envSchema

// 类型定义
type EnvVars
```

#### 辅助函数
```typescript
// 必填字符串
envString()

// 可选字符串
envOptionalString()

// 合法 URL
envUrlString()

// host:port 格式
envHostPortString()

// 正整数
envIntString()

// 非负整数
envNonNegativeIntString()

// 布尔值
envBoolString()
```

#### URL 处理
```typescript
// 标准化 base URL（去除末尾斜杠）
normalizeBaseUrl(url)

// 标准化前缀（确保以 / 开头）
normalizePrefix(prefix)

// 拼接 URL
joinUrl(baseUrl, path)
```

#### 错误类
```typescript
class EnvError extends Error {
  issues: Array<{ path: string; message: string }>;
}
```

**环境变量 Schema**:
```typescript
{
  DATABASE_URL: z.url(),           // PostgreSQL 连接串
  PORT: z.coerce.number().int().positive().default(4000),  // 端口
  SUPABASE_URL: z.url(),           // Supabase 项目地址
  WEATHER_API_KEY: z.string().min(1)  // 和风天气 API Key
}
```

---

### @supabase/types

**路径**: `packages/types/`

**职责**: 跨包共享的 TypeScript 类型定义

**导出**:

#### 认证类型
```typescript
// 认证 schema
authSchema
type AuthSchema
```

#### 项目类型
```typescript
type ActivityType
type ProjectStatus
type ProjectHealth
type ProjectColor
type TaskPriority
type TaskStatus
type DocumentType

interface ProjectActivity
interface ProjectMilestone
interface ProjectDocument
interface ProjectTask
interface Project
```

#### 学习类型
```typescript
type KnowledgeCategory
type KnowledgeStatus
type BookmarkSource
type LearnActivityType

interface KnowledgeItem
interface Note
interface Bookmark
interface LearningRecord
interface LearnActivity
interface CategoryMeta
```

---

### @supabase/i18n

**路径**: `packages/i18n/`

**职责**: 国际化资源管理

**支持语言**:
- zh-CN（简体中文）
- en（English）
- ja（日本語）
- ko（한국어）

**导出**:
```typescript
import { zhCN, en, ja, ko } from "@supabase/i18n";
```

**文件结构**:
```
locales/
├── zh-CN.json
├── en.json
├── ja.json
└── ko.json
```

---

### @supabase/utils

**路径**: `packages/utils/`

**职责**: 通用工具函数

**导出**:

#### 日志工具
```typescript
import { logger } from "@supabase/utils/logger";

logger.info("信息日志");
logger.warn("警告日志");
logger.error("错误日志");
```

**配置**:
- 使用 Pino + pino-pretty
- 支持 `LOG_LEVEL` 环境变量
- 彩色输出、时间格式化

---

### @supabase/lint-config

**路径**: `packages/lint-config/`

**职责**: 统一 Lint 配置

**导出**:

#### 基础配置 (base)
```typescript
import baseConfig from "@supabase/lint-config/base";
```

**规则**:
- 启用 `typescript`、`unicorn`、`import` 插件
- `correctness` 为 error
- `suspicious`、`perf` 为 warn
- 自定义规则：`eqeqeq`、`no-var`、`prefer-const` 等

#### 后端配置 (backend)
```typescript
import backendConfig from "@supabase/lint-config/backend";
```

**特点**:
- 允许 decorator 类
- 启用 Node.js 环境

#### 前端配置 (frontend)
```typescript
import frontendConfig from "@supabase/lint-config/frontend";
```

**特点**:
- 启用 Vue 插件
- 声明 Nuxt 自动导入的全局变量

---

### @supabase/dal

**路径**: `packages/dal/`

**职责**: 数据访问层（预留）

**状态**: 骨架阶段，当前为空导出

**计划**: 未来用于封装数据库访问逻辑

---

### @supabase/tools

**路径**: `packages/tools/`

**职责**: 工具函数集合（预留）

**状态**: 骨架阶段，当前为空导出

**计划**: 未来用于封装通用工具函数

---

## 开发指南

### 环境要求

- **Node.js**: 24（见 `.nvmrc`）
- **pnpm**: 11.4.0
- **PostgreSQL**: 推荐使用 Supabase

### 安装依赖

```bash
pnpm install
```

### 环境变量配置

#### 后端环境变量

在 `apps/backend/` 下创建 `.env` 文件：

```env
# 数据库连接（必填）
DATABASE_URL=postgresql://user:password@host:5432/postgres

# 服务端口（可选，默认 4000）
PORT=4000

# Supabase 配置（前端使用，后端可选）
SUPABASE_URL=https://your-project.supabase.co

# 和风天气 API Key（必填）
WEATHER_API_KEY=your_weather_api_key
```

#### 前端环境变量

通过 `nuxt.config.ts` 的 `runtimeConfig` 注入：

```typescript
runtimeConfig: {
  public: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY,
    baseUrl: process.env.BASE_URL
  }
}
```

### 启动开发服务器

```bash
# 同时启动前后端
pnpm dev

# 仅启动前端（http://localhost:3000）
pnpm --filter frontend dev

# 仅启动后端（http://localhost:4000）
pnpm --filter backend dev
```

### 构建

```bash
# 构建所有应用
pnpm build

# 仅构建前端
pnpm --filter frontend build

# 仅构建后端
pnpm --filter backend build
```

### 代码检查

```bash
# 检查所有应用
pnpm lint
pnpm check-types

# 仅检查前端
pnpm --filter frontend lint
pnpm --filter frontend check-types

# 仅检查后端
pnpm --filter backend lint
pnpm --filter backend check-types
```

### 代码格式化

```bash
# 检查格式
pnpm format

# 自动修复格式
pnpm format:fix
```

### 测试

```bash
# 运行前端测试
pnpm --filter frontend test
```

### 数据库迁移

```bash
# 生成迁移文件
pnpm --filter backend mikro-orm migration:create

# 运行迁移
pnpm --filter backend mikro-orm migration:up

# 回滚迁移
pnpm --filter backend mikro-orm migration:down
```

### Git Hooks

项目使用 Husky + lint-staged 在提交前自动检查代码：

- **pre-commit**: 运行 lint-staged
- **post-commit**: 提交后钩子
- **post-checkout**: 切换分支后钩子

**lint-staged 配置**:
```json
{
  "*.{ts,vue}": ["oxlint", "oxfmt --check"]
}
```

---

## 部署说明

### 后端部署

#### 构建生产版本

```bash
pnpm --filter backend build
```

#### 运行生产版本

```bash
node apps/backend/dist/main.js
```

#### 环境变量

生产环境需要设置以下环境变量：

```env
DATABASE_URL=postgresql://...
PORT=4000
SUPABASE_URL=https://...
WEATHER_API_KEY=...
NODE_ENV=production
```

### 前端部署

#### 构建生产版本

```bash
pnpm --filter frontend build
```

#### 运行生产版本

```bash
node apps/frontend/.output/server/index.mjs
```

#### 环境变量

生产环境需要设置以下环境变量：

```env
SUPABASE_URL=https://...
SUPABASE_PUBLISHABLE_KEY=...
BASE_URL=https://your-domain.com
NODE_ENV=production
```

### Docker 部署（示例）

#### 后端 Dockerfile

```dockerfile
FROM node:24-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@11.4.0 && pnpm install --frozen-lockfile

COPY apps/backend ./apps/backend
COPY packages ./packages

RUN pnpm --filter backend build

EXPOSE 4000

CMD ["node", "apps/backend/dist/main.js"]
```

#### 前端 Dockerfile

```dockerfile
FROM node:24-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@11.4.0 && pnpm install --frozen-lockfile

COPY apps/frontend ./apps/frontend
COPY packages ./packages

RUN pnpm --filter frontend build

EXPOSE 3000

CMD ["node", "apps/frontend/.output/server/index.mjs"]
```

### CI/CD

项目使用 GitHub Actions 进行持续集成：

#### 后端 CI (.github/workflows/ci-backend.yml)

**触发条件**: 
- push 到 main 分支
- PR 到 main 分支
- 修改了 `apps/backend/**`、`packages/**`、`pnpm-lock.yaml`、`turbo.json`

**步骤**:
1. Checkout 代码
2. 安装 pnpm
3. 设置 Node.js
4. 安装依赖
5. Lint 检查
6. 格式检查
7. 类型检查
8. 构建

#### 前端 CI (.github/workflows/ci-frontend.yml)

**触发条件**: 同后端 CI

**步骤**: 同后端 CI

#### 共享包 CI (.github/workflows/ci-packages.yml)

**触发条件**: 
- 修改了 `packages/**`、`pnpm-lock.yaml`、`turbo.json`

**步骤**:
1. Checkout 代码
2. 安装 pnpm
3. 设置 Node.js
4. 安装依赖
5. Lint 检查
6. 格式检查
7. 类型检查

---

## 附录

### 常用命令速查

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建
pnpm build

# 代码检查
pnpm lint
pnpm check-types

# 代码格式化
pnpm format
pnpm format:fix

# 测试
pnpm test

# 数据库迁移
pnpm mikro-orm migration:create
pnpm mikro-orm migration:up
pnpm mikro-orm migration:down
```

### 项目约定

#### 命名规范

- **文件名**: kebab-case（如 `user-profile.vue`）
- **组件名**: PascalCase（如 `UserProfile`）
- **变量/函数**: camelCase（如 `getUserInfo`）
- **常量**: UPPER_SNAKE_CASE（如 `API_BASE_URL`）
- **类型/接口**: PascalCase（如 `UserProfile`）

#### 目录结构

- **业务组件**: `components/business/{domain}/`
- **通用组件**: `components/common/`
- **页面**: `pages/{route}/index.vue`
- **组合式函数**: `composables/use{Name}.ts`
- **模块**: `modules/{domain}/`

#### 代码风格

- 使用 TypeScript 严格模式
- 优先使用组合式 API
- 组件使用 `<script setup lang="ts">`
- 所有文本必须走 i18n，禁止硬编码
- 类型从 `@supabase/types` 导入，不得重复定义

#### Git 提交规范

遵循 Conventional Commits 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**type 类型**:
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具链相关

**示例**:
```
feat(auth): 添加邮箱验证功能

- 实现邮箱验证页面
- 添加验证邮件发送逻辑
- 更新认证中间件

Closes #123
```

### 常见问题

#### 1. 如何添加新的业务模块？

**后端**:
1. 在 `apps/backend/src/modules/` 下创建模块目录
2. 创建 `*.module.ts`、`*.controller.ts`、`*.service.ts`
3. 如需数据库实体，创建 `entities/*.entity.ts`
4. 在 `app.module.ts` 中注册模块

**前端**:
1. 在 `apps/frontend/app/components/business/` 下创建组件目录
2. 在 `apps/frontend/app/pages/dashboard/` 下创建页面
3. 如需状态管理，在 `composables/` 下创建组合式函数
4. 在 `layouts/dashboard.vue` 中添加导航项

#### 2. 如何添加新的环境变量？

1. 在 `packages/config/src/definitions.ts` 中更新 `envSchema`
2. 在 `.env.example` 中添加示例
3. 在需要的地方通过 `process.env.VAR_NAME` 访问

#### 3. 如何添加新的国际化文本？

1. 在 `packages/i18n/locales/` 下更新所有语言文件
2. 在组件中使用 `$t('key')` 或 `useI18n()` 访问

#### 4. 如何添加新的数据库实体？

1. 在模块目录下创建 `entities/*.entity.ts`
2. 使用 MikroORM 装饰器定义实体
3. 在模块的 `*.module.ts` 中通过 `MikroOrmModule.forFeature([Entity])` 注册
4. 生成迁移：`pnpm mikro-orm migration:create`
5. 运行迁移：`pnpm mikro-orm migration:up`

#### 5. 如何处理认证状态？

**前端**:
- 使用 `useAuth()` 组合式函数
- SSR 时走后端接口
- 客户端直接读取 cookie

**后端**:
- 使用 Supabase Auth
- 服务端通过 `useCreateServerSupabase()` 处理 cookie

### 相关链接

- [Nuxt 文档](https://nuxt.com/)
- [NestJS 文档](https://docs.nestjs.com/)
- [MikroORM 文档](https://mikro-orm.io/)
- [Supabase 文档](https://supabase.com/)
- [Nuxt UI 文档](https://ui.nuxt.com/)
- [和风天气 API](https://dev.qweather.com/)
- [Turborepo 文档](https://turbo.build/repo)
- [pnpm 文档](https://pnpm.io/)

---

**文档版本**: 1.0.0  
**最后更新**: 2026-07-14  
**维护者**: Growth OS Team
