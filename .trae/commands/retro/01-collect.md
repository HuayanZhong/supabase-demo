# Step 1: 会话数据收集

收集本次复盘所需的全量数据源。

## 执行

### 1.1 对话轮次统计

- 遍历当前对话的所有消息，统计总轮次 `$total_rounds`
- 区分**已压缩轮次**（可在系统提醒中的压缩摘要找到）和**未压缩轮次**（全部可见）
- 记录轮次编号范围 `$compressed_range` 和 `$uncompressed_range`

### 1.2 工具调用记录

- 遍历 AI 的所有工具调用，记录：
  - 调用的工具类型（Read、Write、SearchReplace、RunCommand、Grep 等）
  - 调用次数
  - 成功/失败状态
- 统计工具调用总数 `$tool_calls_total` 和按类型分布 `$tool_calls_by_type`

### 1.3 Hook 触发记录

- 从 hooks 上下文注入中提取以下信息：
  - 触发的事件类型（UserPromptSubmit、PreToolUse、PostToolUse 等）
  - 对应的 hook 脚本名
  - 注入的规则指针列表
- 统计 hook 触发次数 `$hook_triggers_total` 和按事件分布 `$hook_triggers_by_event`

### 1.4 任务日志提取

- 扫描对话中已有的"任务日志"章节（如果有）
- 提取每条日志的：
  - 领域
  - 规则命中率、Skills 调用率、MCP 使用率
  - 耗时偏差（实际 vs 预估）
  - 质量验证结果

### 1.5 历史复盘记录

- 检查 `.trae/snapshots/retro/` 目录
- 如果存在历史报告，读取最近的 1-2 份，提取：
  - 上次发现的问题
  - 上次的改进建议
  - 用于本次趋势对比

### 1.6 Subagent 调用日志

- 读取 `.trae/agents/logs/agent-invoke.log`，统计：
  - 总调用次数 `$agent_calls_total`
  - 按 Subagent 名称分布的调用次数
  - 首次和末次调用时间
  - Subagent 命中率 = 调用次数 / 总轮次

### 1.7 系统提醒提取

- 从系统提醒中提取：
  - 上下文压缩摘要（被压缩掉的早期对话）
  - 文件打开记录（了解用户在 IDE 中的关注点）
  - lint 错误记录（如果提供了）

## 输出摘要

```
[{步骤1 收集}] 消息 {N} 轮 | 已压缩 {N} 轮 | 工具调用 {N} 次 | hook 触发 {N} 次 | Subagent 调用 {N} 次 | 历史报告 {N} 份
```
