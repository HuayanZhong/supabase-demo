# Skills — 技能包

## 职责

`skills/` 存放领域特定的技能包（Skill），为 Agent 提供专业知识库和可复用的能力。

```
skills/{skill-name}/   ← 技能包：提供领域知识
        │
        ▼
Agent 使用技能辅助执行
```

---

## 文件结构

```
.trae/skills/
├── README.md                      # 本文档
├── ui-ux-pro-max/                 # UI/UX 设计（本地）
└── ...
```

所有通过 `npx skills add` 安装的技能包存放在 `.agents/skills/`，
通过 **Junction** 链接到 `.trae/skills/` 下供 Trae 自动识别。

---

## 技能包清单

### 核心技术栈

| 技能                                 | 覆盖内容                                                                        | 触发场景                               |
| ------------------------------------ | ------------------------------------------------------------------------------- | -------------------------------------- |
| **supabase**                         | 全栈 Supabase（Auth、Realtime、Edge Functions、Storage、Vectors、Cron、Queues） | 数据库操作、认证、迁移、RLS、CLI       |
| **supabase-postgres-best-practices** | PostgreSQL 最佳实践（索引、连接池、锁、安全、监控）                             | 慢查询、死锁、连接池、批量操作         |
| **turborepo**                        | Turborepo 缓存、pipeline、remote cache、filtering、CI 优化                      | turbo.json 配置、任务编排、monorepo    |
| **nuxt-ui**                          | Nuxt UI v4 组件使用（布局、表单、对话框、表格）                                 | 组件选型、布局搭建、主题定制           |
| **nuxt**                             | Nuxt 3 核心（路由、数据获取、SSR、模块、组合式函数）                            | pages、middleware、composables、deploy |
| **typescript-advanced-types**        | TS 高级类型、泛型、条件类型、映射类型、类型体操                                 | 类型定义、Schema 设计、复杂泛型        |

### 后端

| 技能                        | 覆盖内容                                       | 触发场景                 |
| --------------------------- | ---------------------------------------------- | ------------------------ |
| **nestjs-best-practices**   | NestJS 模块/Controller/Service/DTO/Entity 规范 | 创建模块、接口、依赖注入 |
| **postgresql-table-design** | 表设计、索引策略、数据类型选择、分区           | 建表、迁移、Schema 设计  |

### 质量与安全

| 技能                 | 覆盖内容                                        | 触发场景                       |
| -------------------- | ----------------------------------------------- | ------------------------------ |
| **webapp-testing**   | Playwright 网页自动化、截图、日志收集           | E2E 测试、UI 验证              |
| **frontend-testing** | 前端测试策略、Vitest、Vue Test Utils、组件测试  | 单元测试、组件测试、测试覆盖率 |
| **security-review**  | 安全审查（密钥泄露、注入、XSS、CSRF、认证授权） | 安全审计、漏洞扫描、合规检查   |
| **code-review**      | TypeScript 代码审查最佳实践                     | PR 审查、代码质量检查          |
| **performance**      | Web 性能审计（LCP、CLS、INP、资源加载）         | 性能优化、Lighthouse           |

### 国际化与设计

| 技能              | 覆盖内容                               | 触发场景                 |
| ----------------- | -------------------------------------- | ------------------------ |
| **i18n-expert**   | i18n 框架配置、key 管理、翻译审计      | 多语言配置、翻译遗漏检查 |
| **ui-ux-pro-max** | 组件库选择、色板、图标、排版、样式规范 | UI 设计、组件选型        |

---

## 行为约束

- 技能包与 MCP 工具互补：MCP 提供实时 API 调用，技能提供静态知识库
- 技能包在对应领域路由的 `资源映射` 表中声明
- 技能包优先于通用知识，避免 Agent 使用过时的经验
