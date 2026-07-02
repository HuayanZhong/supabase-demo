---
alwaysApply: true
---

# 语言

- 所有回答必须使用中文
- 代码注释必须使用中文
- git commit message 必须使用中文

# 交互

- 直接给出方案，不得反复确认
- 改动前必须先读取相关文件
- 完成后简要说明改了什么、验证了什么
- 复杂任务（5+ 文件）分阶段执行，阶段间自检

# ⚠️ 编码任务前必须执行

```
1. 确认任务领域（frontend/backend/shared/devops/ai/quality）
2. 分阶段执行，每阶段完成后跑 lint + format + check-types
3. 全部完成后统一校验
```

# 安全约束

- 禁止删除未读取过的文件
- 禁止修改超出任务描述范围的文件
- 禁止运行未确认的破坏性命令（`rm -rf`、`drop table`、`reset --hard`）
- 修改代码前必须先读取目标文件，禁止凭空覆盖
- 涉及破坏性操作时，必须先输出操作计划，等待确认

# 规则文件保护

- `.trae/rules/ai-safety.md` 的修改必须人工确认
- 其他 `.trae/` 文件修改需有 evolution 上下文
- 非治理任务不得修改 `.trae/` 文件
