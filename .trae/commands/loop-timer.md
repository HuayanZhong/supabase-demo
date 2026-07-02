---
name: loop-timer
description: 定时循环任务调度器——按指定间隔重复执行任务，集成收敛检测、收益递减、成本上限和守卫节点
---

# `/loop timer` — 定时循环任务调度器

## 概览

`/loop timer` 对标 Claude Code 的 `/loop` 指令，定时循环执行指定任务。

```
/loop timer <interval> <task>
/loop timer 5m "eval last"         → 每 5 分钟评估上次产出
/loop timer 1h "sync-resources"    → 每小时同步资源
/loop timer 30m "health"           → 每 30 分钟自检
/loop timer 2h "audit"             → 每 2 小时安全扫描
/loop timer daily "status"         → 每天输出状态报告
```

---

## 使用方式

### 基本语法

```
/loop timer <interval> "<task>"
```

### 间隔格式

| 格式     | 单位   | 示例                          |
| -------- | ------ | ----------------------------- |
| `1m`     | 分钟   | `5m` = 5 分钟                 |
| `30m`    | 分钟   | `30m` = 30 分钟               |
| `1h`     | 小时   | `2h` = 2 小时                 |
| `daily`  | 每天   | `daily` = 每 24h              |
| `weekly` | 每周   | `weekly` = 每 7d              |
| `cron`   | 自定义 | `"0 9 * * 1"` = 每周一早 9 点 |

### 任务类型

| 任务引用   | 示例                                  | 说明                   |
| ---------- | ------------------------------------- | ---------------------- |
| 命令名     | `/loop timer 5m "sync-resources"`     | 调用其他 commands 指令 |
| 评估目标   | `/loop timer 30m "eval last"`         | 评估上次任务产出       |
| 检查目标   | `/loop timer 1h "health"`             | 执行全量自检           |
| 领域任务   | `/loop timer 2h "audit"`              | 安全扫描               |
| 自定义流程 | `/loop timer daily "route→plan→eval"` | 链式组合               |

### 生命周期管理

| 子命令   | 示例                      | 功能                    |
| -------- | ------------------------- | ----------------------- |
| `list`   | `/loop timer list`        | 列出所有活动/历史的循环 |
| `cancel` | `/loop timer cancel <id>` | 终止指定循环            |
| `pause`  | `/loop timer pause <id>`  | 暂停循环（可恢复）      |
| `resume` | `/loop timer resume <id>` | 恢复暂停的循环          |
| `status` | `/loop timer status <id>` | 查看循环执行状态和统计  |

---

## 执行流程

### 单轮执行

```
/loop timer 5m "eval last"
    ↓
[ROUTE:parse]          → 解析命令
[ROUTE:match]          → 匹配对应子命令
    ↓
[LOOP:schedule]        → 注册定时调度器
[LOOP:schedule]        → 写入 loop-registry.json
    ↓
[LOOP:timer]           → 定时器触发（第 1 轮）
    ↓
前置守卫：
[GUARD:scope]          → 范围守卫
[GUARD:concurrent]     → 并发守卫（上限 3）
[GUARD:cost]           → 成本守卫（累计上限）
    ↓
执行任务（完整 7 层或 fast-path）：
[ROUTE:parse] → [ROUTE:match] → [GUARD] → [ENGINE] → [EVAL]
    ↓
后置检测：
[LOOP:converge]        → 收敛检测
[LOOP:diminishing]     → 收益递减检测
[LOOP:cost]            → 本轮成本统计
    ↓
状态持久化：
[MEM:write]            → 写入 .trae/loop-state/
    ↓
判断下一轮：
│
├── 达成退出条件 → [LOOP:exit] END
│
├── 检测到退步   → [LOOP:diminishing] BLOCKED → 熔断
│
└── 正常继续     → [LOOP:timer] 等待下一轮间隔
```

### 循环注册与状态持久化

每次 `/loop timer` 执行的第一件事是注册循环实例：

```json
{
  "loop_id": "TIMER-20260702-001",
  "type": "timer",
  "interval": "5m",
  "task": "eval last",
  "created_at": "2026-07-02T14:00:00Z",
  "status": "active",
  "current_cycle": 0,
  "total_cycles": 0,
  "last_run": null,
  "next_run": "2026-07-02T14:05:00Z",
  "consecutive_no_progress": 0,
  "total_tool_calls": 0
}
```

路径：`.trae/loop-state/loop-registry.json`（所有活动循环的注册表）

