---
alwaysApply: false
description: 当用户询问项目结构、模块关系、架构设计，或 AI 开始编码任务前需要快速了解项目全貌时使用。适用于理解代码库整体情况、查看核心抽象（God Nodes）、社区划分、模块间依赖分析，以及新会话开始时的项目上下文建立。
scene: architecture
---

# 项目架构速查

回答代码相关问题前，先读取 `graphify-out/GRAPH_REPORT.md` 了解项目结构、核心抽象、社区划分和跨模块连接。

图谱产物位于 `graphify-out/`：

- `GRAPH_REPORT.md` — 审计报告（God Nodes、Surprising Connections、社区划分）
- `graph.json` — 完整图数据（节点、边、置信度标签）
- `graph.html` — 交互式可视化（浏览器打开）

图谱通过 graphify 生成，代码变更后运行 `/graphify --update` 增量更新。
