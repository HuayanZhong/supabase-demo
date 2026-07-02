# Trae AI Engineering 治理框架

本项目配备完整的 AI 治理框架，位于 `.trae/` 目录下。所有 AI 任务需按以下流程执行。

## 核心规则

- 所有涉及代码变更的任务，必须遵循 v3 治理 5 层闭环（详见 `.trae/ARCHITECTURE.md`）
- 任务完成后必须执行收尾检查清单（追踪摘要 + 经验写入 + 规则自检）
- 具体行为规则见 `.trae/rules/` 下的规则文件
- 治理框架自身通过 `.trae/evolution/` 机制自迭代

## 架构总览

治理框架 v3 5 层闭环：

```
alwaysApply 注入 → 领域规则匹配 → Pre-commit 门禁 → Post-task 收尾 → Evolution 自迭代
```

详见 `.trae/ARCHITECTURE.md`。
