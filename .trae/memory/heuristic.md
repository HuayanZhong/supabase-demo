# Heuristic — 记忆系统最佳实践

## 写入流程

### 任务完成时

```
Evaluation 输出评估报告
    ↓
提取关键信息（任务结果、失败类型、使用模式）
    ↓
  ├── 写入 sessions/    ← 会话上下文摘要（每次任务完成一条）
  ├── 写入 experience/  ← evolution 聚合完成后写入
  ├── 检查 patterns/    ← 是否有新模式需要入库（≥3次）
  └── 检查 profile/     ← 是否有用户偏好可提炼
    ↓
同步摘要到 Trae 项目记忆（≤20 条）
```

### 提取关键信息的原则

| 信息来源                      | 提取内容     | 写入目标    |
| ----------------------------- | ------------ | ----------- |
| 评估报告中的 failed_items     | 高频失败类型 | experience/ |
| 执行过程中重复使用的工具/模式 | 成功模式     | patterns/   |
| 用户明确表达的偏好或纠正      | 偏好记录     | profile/    |
| 任务描述 + 关键决策           | 会话上下文   | sessions/   |

## 读取流程

### 新会话启动时

```
读取 Trae 项目记忆（摘要）
    ↓ 确认治理框架存在
检查 .trae/memory/ 中各目录
    ↓
  ├── 读取 patterns/    ← 加载已知的成功模式
  ├── 读取 profile/     ← 加载用户偏好
  ├── 读取 sessions/（最近一条） ← 了解上次做到哪了
  └── 检查 experience/（最新聚合） ← 了解治理状态
```

### Bootstrap 加载策略

新会话启动时按以下优先级加载记忆，确保在任何场景下都有可用的上下文：

**加载顺序（三阶段）：**

```
阶段 1：快速启动（必须）
    ├── Trae 项目记忆
    │   → 读取治理摘要，确认治理框架是否存在
    │   → 获取最近一次 evolution 聚合的状态摘要
    │   → 耗时预估：< 1 秒
    │
    └── .trae/memory/sessions/ 最新一条
        → 了解"上次做到哪了"
        → 耗时预估：< 1 秒

阶段 2：按需加载（视任务而定）
    ├── 前端相关任务 → 加载 patterns/ 中 type=code_style 的模式
    ├── 后端相关任务 → 加载 patterns/ 中 type=file_structure 的模式
    ├── 与 AI 相关   → 加载 patterns/ 中 type=workflow 的模式
    └── 非上述领域   → 跳过 patterns/ 加载，沿用通用流程

阶段 3：深度数据（evolution 启动时加载）
    ├── .trae/memory/experience/
    │   → evolution 聚合时读取上次经验数据，避免从零开始
    │   → 非 evolution 阶段不加载（数据量大，影响启动速度）
    │
    └── .trae/memory/profile/
        → 仅在需要决策参考时按 key 读取
        → 不批量全量加载
```

**异常与兜底：**

| 场景                 | 现象                    | 处理方式                           | 日志                                                               |
| -------------------- | ----------------------- | ---------------------------------- | ------------------------------------------------------------------ |
| 项目记忆为空         | 首次运行或记忆被清      | 跳过 Trae 记忆，直接加载 sessions/ | `[MEM:bootstrap] INFO \| 项目记忆为空 \| action=跳过`              |
| sessions/ 目录不存在 | 还未完成任务            | 跳过 session 加载                  | `[MEM:bootstrap] INFO \| sessions/ 不存在 \| action=跳过`          |
| patterns/ 为空       | 尚无结晶模式            | 沿用通用流程，不套用模式           | `[MEM:bootstrap] INFO \| patterns/ 为空 \| action=通用流程`        |
| experience/ 数据异常 | 文件损坏或格式不符      | 跳过该条经验，加载上一条           | `[MEM:bootstrap] WARN \| experience/ 损坏 \| file=xxx;action=跳过` |
| 所有记忆均不可用     | 整个 .trae/memory/ 丢失 | 从零开始，如同首次运行             | `[MEM:bootstrap] FAIL \| 所有记忆不可用 \| action=从头开始`        |

