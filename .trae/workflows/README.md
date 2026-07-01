# Workflows — 任务执行流程

## 职责

`workflows/` 负责为每个任务类型提供标准化的执行步骤，指导 Agent 按规范完成从分析到验证的全过程。

```
runtime/{domain}/router.md   ← 子路由：决定 task-type
          │
          ▼
workflows/{domain}/{task-type}.md   ← 执行流程：Step-by-step 操作
          │
          ▼
执行 Agent 按步骤完成任务
```

---

## 文件结构

```
.trae/workflows/
├── README.md              # 本文档
├── frontend/
│   ├── create.md          # 新建组件/页面
│   ├── modify.md          # 修改已有功能
│   ├── fix.md             # 修复 Bug
│   ├── refactor.md        # 代码重构
│   ├── style.md           # 样式调整
│   └── i18n.md            # 国际化变更
├── backend/
│   ├── create.md          # 新建模块/Controller
│   ├── modify.md          # 修改业务逻辑
│   ├── fix.md             # 排查后端问题
│   ├── refactor.md        # 后端代码重构
│   ├── api.md             # API 接口设计
│   └── data.md            # 数据模型/Migration
├── devops/
│   ├── ci.md              # CI/CD 流程配置
│   ├── deploy.md          # 部署
│   ├── config.md          # 项目配置变更
│   ├── deps.md            # 依赖管理
│   └── hooks.md           # Git 钩子配置
├── shared/
│   ├── types.md           # 共享类型定义
│   ├── i18n.md            # 翻译文件变更
│   ├── lint.md            # Lint 配置变更
│   └── add-package.md     # 新增共享包
├── ai/
│   ├── integrate.md       # 接入 AI 模型
│   ├── chat.md            # 对话功能
│   ├── rag.md             # 向量检索
│   └── agent.md           # Agent 编排
└── quality/
    ├── test.md            # 编写/运行测试
    ├── review.md          # 代码审查
    ├── perf.md            # 性能优化
    ├── security.md        # 安全审计
    └── api-test.md        # API 接口测试
```

---

## 统一格式

每个 workflow 文件遵循五段式结构：

| 段落         | 内容                                   |
| ------------ | -------------------------------------- |
| **触发条件** | 什么关键词和任务类型激活该 workflow    |
| **准备工作** | 需要加载的资源（rules / skills / MCP） |
| **执行步骤** | 3-5 步具体操作，从分析到实施           |
| **完成检查** | Checklist 式验证标准                   |
| **输出**     | 预期的产出来描述                       |

每个文件顶部标注了对应 Agent，确保 AI 知道由谁来执行。

---

## 行为约束

- workflow 是**指导性参考**，不是硬性约束
- Agent 始终以完成任务为目标，可根据实际情况调整步骤顺序
- 当 `workflows/{domain}/{task-type}.md` 不存在时，Agent 根据 router.md 的资源映射和 best practice 自主决策
- workflow 文件应与项目规范保持同步，修改规范时需审视对应 workflow
