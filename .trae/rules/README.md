# Trae 规则体系

`.trae/rules/` 是项目治理规则的唯一来源（Single Source of Truth）。Hooks 只做指针指向，AI 自己读取规则文件。

## 目录结构

```
rules/
├── README.md                  # 本文档
│
├── language.md                # 语言约束：回答/注释/commit 用中文
├── naming.md                  # 命名规范：文件/变量/类型命名
├── comments.md                # 注释风格（全项目通用）
├── git-commit-message.md      # Commit message 格式
│
├── agent/                     # Agent 治理（按职责拆分）
│   ├── roles.md               # 角色与资源（SessionStart 注入）
│   ├── execution.md           # 执行规范（UserPromptSubmit 注入）
│   ├── search.md              # 文档检索（搜索任务时加载）
│   ├── safety.md              # 安全约束（PreToolUse 注入）
│   └── quality.md             # 质量验证（Stop 注入）
│
├── tool/                      # MCP 工具规则（每个工具独立文件）
│   ├── chrome-devtools.md     # 浏览器自动化（前端验证/UI 调试）
│   ├── filesystem.md          # 文件系统操作（文件读写/编辑）
│   ├── supabase.md            # 数据库操作（SQL 执行/表结构查询）
│   ├── aminer-data-search.md  # 学术数据查询（论文/学者/机构）
│   ├── tavily-search.md       # 网络搜索（最新资料/实时数据）
│   ├── autoglm-browser-agent.md # 浏览器自动化（网页交互/数据采集）
│   ├── autoglm-deepresearch.md # 深度研究（调研报告/综合分析）
│   ├── autoglm-generate-image.md # 图片生成（文生图/图像创作）
│   ├── context7.md            # 代码上下文查询（依赖关系/模块分析）
│   └── sequential-thinking.md # 顺序思考（复杂推理/多步骤思考）
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

| 方式         | 说明                                                                                                       | 文件                                                                                             |
| ------------ | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **始终生效** | Session 期间始终存在                                                                                       | `language.md`、`naming.md`、`comments.md`                                                        |
| **智能生效** | 任务涉及对应领域时自动触发；`enforce-code-standards.ps1` 在 PreToolUse 按文件路径智能指向后端/前端注释规则 | `agent/*`、`tool/*`、`backend/*`、`frontend/*`、`shared/*`、`quality/*`、`git-commit-message.md` |

## Hooks 生命周期

| 生命周期                            | 脚本                                                          | 作用                |
| ----------------------------------- | ------------------------------------------------------------- | ------------------- |
| SessionStart                        | inject-agent-roles.ps1 →                                      | 角色定义注入        |
| UserPromptSubmit                    | inject-agent-routing.ps1 →                                    | 路由 + 执行规范注入 |
| PreToolUse(DeleteFile\|Edit\|Write) | protect-mcp-json.ps1（安全拦截） + enforce-code-standards.ps1 | 保护敏感文件        |
| PreToolUse(execute_sql)             | protect-sql.ps1 →                                             | SQL 注入拦截        |
| PreToolUse(chrome-devtools)         | inject-credentials.ps1 →                                      | 本地凭证注入        |
| PreToolUse(MCP 工具)                | inject-tool-rules.ps1 →                                       | 工具规则注入        |
| Stop                                | inject-quality-rules.ps1 →                                    | 质量验证注入        |

> 规则注入通过 Hooks 指针注入，AI 自行读取规则文件。`alwaysApply: true` 的规则由 IDE 内置机制始终生效。

## 原则

- **不重复**：同一规则只在一个文件中定义
- **不空转**：无 hook 注入的规则在对应领域任务时才被 AI 读取
- **指针注入**：hooks 只输出"请阅读 xx.md"，不读取规则文件内容
