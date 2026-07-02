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

# ⚠️ 任务收尾强制检查清单 【v3 新增 — 不可跳过】

任务完成后，必须完成以下收尾步骤。**未完成 = 任务未结束。**

## 1. 输出追踪路径摘要

在对话中输出，格式见 `.trae/logging.md`：

```
任务追踪 (task: "{任务描述}")
  文件: 创建 N 个 / 修改 M 个
  验证: lint ✅/❌ | typecheck ✅/❌ | format ✅/❌
  规则: 触发 N 个 / 相关 M 个 ({百分比}%)
  结论: ✅ 通过 / ❌ 不通过 / ⚠️ 人工介入
```

## 2. 写入经验数据

按 `.trae/memory/write-guide.md` 模板，写入 `memory/experience/{task-id}.json`。
文件必须包含：task_id、date、domain、files_created、files_modified、verification、rules、outcome 字段。

## 3. 规则使用率自检

- 统计本任务触发了 rules/ 下哪些规则文件（显式 Read 过的）
- 统计本任务相关的规则文件（按领域估算）
- 输出覆盖率百分比

## 4. 检查 Evolution 触发

- 统计 `memory/experience/` 下有效经验文件数（不含 README 和 meta/）
- 若 ≥ 5 条，在对话中提议：「经验数据已达 N 条，是否触发一次 evolution 聚合分析？」
