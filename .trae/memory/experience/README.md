# experience/ — evolution 经验快照

## 用途

evolution 每次聚合完成后写入的经验快照，确保新会话不丢失治理历史积累。

## 数据格式

```json
{
  "aggregation_id": "AGG-20260701",
  "timestamp": "2026-07-01T10:30:00Z",
  "period": { "from": "2026-06-24", "to": "2026-07-01" },
  "total_tasks": 10,
  "by_domain": { "frontend": { "pass": 3, "fail": 1, "total": 4 } },
  "failures_by_type": { "typescript_error": { "count": 3, "domains": ["frontend"] } },
  "governance_coverage_score": 72
}
```

## 数据流

```
evolution 聚合完成
    ↓
写入 experience/{date}-{aggregation_id}.json
    ↓
同步一条摘要到 Trae 项目记忆
    ↓
新会话启动 → 读 Trae 项目记忆摘要 → 按需读 experience/ 完整数据
```

## 保留策略

- 原始文件保留 60 天
- 超期后压缩为月度聚合摘要后删除