**加载日志：**

```
[MEM:bootstrap] START  | 开始加载记忆           | trae_memory=可用/不可用;sessions=N;patterns=N;experience=可用/不可用
[MEM:bootstrap] LOAD   | 阶段 1 完成            | source=Trae项目记忆;summary=治理状态摘要
[MEM:bootstrap] LOAD   | 阶段 2 完成            | task_type=创建前端组件;loaded_patterns=3
[MEM:bootstrap] LOAD   | 阶段 3 完成            | source=experience;loaded=最近聚合记录
[MEM:bootstrap] READY  | Bootstrap 完成         | total_load_time=Nms;available_sources=4/4
```

### sessions/ 加载策略（BUG-021 修复）

当 sessions/ 目录文件过多时，按以下策略加载：

| 文件数   | 加载策略                  | 日志                                                                                |
| -------- | ------------------------- | ----------------------------------------------------------------------------------- |
| ≤ 10     | 全部加载                  | `[MEM:bootstrap] LOAD \| source=sessions;loaded=N`                                  |
| 11 ~ 50  | 加载最近 10 个            | `[MEM:bootstrap] WARN \| sessions 过多 \| count=N;loaded=recent_10`                 |
| > 50     | 加载最近 10 个 + 聚合摘要 | `[MEM:bootstrap] WARN \| sessions 过多 \| count=N;loaded=recent_10;aggregated=true` |
| 损坏文件 | 跳过该文件，加载其他      | `[MEM:bootstrap] WARN \| sessions 损坏 \| file=xxx;action=跳过`                     |

"最近"定义：按文件名中的日期/时间戳倒序，取前 10 个。

聚合摘要：当 sessions > 50 时，对 11~50 名的会话生成摘要（任务类型 + 结果 + 关键文件），不加载详情。摘要缓存在 `.trae/memory/aggregation/sessions-summary-{date}.json`。

**摘要重建时机**：不依赖"每 30 天"的外部调度。而是在 Bootstrap 读取时，检查缓存摘要的创建日期与当前日期之差，超过 30 天则触发重建，否则直接使用缓存。重建后写入新摘要，旧摘要保留在 archive/。

```
[MEM:summary] CHECK  | 检查 sessions 摘要缓存 | path=aggregation/sessions-summary-{date}.json
[MEM:summary] OK     | 缓存未过期             | age=5d;limit=30d;action=直接使用
[MEM:summary] WARN   | 缓存已过期             | age=45d;limit=30d;action=触发重建
[MEM:summary] REBUILD| 重建完成               | old_lines=40;new_file=sessions-summary-{new-date}.json
```

### 权限说明

- `execution-plan` 和 `execution-engine` 阶段应读取 `patterns/` 和 `profile/`
- `evolution` 阶段应读写 `experience/` 和 `patterns/`
- `session/` 仅由任务完成时的收尾逻辑读写

## 会话生命周期

```
开始新会话
    ↓
读取记忆（patterns + profile + 上次 session）
    ↓
执行任务
    ↓
任务完成 → 写入当前 session 摘要 → 更新 patterns → 更新 profile
    ↓
如有 evolution 聚合 → 写入 experience → 同步 Trae 记忆
```

## Pattern 识别指南

| 观察现象                   | 可能的 Pattern | 示例                                |
| -------------------------- | -------------- | ----------------------------------- |
| 多次使用相同组件组合       | 组件编排模式   | `UForm + UInput + UButton` 组合     |
| 多次使用相同的 API 结构    | API 设计模式   | `Controller + Service + DTO` 三板斧 |
| 多次使用相同的错误处理方式 | 错误处理模式   | `NotFoundException` 处理资源不存在  |
| 用户多次纠正同一类问题     | 偏好模式       | "不要再生成 css scoped"             |
