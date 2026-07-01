# Heuristic — 元治理进化流程

## 概述

元治理的进化周期分为 5 步：收集 → 聚合 → 分析 → 提案 → 应用 → 验证。

```
┌─────────────────────────────────────────────────────┐
│                  进化周期（6 步）                      │
│                                                      │
│  ① 收集 ← 每次任务完成（通过/不通过）                  │
│       ↓                                              │
│  ② 聚合 ← 达到阈值（累计次数/时间周期）                │
│       ↓                                              │
│  ③ 分析 ← 根因分析、模式识别、对比治理遗漏              │
│       ↓                                              │
│  ④ 提案 ← 生成标准化治理改进提案                       │
│       ↓                                              │
│  ⑤ 应用 ← 自动修约束/启发式 / 人工修策略/安全           │
│       ↓                                              │
│  ⑥ 验证 ← 3 次同类任务观察效果，决定保留或回滚           │
│                                                      │
│  之后回到 ①，进入下一轮                                │
└─────────────────────────────────────────────────────┘
```

---

## ① 数据收集

### 触发时机

每次任务评估完成后，无论通过与否，都输出经验数据。

### 数据收集方式

```
Evaluation 输出评估报告
    ↓
AI 提取关键字段写入经验数据结构
    ↓
写入 .trae/experience/{domain}/{task-type}-{date}.json
    ↓
每次任务独立文件，不合并
```

### 数据字段规范

```json
{
  "task_id": "sha256(task_description)[:12]",
  "timestamp": "2026-07-01T10:30:00Z",
  "domain": "frontend",
  "task_type": "create",
  "evaluation_result": "pass | conditional_pass | fail",
  "cycle_type": "first_try | re_execute | re_plan",
  "cycle_count": 2,
  "execution_cycles": {
    "re_execute": 1,
    "re_plan": 0,
    "human_intervention": false
  },
  "subagent": "ui-designer",
  "failed_items": [
    {
      "check": "typescript_error",
      "count": 2,
      "locations": ["src/components/HabitsList.vue:45"]
    }
  ],
  "total_tool_calls": 12,
  "governance_files_read": [
    "execution-plan/frontend/constraint.md",
    "execution-engine/frontend/heuristic.md"
  ],
  "key_observations": "创建过程顺利，严格遵循了约束。组件结构规范、i18n key 按约定命名。",
  "governance_gaps": []
}
```

### 数据频率控制

- 每个任务只提交 1 条经验记录（从首次路由到评估结束的全周期）
- 不记录中间循环的中间状态——那是 loop-governance.md 的事
- 依赖链任务：整条链完成后统一提交 1 条，包含所有步骤的摘要

---

## ② 聚合

### 聚合触发条件

以下任一条件满足时触发聚合：

- 最近已完成 **10 次任务** 的经验数据达到阈值
- 最近 **7 天** 时间内完成的任务数达到 ≥ 5 条（即每 7 天至少聚合一次）
- 某一领域连续 **5 次失败**
- 某一失败类型在最近评估中 **出现 ≥ 3 次**
- 人工手动触发

### 聚合方式

```
扫描 .trae/experience/ 下所有未聚合的文件
    ↓
按 domain 分组 → 按 failure_type 分组 → 按 evaluation_result 分组
    ↓
统计各维度的频次：每种失败类型出现多少次、分布在哪些域
    ↓
标注"高频失败"（≥ threshold）和"低频成功"（≤ 1 次失败）
    ↓
聚合后的数据写入 .trae/evolution/aggregation/{date}-report.json
    ↓
已聚合的文件标记为 processed（不删除，做历史留档）
```

### 聚合输出结构

```json
{
  "aggregation_id": "AGG-20260701",
  "period": { "from": "2026-06-24", "to": "2026-07-01" },
  "total_tasks": 10,
  "by_domain": {
    "frontend": { "pass": 3, "fail": 1, "total": 4 },
    "backend": { "pass": 2, "fail": 2, "total": 4 },
    "devops": { "pass": 1, "fail": 0, "total": 1 },
    "shared": { "pass": 1, "fail": 0, "total": 1 }
  },
  "failures_by_type": {
    "typescript_error": { "count": 3, "domains": ["frontend", "backend"] },
    "i18n_key_conflict": { "count": 2, "domains": ["frontend", "shared"] }
  },
  "top_failures": ["typescript_error (3次)"],
  "top_successes": ["devops CI 配置 1/1 通过"]
}
```

---

## ③ 分析

### 根因分析流程

```
拿到聚合报告
    ↓
对于每个"高频失败"：
    1. 这属于什么类型的失败？（类型/工具/流程/常识）
    2. 当前治理有没有覆盖这个类型？
       ─ 有覆盖但没拦住 → 规则太松？执行不到位？
       ─ 没覆盖 → 治理遗漏
    3. 应该加什么层级的规则？
       ─ 需要硬性禁止？→ constraint
       ─ 需要给建议？→ heuristic
       ─ 需要决策指引？→ policy
    4. 目标文件是哪个？
       ─ 通用？→ {module}/constraint/heuristic/policy.md
       ─ 领域专用？→ {module}/{domain}/{constraint/heuristic/policy}.md
    ↓
对于每个"全通过领域"：
    1. 该领域的治理是否过于严格？
    2. 是否有可以放宽的约束？
    3. 是否可以考虑简化该领域的 workflow？
```

### 分析输出

