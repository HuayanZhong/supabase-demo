# Step 3: 治理健康检查

评估治理架构在本会话中的实际运行效果。

## 执行

### 3.1 Hook 触发覆盖率

从步骤 1 收集的 hook 触发记录，对照 `hooks.json` 中的配置：

```json
// 从 hooks.json 读取预期触发条件
SessionStart        → 预期触发: 1 次（会话开始时）
UserPromptSubmit    → 预期触发: N 次（用户消息次数）
PreToolUse(Write)   → 预期触发: 匹配 Edit/Write/DeleteFile 的工具调用次数
PreToolUse(execute_sql) → 预期触发: 匹配 execute_sql 的工具调用次数
PostToolUse         → 预期触发: 匹配 Edit/Write/RunCommand/DeleteFile 的工具调用次数
Stop                → 预期触发: N 次（输出结束次数）
Notification(idle)  → 预期触发: 不统计（异步事件）
```

| 事件             | 预期触发 | 实际触发 | 覆盖率 |
| ---------------- | -------- | -------- | ------ |
| SessionStart     | 1        | 1        | 100%   |
| UserPromptSubmit | N        | N        | —      |

**输出**：未能按预期触发的事件列表，附原因分析（如：纯文本回答未触发工具调用链）。

### 3.2 规则引用覆盖

从 hooks 上下文注入中提取规则引用记录，对照 `.trae/rules/` 下的规则文件：

| 规则文件         | 应引用时机                       | 实际引用次数 | 是否覆盖 |
| ---------------- | -------------------------------- | ------------ | -------- |
| language.md      | SessionStart                     | —            | —        |
| monorepo.md      | SessionStart                     | —            | —        |
| agent-routing.md | UserPromptSubmit                 | —            | —        |
| naming.md        | PreToolUse(Write)                | —            | —        |
| comments.md      | PreToolUse(Write)                | —            | —        |
| task-logging.md  | PostToolUse + Stop               | —            | —        |
| agent-catalog.md | SessionStart + PreToolUse + Stop | —            | —        |

**输出**：覆盖率 < 100% 的规则，标注缺失场景。

### 3.3 任务日志完整度

评估本会话中任务质量：

| 指标               | 评估标准                             |
| ------------------ | ------------------------------------ |
| **任务日志存在性** | 每次有变更的任务后是否输出了任务日志 |
| **资源覆盖率填写** | 规则命中、Skills、MCP 数据是否准确   |
| **质量验证完整性** | 6 项校验是否全部填写                 |
| **日志格式合规**   | 是否符合 task-logging.md 模板        |

**输出**：格式合规率，缺失/不合规的日志列表。

### 3.4 治理盲区探测

识别本会话中暴露出的治理设计盲区：

- 是否有 hook 本应触发但未配置的场景？
- 是否有规则本应覆盖但未引用的情况？
- 用户的行为模式是否有在治理设计之外？

**输出**：探测到的潜在盲区清单。

## 输出摘要

```
[{步骤3 健康}] hook 触发 {N}/{N} | 规则引用 {N}/{N} | 日志完整 {N}/{N} | 盲区 {N} 处
```