每轮执行完成后追加一行到 JSONL 文件（append-only，一行一轮）：

```jsonl
{"loop_id":"TIMER-xxx001","cycle":1,"ts":"2026-07-02T14:05:00Z","duration_ms":3500,"tool_calls":5,"test":"A1","result":"PASS","convergence":{"status":"effective","no_progress_count":0,"delta":null}}
{"loop_id":"TIMER-xxx001","cycle":2,"ts":"2026-07-02T14:06:00Z","duration_ms":2800,"tool_calls":4,"test":"A2","result":"PASS","convergence":{"status":"effective","no_progress_count":0,"delta":0}}
```

路径：`.trae/loop-state/timer-{loop_id}.jsonl`（所有轮次写入同一个 JSONL 文件，不拆分）

**为什么用 JSONL 而非每轮独立 JSON：**

- 100 轮不会产生 100 个文件，始终是一个 JSONL 文件
- append-only 天然支持追加，无需读取-修改-写回
- 每行自包含，可用 `Select-String` / `grep` 按 cycle 查询
- 文件体积可控：1000 轮约 200KB
- 每 30 天 / 超 5000 行时自动归档到 `loop-state/archive/`

---

## 与 loop-governance.md 的集成

### 收敛检测

每轮执行后，调用 loop-governance.md 的收敛检测逻辑：

```
对比上一轮和本轮的执行结果特征
    ↓
├── 产出特征完全相同（失败文件列表哈希相同）→ no_progress_count +1
├── 失败列表减少 ≥ 10% → no_progress_count 归零
├── 失败列表减少 < 10% → no_progress_count +1
└── 失败列表增加（退步）→ 立即熔断

no_progress_count ≥ 2 → 暂停循环，输出报告
```

日志格式（与 loop-governance.md 一致）：

```
[LOOP:converge] OK     | 有效收敛     | feature_hash=xxx;failure_reduction=50%;no_progress=0
[LOOP:converge] STALL  | 无进展       | reason=特征相同;no_progress=1;action=继续
[LOOP:converge] STALL  | 连续无进展   | no_progress=2;action=暂停循环
[LOOP:converge] REGRESS| 收益退步     | delta=+20%;action=立即熔断
```

### 收益递减检测

从第 2 轮开始启用，与 loop-governance.md 三段互斥判定表一致：

| delta                          | 判定     | 动作                                |
| ------------------------------ | -------- | ----------------------------------- |
| delta > 0（失败增加）          | 收益退步 | 立即熔断                            |
| -10% < delta ≤ 0（改进不足）   | 收益递减 | consecutive_below +1，连续 2 次熔断 |
| delta ≤ -10%（失败减少 ≥ 10%） | 有效改进 | consecutive_below 归零              |

```
[LOOP:returns] OK   | 有效改进     | delta=-50%;threshold=-10%;consecutive=0
[LOOP:returns] WARN | 收益递减     | delta=-5%;threshold=-10%;consecutive=1;action=继续
[LOOP:returns] WARN | 连续收益递减 | delta=-3%;threshold=-10%;consecutive=2;action=强制熔断
[LOOP:returns] FAIL | 收益退步     | delta=+20%;action=立即熔断
```

### 成本上限

每轮执行后累计工具调用数。累计上限与 loop-governance.md 的成本分级一致：

| task-type | 每轮上限 | 累计上限 |
| --------- | -------- | -------- |
| create    | 40       | 120      |
| modify    | 30       | 90       |
| refactor  | 50       | 150      |
| fix       | 20       | 60       |
| style     | 15       | 45       |
| data      | 25       | 75       |
| api       | 30       | 90       |

- **每轮上限**：单轮执行的工具调用上限（同 loop-governance.md）
- **累计上限**：该循环实例从创建到当前的总调用上限（3 倍单轮上限）
- 达到累计上限 → 强制终止循环（不等收敛检测）

```
[LOOP:cost] WARN   | 本轮调用数     | calls=12/30;cumulative=45/90
[LOOP:cost] WARN   | 累计调用数预警 | cumulative=78/90;action=继续
[LOOP:cost] BLOCKED| 累计调用数超限 | cumulative=91/90;action=强制终止
```

### 状态锁定

与 loop-governance.md 共享状态锁定：

- 已通过的检查项加入 `locked_checks` 列表，后续轮次跳过
- 不可锁定类型：安全检查、集成测试、跨文件验证
- 超过 3 轮自动解锁

