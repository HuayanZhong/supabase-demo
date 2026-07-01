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
