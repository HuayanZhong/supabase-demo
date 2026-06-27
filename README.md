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

| 层级       | 技术                                    | 版本              |
| ---------- | --------------------------------------- | ----------------- |
| 包管理     | pnpm + pnpm workspace                   | 11.4.0            |
| 构建编排   | Turborepo                               | ^2.9.18           |
| Node.js    | Node.js                                 | 24（见 `.nvmrc`） |
| **前端**   |                                         |                   |
| 框架       | Nuxt                                    | ^4.4.8            |
| UI 框架    | @nuxt/ui（基于 Tailwind CSS）           | ^4.9.0            |
| 国际化     | @nuxtjs/i18n + @supabase/i18n（内部包） | ^10.4.0           |
| 字体       | @nuxt/fonts                             | ^0.14.0           |
| 图片       | @nuxt/image                             | ^2.0.0            |
| 样式       | Tailwind CSS                            | ^4.3.1            |
| 校验       | Zod                                     | ^4.4.3            |
| **后端**   |                                         |                   |
| 框架       | NestJS                                  | ^11.1.27          |
| ORM        | MikroORM（PostgreSQL）                  | ^7.1.4            |
| 数据库     | PostgreSQL（Supabase 托管）             | -                 |
| **工具链** |                                         |                   |
| 语言       | TypeScript                              | ^6.0.3            |
| Lint       | oxlint                                  | ^1.70.0           |
| 格式化     | oxfmt + Prettier                        | ^0.55.0           |
| Git Hooks  | Husky + lint-staged                     | -                 |
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
│   │   │   │   ├── business/    # 业务组件
│   │   │   │   │   └── auth/    # 认证相关（Login / Register）
│   │   │   │   └── common/      # 公共组件（LocaleSelect 等）
│   │   │   ├── composables/     # 组合式函数
│   │   │   ├── layouts/         # 布局（default / dashboard）
│   │   │   └── pages/           # 页面路由
│   │   │       ├── index.vue    # 首页（登录/注册）
│   │   │       └── home/        # 后台首页
│   │   ├── server/              # 服务端 API
│   │   │   ├── api/auth/        # 认证接口（login / register）
│   │   │   ├── middleware/      # 中间件
│   │   │   └── utils/           # 服务端工具函数
│   │   └── nuxt.config.ts
│   │
│   └── backend/                 # NestJS 后端应用
│       ├── src/
│       │   ├── main.ts          # 入口文件
│       │   ├── app.module.ts    # 根模块
│       │   ├── common/          # 全局过滤器 / 拦截器
│       │   └── types/           # 类型定义
│       └── mikro-orm.config.ts  # MikroORM 配置
│
├── packages/
│   ├── i18n/                    # 共享国际化包 @supabase/i18n
│   │   ├── src/index.ts
│   │   └── locales/             # zh-CN / en / ja / ko
│   ├── types/                   # 共享类型包 @supabase/types
│   │   └── src/auth/            # 认证相关 Zod schema
│   └── lint-config/             # 共享 lint 配置 @supabase/lint-config
│
├── .github/workflows/           # CI 流水线（ci-frontend / ci-backend / ci-packages）
├── .husky/                      # Git hooks
├── .trae/rules/                 # AI 编码规则
├── turbo.json                   # Turborepo 任务配置
├── pnpm-workspace.yaml          # pnpm 工作空间 + 版本 catalog
└── package.json
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

在 `apps/backend/` 下创建 `.env` 文件：

```env
DATABASE_URL=postgresql://user:password@host:5432/postgres
```

前端 Supabase 配置通过 `runtimeConfig` 的环境变量注入。

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

- 所有路由统一前缀 `/api`
- 响应格式经 `TransformInterceptor` 统一包装
- 异常经 `AllExceptionsFilter` 统一捕获处理
- ORM 使用 MikroORM，实体文件遵循 `*.entity.ts` 命名

## 前端 i18n

支持 4 种语言：简体中文（zh-CN）、English（en）、日本語（ja）、한국어（ko）。翻译文件集中在 `packages/i18n/locales/`，前端通过 `@nuxtjs/i18n` 模块加载。
