# Trae 规则体系

`.trae/rules/` 是项目治理规则的唯一来源（Single Source of Truth）。Hooks 只做指针指向，AI 自己读取规则文件。

## 目录结构

```
rules/
├── README.md                  # 本文档
│
├── agent-routing.md           # 命中规则：路由决策 + 冲突解决
├── agent-catalog.md           # Agent 操作目录（按章节分阶段注入）
├── language.md                # 语言约束：回答/注释/commit 用中文
├── naming.md                  # 命名规范：文件/变量/类型命名
├── comments.md                # 注释风格（全项目通用）
├── git-commit-message.md      # Commit message 格式
│
├── backend/                   # 后端领域
│   ├── nestjs.md              # Controller/Service/Module 规范
│   ├── comments.md            # 后端注释规范（JSDoc 模板 / Entity DTO 注释）
│   ├── database.md            # MikroORM Entity/Repository/迁移
│   ├── error-handling.md      # 异常处理与错误码
│   └── logging.md             # 日志级别与结构化日志
│
├── frontend/                  # 前端领域
│   ├── nuxt.md                # 组件/页面/数据获取
│   ├── styles.md              # Tailwind / Nuxt UI 样式
│   ├── i18n.md                # 国际化翻译（含硬编码检测规则）
│   ├── comments.md            # 前端注释规范（.vue / composable）
│   ├── quality.md             # a11y/加载状态/性能
│   ├── components.md          # 组件提取与架构
│   ├── dashboard-layout.md    # Dashboard 布局模式
│   ├── echarts.md             # ECharts 集成规范
│   ├── layout-bfc.md          # Flex + BFC 滚动规则
│   ├── no-decoration.md       # 禁止无效装饰
│   ├── task-stability.md      # 长任务稳定性与多任务并行
│   └── delivery-checklist.md  # 交付前自检清单
│
├── shared/                    # 跨包共享
│   ├── monorepo.md            # 子包创建/构建配置
│   ├── dependencies.md        # catalog 依赖管理
│   ├── env-vars.md            # 环境变量注册
│   └── frontend-types.md      # ViewModel/Entity 边界
│
└── quality/                   # 质量保证
    ├── testing.md             # 测试规范
    └── security.md            # 安全与认证
```

## 生效方式

| 方式          | 说明                                                                                                       | 文件                                                                        |
| ------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **始终生效**  | Session 期间始终存在                                                                                       | `language.md`、`naming.md`、`comments.md`                                   |
| **智能生效**  | 任务涉及对应领域时自动触发；`enforce-code-standards.ps1` 在 PreToolUse 按文件路径智能指向后端/前端注释规则 | `backend/*`、`frontend/*`、`shared/*`、`quality/*`、`git-commit-message.md` |

## Hooks 安全拦截

| 生命周期                    | 脚本                                                            | 作用           |
| --------------------------- | --------------------------------------------------------------- | -------------- |
| PreToolUse(Write)           | protect-mcp-json.ps1（安全拦截） + enforce-code-standards.ps1   | 保护敏感文件   |
| PreToolUse(execute_sql)     | protect-sql.ps1 →                                               | SQL 注入拦截   |
| PreToolUse(chrome-devtools) | inject-credentials.ps1 →                                        | 本地凭证注入   |

> 规则注入由 Trae IDE 内置机制处理，通过 `alwaysApply` 字段控制始终生效或按意图匹配。

## 原则

- **不重复**：同一规则只在一个文件中定义
- **不空转**：无 hook 注入的规则在对应领域任务时才被 AI 读取
- **指针注入**：hooks 只输出"请阅读 xx.md"，不读取规则文件内容