```json
{
  "analysis_id": "ANL-20260701",
  "based_on_aggregation": "AGG-20260701",
  "issues_found": [
    {
      "type": "governance_gap",
      "failure_type": "typescript_error",
      "current_coverage": "execution-plan/backend/constraint.md 已有类型检查约束",
      "gap_reason": "约束已存在但未要求执行 pnpm check-types",
      "suggested_action": "修改 constraint：新增'修改后端代码后必须执行 pnpm check-types'",
      "target_file": "execution-plan/backend/constraint.md",
      "severity": "high"
    }
  ],
  "optimizations_found": [
    {
      "domain": "devops",
      "current_state": "5/5 通过",
      "suggested_action": "考虑减少 devops/heuristic.md 中 CI 检查的冗余步骤",
      "target_file": "execution-plan/devops/heuristic.md",
      "severity": "low"
    }
  ]
}
```

---

## ④ 提案

### 提案生成

分析完成后，每个 `issues_found` 和 `optimizations_found` 生成一条标准提案。

提案格式见 `constraint.md` 中的**先提案后修改**规范。

### 提案优先级

| 优先级 | 条件                           | 响应时间    |
| ------ | ------------------------------ | ----------- |
| P0     | 安全相关遗漏                   | 即时        |
| P1     | 高频失败（≥ 3 次 / 10 次评估） | 本轮聚合后  |
| P2     | 治理遗漏（有失败但无覆盖）     | 本轮聚合后  |
| P3     | 优化建议（规则冗余/可放宽）    | 累积 2 轮后 |

### 提案去重

- 如果同一个 `target_file` + 同一个 `change_type` 的提案在最近 3 次聚合中已存在：
  - 如果尚未应用 → 合并，更新证据计数
  - 如果已应用但效果不佳 → 提升优先级，或建议回滚
  - 如果已应用且已验证通过 → 不再重复提案

---

## ⑤ 应用

### 应用流程

```
提案生成 → 判断变更类型
    │
    ├── 约束（constraint）变更 → 检查是否安全相关
    │   ├── 是 → 提交人工审批
    │   └── 否 → 自动应用
    │
    ├── 启发式（heuristic）变更 → 自动应用
    │
    ├── 策略（policy）变更 → 提交人工审批
    │
    └── 新增文件 → 提交人工审批
```

### 自动应用方式

```
① 读取提案中的 target_file 和 proposed_change
② 读取目标文件当前内容（Read）
③ 定位需要修改的位置
④ 生成 diff（当前 vs 提议）
⑤ 写入目标文件（SearchReplace）
⑥ 记录变更到 .trae/governance-changelog/
⑦ 标记提案为 "applied"
⑧ 标记为 "待验证"
```

### 人工审批流程

```
提案标记为 "需要审批"
    ↓
输出审批摘要（提案内容 + 证据 + 建议方案）
    ↓
等待人工确认
    ↓
  确认 → 执行应用
  拒绝 → 标记提案为 "rejected"，记录拒绝原因
  修改 → 按人工反馈调整后重新提交
```

---

## ⑥ 验证

### 验证周期

- 每次治理变更后，标记为"待验证"
- 验证期 = 从变更生效起 **3 次同类任务**（同 domain + 同 task-type）
- 验证期内，系统跟踪以下指标：
  - 该类型的失败次数
  - 该类型的首次通过率
  - 有无引入新类型的失败

### 验证结果

| 结果          | 条件                              | 动作                           |
| ------------- | --------------------------------- | ------------------------------ |
| ✅ 通过       | 同类失败减少 ≥ 50%，且无新失败    | 标记"已验证"                   |
| ⚠️ 有条件通过 | 同类失败减少但 < 50%，无新失败    | 标记"部分有效"，继续验证下一轮 |
| ❌ 回滚       | 同类失败无变化/增加，或引入新失败 | 自动回滚变更，记录回滚原因     |

### 回滚方式

```
验证失败 → 自动回滚
    ↓
① 从 governance-changelog/ 读取本次变更的 diff
② 反向应用 diff（还原到变更前的状态）
③ 记录回滚到 governance-changelog/
④ 输出回滚报告，说明回滚原因
⑤ 降低该提案的优先级（避免反复提案）
```

---

## 经验积累与遗忘

### 数据保留策略

| 数据类型                              | 保留期 | 超期处理             |
| ------------------------------------- | ------ | -------------------- |
| 原始经验数据（experience/）           | 60 天  | 压缩为聚合摘要后删除 |
| 聚合报告（aggregation/）              | 180 天 | 超过的可删除         |
| 治理变更记录（governance-changelog/） | 永久   | 不删除               |
| 提案记录                              | 永久   | 不删除               |

### 旧数据降权

- 超过 30 天的失败数据在聚合时**权重减半**
- 超过 60 天的失败数据不再纳入"高频失败"的判断
- 这确保治理系统能适应项目发展阶段的变化（初期大量类型错误 → 后期可能变成性能问题）

---

## 治理文件引用图维护

每次治理变更后，必须检查受影响文件间的引用关系。建议维护一个轻量级的引用地图：

```
变更文件：execution-plan/frontend/constraint.md
    ↓ 检查引用该文件的位置
workflows/frontend/create.md — 资源表中引用了
workflows/frontend/modify.md — 资源表中引用了
    ↓ 如有新增的约束/启发式，需评估是否需要同步更新引用
```

引用检查不通过时（如有文件引用了一个不存在的规则），暂停变更并输出警告。
