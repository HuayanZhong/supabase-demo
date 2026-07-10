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
├── comments.md                # 注释风格
├── task-logging.md            # 任务日志输出格式
├── git-commit-message.md      # Commit message 格式
│
├── backend/                   # 后端领域
│   ├── nestjs.md              # Controller/Service/Module 规范
│   ├── database.md            # MikroORM Entity/Repository/迁移
│   ├── error-handling.md      # 异常处理与错误码
│   └── logging.md             # 日志级别与结构化日志
│
├── frontend/                  # 前端领域
│   ├── nuxt.md                # 组件/页面/数据获取
│   ├── styles.md              # Tailwind / Nuxt UI 样式
│   ├── i18n.md                # 国际化翻译
│   └── quality.md             # a11y/加载状态/性能
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

| 方式          | 说明                        | 文件                                                                        |
| ------------- | --------------------------- | --------------------------------------------------------------------------- |
| **始终生效**  | Session 期间始终存在        | `language.md`、`naming.md`、`comments.md`、`task-logging.md`                |
| **Hook 注入** | 由 hooks 在对应生命周期指向 | `agent-routing.md`、`agent-catalog.md`                                      |
| **智能生效**  | 任务涉及对应领域时自动触发  | `backend/*`、`frontend/*`、`shared/*`、`quality/*`、`git-commit-message.md` |

## Hooks 注入关系

| 生命周期          | 脚本                         | 注入的规则                                                       |
| ----------------- | ---------------------------- | ---------------------------------------------------------------- |
| SessionStart      | session-start.ps1 →          | `language.md` + `monorepo.md` + `agent-catalog.md`（角色与资源） |
| UserPromptSubmit  | classify-intent.ps1 →        | `agent-routing.md`（路由决策）                                   |
| PreToolUse(Write) | enforce-code-standards.ps1 → | `naming.md` + `comments.md` + `agent-catalog.md`（安全约束）     |
| Stop              | validate-output.ps1 →        | `task-logging.md` + `agent-catalog.md`（质量验证）               |

## 原则

- **不重复**：同一规则只在一个文件中定义
- **不空转**：无 hook 注入的规则在对应领域任务时才被 AI 读取
- **指针注入**：hooks 只输出"请阅读 xx.md"，不读取规则文件内容
