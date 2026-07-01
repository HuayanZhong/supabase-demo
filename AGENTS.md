# Trae AI Engineering 治理框架

本项目配备完整的 AI 治理框架，位于 `.trae/` 目录下。所有 AI 任务需按以下流程执行。

## 核心规则

- 所有涉及代码变更的任务，必须先走 `.trae/runtime/router.md` 路由决策，不得直接编码
- 任务完成后写入经验数据到 `.trae/experience/`，用于治理框架自迭代
- 具体行为规则见 `.trae/rules/` 下的规则文件

## 架构总览

治理框架 7 层闭环：Rules → Runtime（路由）→ Workflows → Execution Plan → Execution Engine → Evaluation → Evolution

详见 `.trae/ARCHITECTURE.md` 和 `.trae/logging.md`（日志格式标准）。
