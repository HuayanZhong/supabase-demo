# sessions/ — 跨会话上下文摘要

## 用途

记录每个会话的关键上下文（任务内容、关键决策、中断位置），支持跨会话恢复。

## 数据格式

```json
{
  "session_id": "SES-20260701-001",
  "started_at": "2026-07-01T09:00:00Z",
  "ended_at": "2026-07-01T11:30:00Z",
  "tasks_completed": ["task-hash-001", "task-hash-002"],
  "last_context": "正在处理 goals 模块的 API，Controller 层已完成，Service 未开始",
  "key_decisions": ["使用了分页查询模式"],
  "unfinished_business": ["需要补充 Service 层单元测试"]
}
```

## 写入时机

- 每次任务完成时写入当前进度
- 会话结束时写入最终摘要

## 读取场景

- 新会话启动时读取最近一条 sessions/ 记录，了解进度
- 会话中断后恢复时读取中断时的最后状态

## 保留策略

- 保留最近 30 天
- 超期后压缩为月度摘要（仅统计任务数、完成率）
