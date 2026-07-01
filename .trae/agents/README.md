# Agents — 子智能体定义

## 职责

`agents/` 定义了各个领域子智能体的职责边界、行为规范和资源权限。路由分发到对应领域后，Agent 按此文件定位自己的角色。

```
runtime/{domain}/router.md   ← 路由决定使用哪个 Agent
          │
          ▼
agents/{agent-name}.md        ← Agent 定位自身角色
          │
          ▼
workflows/{domain}/{task-type}.md   ← 按工作流执行
```

---

## 文件结构

```
.trae/agents/
├── README.md                    # 本文档
├── frontend-architect.md        # 前端架构：组件/页面/状态管理
├── ui-designer.md               # UI 设计：视觉/样式/组件库选择
├── backend-architect.md         # 后端架构：API/Entity/Migration
├── devops-architect.md          # DevOps：CI/CD/部署/依赖
├── ai-integration-engineer.md   # AI 集成：模型/RAG/Agent
├── api-test-pro.md              # API 测试：端到端测试
├── performance-expert.md        # 性能优化：分析/瓶颈/调优
└── compliance-checker.md        # 安全合规：审计/漏洞/合规
```

---

## Agent 领域归属

| Agent                   | 路由领域        | 覆盖内容                       |
| ----------------------- | --------------- | ------------------------------ |
| frontend-architect      | frontend        | modify / fix / refactor / i18n |
| ui-designer             | frontend        | create / style                 |
| backend-architect       | backend、shared | 全部 task-type                 |
| devops-architect        | devops          | 全部 task-type                 |
| ai-integration-engineer | ai              | 全部 task-type                 |
| api-test-pro            | quality         | api-test                       |
| performance-expert      | quality         | perf                           |
| compliance-checker      | quality         | review / security              |

---

## 行为约束

- Agent 在各领域 `runtime/{domain}/router.md` 中分配
- 每个 Agent 描述其能力边界，超出范围应路由回总路由重新分配
- Agent 文件与项目结构保持同步，修改项目架构时需审视对应 Agent