状态锁写入 `.trae/loop-state/{loop_id}-locks.json`：

```json
{
  "loop_id": "TIMER-20260702-001",
  "locks": [{ "check": "pnpm check-types", "locked_at": "cycle-2", "expires_at": "cycle-5" }]
}
```

```
[LOOP:lock] LOCK  | 锁定检查项   | check=pnpm check-types;cycle=2;expires_at=cycle-5
[LOOP:lock] UNLOCK| 解锁检查项   | check=pnpm lint;trigger=因另一修复报错
[LOOP:lock] EXPIRE| 锁定过期     | check=pnpm format;cycle=6;max=3;action=自动解锁
```

### 语义循环检测

当定时任务涉及代码修复/改进时，启用语义循环检测（与 loop-governance.md 一致）：

| 语义循环模式                  | 检测方式                            |
| ----------------------------- | ----------------------------------- |
| 同一文件同一行报同一类错误    | 检查失败文件路径 + 行号范围是否重叠 |
| 相同工具名 + 参数结构相似     | 检查工具名 + 参数 key 集合是否一致  |
| 连续 2 次报错信息包含相同模板 | 用正则提取错误模板，去变量后对比    |

```
[LOOP:semantic] BLOCKED| 语义循环检测 | pattern=同文件同行号;conclusion=暂停循环
```

---

## 与守卫节点的集成

每轮执行前必须经过以下守卫：

### 并发守卫

```
[GUARD:concurrent] WARN | 并发超限 | active=N;limit=3;action=排队
```

- 最大并发循环数：3（与 router.md 多任务并发一致）
- 超限 → 排队等待，直到有循环终止
- 同一 loop_id 的后续轮次不占用并发槽位（已注册的不算）

### git 守卫

```
[GUARD:git] WARN | git 守卫 | dirty=true;action=跳过本轮;message=工作区有未提交变更
```

- 工作区不干净 → 跳过本轮，等待下一轮
- 连续 3 轮跳过 → 暂停循环，上报人工

### 范围守卫

```
[GUARD:scope] OK | 范围守卫 | domain=xxx;scope=符合
```

- 范围超出注册时的 scope → 阻断并上报

### 环境守卫

```
[GUARD:env] OK | 环境守卫 | env=development
```

- 生产环境下的破坏性操作需要双重确认

### 降级路径

```
[ENGINE:degrade] WARN | 降级方案 | mcp=xxx;fallback=yyy;degraded=true
```

- MCP 不可用时走 degradation-registry.md 登记的降级方案
- 降级执行后在日志标注 `degraded=true`

---

## 日志格式

所有日志遵循 `logging.md` 的格式标准：

```
[LOOP:sched]      OK     | 注册定时循环         | loop_id=TIMER-xxx;interval=5m;task=eval last
[LOOP:sched]      OK     | 写入注册表            | path=.trae/loop-state/loop-registry.json
[LOOP:timer]      START  | 定时器触发            | loop_id=TIMER-xxx;cycle=1;next_run=14:05:00
[LOOP:converge]   OK     | 有效收敛              | failure_reduction=50%;no_progress=0
[LOOP:returns]    OK     | 有效改进              | delta=-50%;consecutive=0
[LOOP:cost]       OK     | 本轮成本              | calls=8/30;cumulative=8/90
[LOOP:exit]       END    | 循环完成              | loop_id=TIMER-xxx;cycles=N;total_calls=N
[LOOP:exit]       PAUSE  | 暂停循环              | loop_id=TIMER-xxx;reason=no_progress≥2
[LOOP:exit]       CANCEL | 终止循环              | loop_id=TIMER-xxx;reason=用户取消
```

---

## 管控上限

| 维度                       | 上限              | 超出后动作                     |
| -------------------------- | ----------------- | ------------------------------ |
| 最大并发循环数             | 3                 | 排队等待                       |
| 单循环最大轮次             | 99                | 自动终止                       |
| 连续无进展次数             | 2                 | 暂停 + 上报                    |
| 总工具调用数（单循环累计） | 按 task-type 3 倍 | 强制终止                       |
| timer 最短间隔             | 1 分钟            | 低于此值转为 `watch` 模式      |
| 单轮超时                   | 30 分钟           | 中断本轮，标记异常，等待下一轮 |

---

## 场景示例

### 场景 1：定时评估

