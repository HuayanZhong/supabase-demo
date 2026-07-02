# Policy — 记忆系统决策策略

## 数据保留策略

| 目录        | 保留期 | 超期处理             | 说明                    | 执行触发点                               |
| ----------- | ------ | -------------------- | ----------------------- | ---------------------------------------- |
| sessions/   | 30 天  | 压缩为月度摘要后删除 | 会话上下文时效性强      | 写入新 session **之前**自动检查          |
| experience/ | 60 天  | 压缩为聚合摘要后删除 | 与 evolution 保留期对齐 | evolution 写入新 experience **之前**自检 |
| patterns/   | 永久   | 手动清理             | 成功模式是长期资产      | N/A                                      |
| profile/    | 永久   | 手动清理             | 用户偏好持续有效        | N/A                                      |

## 执行触发机制

每次写入新数据前，自动执行保留期检查，非外部定时任务。

### sessions/ 清理（触发点：写入新 session 前）

```
[SESSION:retention] CHECK  | 检查 sessions 目录     | path=sessions/
[SESSION:retention] FOUND  | 发现超期文件           | files=3;oldest=2026-05-15;age=48d;limit=30d
[SESSION:retention] ARCHIVE| 压缩为月度摘要后删除   | compressed_to=aggregation/sessions-monthly-202605.jsonl;deleted=3
[SESSION:retention] OK     | 无需清理               | age=5d;limit=30d;action=跳过
```

### experience/ 清理（触发点：evolution 写入新 experience 前）

```
[EXPERIENCE:retention] CHECK  | 检查 experience 目录 | path=experience/
[EXPERIENCE:retention] FOUND  | 发现超期文件         | files=2;oldest=2026-04-01;age=92d;limit=60d
[EXPERIENCE:retention] ARCHIVE| 压缩为聚合摘要后删除 | compressed_to=aggregation/experience-monthly-202606.jsonl;deleted=2
[EXPERIENCE:retention] OK     | 无需清理             | age=10d;limit=60d;action=跳过
```

### 不可拆分独立调度

保留策略的检查不应该是"每个月 1 号执行"——那意味着需要外部 cron。正确做法是**绑定到已有的写操作**：写入 session 才检查 session 过期，写入 experience 才检查 experience 过期。没有写操作时不消耗性能。

## 经验数量上限策略（防膨胀）

时间阈值（60 天）是下限保障，但高频任务下 60 天内可能积累上百条经验。需要**数量阈值**双重保护：

| 阈值   | 条件                 | 动作                          |
| ------ | -------------------- | ----------------------------- |
| 30 条  | single 经验 >= 30    | 合并为月度摘要，保留最近 5 条 |
| 3 个月 | 最旧经验距今 > 90 天 | 合并为季度摘要，清空原始文件  |

### 合并规则

```
count >= 30 或 oldest > 90 天
    ↓
按月分组 → 每组取共性摘要
    ↓
  ├── 同领域 + 同结论 → 合并为 1 条通用经验
  ├── 同领域 + 不同结论 → 保留为独立条目（标注冲突）
  └── 不同领域 → 合并为月度聚合 JSON
    ↓
写入 memory/aggregation/experience-m-YYYY-MM.jsonl
    ↓
删除原始 single 文件（保留最近 5 条作为热缓存）
```

### 日志

```
[MEM:merge] TRIGGER | reason=count cap;files=30;limit=30
[MEM:merge] GROUP   | month=2026-07;files=28;dedup=3;merged_to=aggregation/experience-m-202607.jsonl
[MEM:merge] KEEP    | hot_cache=5;deleted=23
[MEM:merge] OK      | total_after=6 (5 hot + 1 agg)
```

## 冲突处理（执行触发点）

以下冲突检查在**新 pattern 入库时**和**新 profile 条目写入时**自动执行，非独立调度。

### Pattern 冲突（触发点：新 pattern 入库前）

同一模式被识别到多个变体时：

```
新 pattern 与现有 pattern 指向同一代码结构
    ↓
比较两个 pattern 的命中次数
    ↓
  ├── 新 ≥ 旧 × 2 → 旧标记 deprecated，新入库
  ├── 新 ≥ 旧 × 0.5 → 合并为更通用的 pattern
  └── 新 < 旧 × 0.5 → 忽略（低频变体）
```

### Profile 冲突

用户偏好的前后矛盾：

```
新偏好与旧偏好冲突
    ↓
  ├── 有时间戳 → 以最新的为准，旧标记 deprecated
  └── 无时间戳 → 同时保留，标记为"待确认"
```

## Trae 记忆同步策略

### 什么值得同步到 Trae 内置记忆

Trae 全局/项目记忆各只有 20 条容量，需谨慎选择同步内容：

| 同步内容           | 目标     | 触发时机             | 优先保留       |
| ------------------ | -------- | -------------------- | -------------- |
| 治理框架入口       | 项目记忆 | 首次创建             | 永远保留       |
| 当前治理状态摘要   | 项目记忆 | evolution 每次聚合后 | 覆盖更新       |
| 最新成功模式 TOP 3 | 项目记忆 | 新 pattern 入库时    | 用频率排序淘汰 |
| 用户关键偏好       | 全局记忆 | 用户明确表达时       | 保留到用户修改 |

### 不同步到 Trae 记忆的内容

- 单次任务细节（走 sessions/）
- 原始经验数据（走 experience/）
- 未确认的候选 pattern
- 临时状态

## 会话恢复策略

| 场景               | 恢复方式                                           |
| ------------------ | -------------------------------------------------- |
| 新会话启动         | 读取最近一条 sessions/ 摘要 + patterns/ + profile/ |
| 会话中断后恢复     | 读取中断会话的最后状态，不加载其他会话数据         |
| 长期未使用（>7天） | 仅加载 profile/ 和 patterns/，不加载历史 sessions/ |