```
输入：/loop timer 10m "eval last"
输出：
  [LOOP:sched]    OK | 注册定时循环 | loop_id=TIMER-001;interval=10m;task=eval last
  [LOOP:timer]  START | 第 1 轮触发
  [EVAL:start]  START | 开始评估
  [EVAL:step]     OK | ①完成检查清单 | checks=4;passed=4
  [EVAL:done]    END | 评估完成 | conclusion=PASS
  [LOOP:converge] OK | 有效收敛 | failure_reduction=0%;no_progress=0
  [LOOP:cost]     OK | 本轮成本 | calls=4/20;cumulative=4/60
  [LOOP:exit] CONTINUE | 等待下一轮 | next_in=10m
```

### 场景 2：定时同步资源

```
输入：/loop timer 30m "sync-resources"
输出：
  [LOOP:sched]    OK | 注册定时循环 | loop_id=TIMER-002;interval=30m;task=sync-resources
  [LOOP:timer]  START | 第 1 轮触发
  [SYNC]           OK | 注册表与实际一致，无需变更
  [LOOP:converge]  OK | 有效收敛 | failure_reduction=0%;no_progress=0
  [LOOP:cost]      OK | 本轮成本 | calls=2/15;cumulative=2/45
  [LOOP:exit] CONTINUE | 等待下一轮 | next_in=30m
```

### 场景 3：自动熔断

```
输入：/loop timer 5m "health"
第 1 轮：health 通过
第 2 轮：health 通过（特征完全相同）
第 3 轮：health 仍相同 → no_progress_count=2 → 暂停

输出：
  [LOOP:timer]  START | 第 3 轮触发
  [ENGINE:step]    OK | health 检查
  [LOOP:converge] STALL | 连续无进展 | no_progress=2;action=暂停循环
  [LOOP:exit]    PAUSE | 暂停循环 | loop_id=TIMER-003;reason=连续3轮无变化
```

### 场景 4：工作区不干净跳过

```
输入：/loop timer 5m "eval last"
[GUARD:git] WARN | git 守卫 | dirty=true;action=跳过本轮
[LOOP:timer]  SKIP | 跳过本轮 | reason=工作区不干净;skip_count=1
[LOOP:exit] CONTINUE | 等待下一轮 | skip_count=1;max_skip=3
```

---

## 循环注册表结构

`.trae/loop-state/loop-registry.json`：

```json
{
  "active": [
    {
      "loop_id": "TIMER-20260702-001",
      "type": "timer",
      "interval": "5m",
      "task": "eval last",
      "domain": "quality",
      "status": "active",
      "created_at": "2026-07-02T14:00:00Z",
      "current_cycle": 5,
      "last_run": "2026-07-02T14:25:00Z",
      "next_run": "2026-07-02T14:30:00Z",
      "no_progress_count": 0,
      "total_tool_calls": 28,
      "task_type": "fix"
    }
  ],
  "paused": [],
  "history": [
    {
      "loop_id": "TIMER-20260701-001",
      "type": "timer",
      "interval": "30m",
      "task": "sync-resources",
      "status": "completed",
      "total_cycles": 12,
      "total_tool_calls": 36,
      "exit_reason": "用户取消",
      "created_at": "2026-07-01T09:00:00Z",
      "ended_at": "2026-07-01T15:00:00Z"
    }
  ]
}
```

---

## 与 sync.md 集成

资源同步流程（sync.md）增加以下传播规则：

| 新增资源           | 需要更新的文件           | 更新位置                      |
| ------------------ | ------------------------ | ----------------------------- |
| MCP/Skill 能力变化 | `commands/loop-timer.md` | 降级路径段对应 MCP 的降级方案 |
| 新增 MCP           | `commands/loop-timer.md` | 降级路径段新增一行            |

---

## 与其他指令的关系

| 指令              | 关系                            |
| ----------------- | ------------------------------- |
| `/sync-resources` | 可作为 `/loop timer` 的任务传入 |
| `/status`         | 可被 `/loop timer` 自动调用     |
| `/health`         | 可作为 `/loop timer` 的任务传入 |

---

## 限制

1. 定时精度取决于 AI 调度能力，非硬实时系统
2. timer 最短间隔 1 分钟，低于此值自动转为 `watch` 模式
3. 循环状态文件 `.trae/loop-state/` 不支持跨机器共享
4. 暂停后在 AI 会话中断后可能丢失恢复能力（依赖 sessions/ 日志恢复）
5. 累计成本上限达 3 倍单轮上限后强制终止，不可调整
