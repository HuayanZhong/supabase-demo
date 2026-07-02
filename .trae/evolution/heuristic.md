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

### 进化日志输出

**每个进化阶段的开始和结束必须输出以下日志**（日志格式标准见 `../logging.md`）：

```
[EVOLVE:collect]  OK     | 收集经验数据           | domain=领域;records=N;period=天数
[EVOLVE:aggregate]START  | 开始聚合               | threshold=N;trigger=次数/时间
[EVOLVE:aggregate]OK/FAIL| 聚合完成               | reports=N;coverage=覆盖率
[EVOLVE:analyze]  OK/FAIL| 根因分析完成           | top=前N问题;count=N;gap=治理遗漏
[EVOLVE:propose]  OK     | 生成提案               | target=目标文件;type=收紧/放宽;auto=true/false
[EVOLVE:contradict]OK/FAIL| 矛盾检测              | checked=N;conflict=有/无
[EVOLVE:apply]    OK/FAIL| 应用变更               | file=文件名;change=变更说明;auto=是否自动
[EVOLVE:verify]   START  | 开始验证               | task_count=0/N
[EVOLVE:verify]   OK/FAIL| 验证完成               | task_count=N/N;passed=N;failed=N;conclusion=保留/回滚
[EVOLVE:rollback] OK     | 回滚变更               | file=文件名;revert_to=版本;reason=原因
```

有任意 FAIL 或 BLOCKED，进化流程暂停并等待人工介入。

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
写入 .trae/memory/experience/{domain}/{task-type}-{date}.json
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

- **非依赖链任务**：每个任务提交 1 条经验记录（从首次路由到评估结束的全周期）
- **依赖链任务**：每步独立提交 1 条经验记录，整条链完成后额外汇总提交 1 条
  - 例如 devops → backend → frontend：产生 4 条记录（3 步独立 + 1 汇总）
  - 某步经历了 re-execute 等循环时，循环记录独立计数
- **循环迭代记录（re-execute / re-plan）**：每次循环迭代完成后，独立提交 1 条经验记录（见 loop-governance.md 循环状态记录）
  - 例如某任务 re-execute 2 次后通过：产生 3 条记录（首次 + re-execute ① + re-execute ②）
  - evolution 聚合时这些记录按 `task_id` 分组聚合，最终合并为 1 条"任务级"经验

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
扫描 .trae/memory/experience/ 下所有未聚合的文件
    ↓
按 domain 分组 → 按 failure_type 分组 → 按 evaluation_result 分组
    ↓
统计各维度的频次：每种失败类型出现多少次、分布在哪些域
    ↓
标注"高频失败"（≥ threshold）和"低频成功"（≤ 1 次失败）
    ↓
聚合后的数据写入 .trae/memory/aggregation/{date}-report.json
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

### 资源变更检测

在进入根因分析前，先检查资源是否发生变化：

```
读取 .trae/resources/registry.md 的变更记录表
    ↓
对比上次聚合时的资源状态
    ↓
如果存在新增/删除的资源：
    ├── 检查新增资源是否需要补充对应的 templates/scaffold/
    │   ├── 需要补充 → 输出模板缺口
    │   │   → 日志：[EVOLVE:sresource] GAP  | 模板缺口         | resource={name};missing_template={path}
    │   └── 不需要 → 跳过
    │
    ├── 检查已删除资源是否需要清理对应的 templates/scaffold/
    │   ├── 需要清理 → 输出模板过时
    │   │   → 日志：[EVOLVE:resource] OBSOLETE | 模板过时       | resource={name};obsolete_template={path}
    │   └── 不需要 → 跳过
    │
    ├── 检查资源变更是否影响现有 rules/
    │   ├── 有影响 → 输出规则缺口
    │   │   → 日志：[EVOLVE:resource] RULE_GAP | 规则缺口       | resource={name};missing_rule={domain}/{name}.md
    │   └── 无影响 → 跳过
    │
    └── 输出汇总
        → 日志：[EVOLVE:resource] RESULT | 资源变更分析       | added=N;deleted=N;template_gaps=N;rule_gaps=N

上次聚合时的资源状态记录在最后一次聚合报告中
如果无可比基准（首次聚合），跳过资源变更检测

### 规则变更检测

在资源变更检测之后，检查 `.trae/rules/` 目录下的规则文件是否发生变化：

```

读取 .trae/rules/ 下所有 .md 文件的路径列表
↓
对比上次聚合时的 rules 文件基线
↓
扫描 .trae/rules/README.md 中"文件结构"一节的文件树，
优先以文件树为准（人工维护的权威清单），
无文件树时回退到实际目录扫描
↓
如果存在新增/删除/修改的规则：
│
├── 遍历 execution-plan/ 下所有 constraint/heuristic/policy.md：
│ ├── 新规则是否涉及该领域未覆盖的约束场景？
│ │ ├── 是 → 建议在该领域的 constraint/heuristic 中补充引用
│ │ │ → 日志：[EVOLVE:rule] CONSTRAINT_GAP | 约束缺口 | rule={path};target=execution-plan/{domain}/constraint.md;reason=新规则未在约束中引用
│ │ └── 否 → 跳过
│ │
│ ├── 新规则是否与该领域已有的启发式建议重叠或矛盾？
│ │ ├── 重叠 → 标记"规则重复"，建议移除治理文件中的冗余条目
│ │ │ → 日志：[EVOLVE:rule] OVERLAP | 规则重叠 | rule={path};target=execution-plan/{domain}/heuristic.md;action=建议简化
│ │ └── 无重叠 → 跳过
│ │
│ └── 输出领域级汇总
│ → 日志：[EVOLVE:rule] DOMAIN_RESULT | 领域影响 | domain={name};gaps=N;overlaps=N
│
├── 遍历 evaluation/ 下所有 constraint/heuristic/policy.md：
│ ├── 评估检查项是否覆盖了新规则的要求？
│ │ ├── 未覆盖 → 建议在 evaluation 中增加对应检查项
│ │ │ → 日志：[EVOLVE:rule] EVAL_GAP | 评估缺口 | rule={path};target=evaluation/{domain}/heuristic.md;reason=评估未覆盖新规则
│ │ └── 已覆盖 → 跳过
│ │
│ └── 输出评估层汇总
│ → 日志：[EVOLVE:rule] EVAL_RESULT | 评估层影响 | gaps=N
│
├── 遍历 workflows/{domain}/ 下相关 task-type：
│ ├── 对应领域的工作流步骤是否与新规则冲突？
│ │ ├── 冲突 → 建议更新 workflow 步骤顺序或检查项
│ │ │ → 日志：[EVOLVE:rule] WORKFLOW_CONFLICT | 工作流冲突 | rule={path};workflow=workflows/{domain}/{task-type}.md;reason=步骤顺序与规则矛盾
│ │ └── 无冲突 → 跳过
│ │
│ └── 输出工作流层汇总
│ → 日志：[EVOLVE:rule] WORKFLOW_RESULT | 工作流层影响 | conflicts=N
│
├── 检查规则是否涉及安全/凭证/部署等高风险领域：
│ ├── 是 → 标记"高风险规则变更"，在提案中附带完整影响分析
│ │ → 日志：[EVOLVE:rule] HIGH_RISK | 高风险规则变更 | rule={path};reason=涉及安全/凭证/部署
│ └── 否 → 跳过
│
└── 输出汇总
→ 日志：[EVOLVE:rule] RESULT | 规则变更分析 | added=N;deleted=N;modified=N;constraint_gaps=N;eval_gaps=N;workflow_conflicts=N;high_risk=N

如果无变更：
→ 日志：[EVOLVE:rule] OK | 规则无变更

规则文件基线记录在最后一次聚合报告中的 `rules_baseline` 字段：

```json
{
  "rules_baseline": {
    "snapshot_time": "2026-07-02T12:00:00Z",
    "all_rule_files": [
      ".trae/rules/language.md",
      ".trae/rules/interaction.md",
      ".trae/rules/ai-safety.md",
      ".trae/rules/code-style.md",
      ".trae/rules/comments.md",
      ".trae/rules/naming.md",
      ".trae/rules/frontend/comments.md",
      ".trae/rules/backend/nestjs.md",
      "..."
    ],
    "file_count": 23
  }
}
```

如果无可比基线（首次聚合），直接记录当前 rules 文件清单作为基线，不输出变更日志。

```

### 根因分析流程

```

拿到聚合报告
↓
对于每个"高频失败"：1. 这属于什么类型的失败？（类型/工具/流程/常识）2. 当前治理有没有覆盖这个类型？
─ 有覆盖但没拦住 → 规则太松？执行不到位？
─ 没覆盖 → 治理遗漏 3. 应该加什么层级的规则？
─ 需要硬性禁止？→ constraint
─ 需要给建议？→ heuristic
─ 需要决策指引？→ policy 4. 目标文件是哪个？
─ 通用？→ {module}/constraint/heuristic/policy.md
─ 领域专用？→ {module}/{domain}/{constraint/heuristic/policy}.md
↓
对于每个"全通过领域"：1. 该领域的治理是否过于严格？2. 是否有可以放宽的约束？3. 是否可以考虑简化该领域的 workflow？4. 交叉检查 patterns/ 与 profile/ 的记忆反馈：

```

打开 .trae/memory/patterns/
↓
当前高频失败类型 ↔ patterns/ 中成功模式对比
├── 如果 patterns/ 有与当前失败相关的成功模式
│ → 建议在约束中引用该模式，避免重蹈覆辙
│ → 日志：[EVOLVE:mem] MATCH | 记忆匹配 | pattern=PTN-001; failure=typescript_error; action=建议引用
│
└── 如果没有相关模式
→ 该失败类型已记录为新模式候选
→ 日志：[EVOLVE:mem] UNMATCH| 无匹配模式 | failure=typescript_error; action=记录新候选

打开 .trae/memory/profile/
↓
检查是否有与当前任务领域相关的用户偏好
├── 有相关偏好 → 纳入提案参考
│ → 日志：[EVOLVE:mem] PROFILE | 偏好命中 | key=api_design; preference=RESTful; action=纳入提案
│
└── 无相关偏好 → 跳过
→ 日志：[EVOLVE:mem] PROFILE | 无相关偏好 | domain=frontend; action=跳过

```

    5. 汇总记忆参考结果，写入分析输出的 `memory_references` 字段

````

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
  ],
  "template_issues": [
    {
      "type": "template_drift",
      "template": "frontend/component.md",
      "evidence": "最近 5 次创建的组件中，3 次使用了 `<script setup lang=\"ts\">` + `defineOptions` 模式，但骨架中未包含 defineOptions",
      "suggested_action": "在 component.md 骨架中补充 defineOptions 示例",
      "severity": "medium"
    },
    {
      "type": "template_gap",
      "domain": "backend",
      "evidence": "最近 3 次创建了 DTO 文件，但 scaffold/backend/ 下没有 dto.md 骨架",
      "suggested_action": "新增 scaffold/backend/dto.md 骨架",
      "severity": "low"
    }
  ],
  "memory_references": [
    {
      "source": "patterns/PTN-001",
      "type": "code_style",
      "failure_type": "typescript_error",
      "match": true,
      "action": "建议在约束中引用 PTN-001 的类型定义模式"
    },
    {
      "source": "profile",
      "key": "api_design",
      "preference": "RESTful",
      "match": false,
      "action": "跳过（当前高频失败非 API 设计类）"
    }
  ],
  "crystallized_patterns": [
    {
      "type": "code_style",
      "name": "表单组件组合",
      "elements": ["UForm", "UInput", "UButton"],
      "success_count": 4,
      "action": "crystallized",
      "target": "patterns/PTN-001.json"
    },
    {
      "type": "tool_chain",
      "name": "后端 CRUD 三板斧",
      "elements": ["Glob(读参考) → Write(entity) → Write(service) → Write(controller)"],
      "success_count": 3,
      "action": "crystallized",
      "target": "patterns/PTN-002.json"
    },
    {
      "type": "file_structure",
      "name": "DTO 文件未入库",
      "elements": ["*.dto.ts × 3 次"],
      "success_count": 3,
      "action": "pending",
      "reason": "需确认是否应新增 dto.md 骨架"
    }
  ]
}
````

### 模板一致性检测

在根因分析的同时，对模板进行一致性检查。每个关键判断点输出日志。

```
[EVOLVE:template] START | 模板一致性检测开始 | templates_count=N; recent_tasks=N
```

#### 1. 模板漂移检测

```
[EVOLVE:template] DRIFT | 扫描骨架使用记录     | span=最近5次
```

检查每类文件实际生成代码与对应骨架之间的结构性差异：

- 同一类文件最近 5 次创建中，逐次对比生成代码与骨架结构的差异：

```
[EVOLVE:template] DRIFT | 对比文件             | file=xxx.vue; skeleton=xxx.md; diff_count=N; diff_positions=[...]
```

- 如果差异项定位到同一位置 ≥ 3 次 → 标记漂移：

```
[EVOLVE:template] DRIFT | 漂移命中             | template=component.md; position=defineOptions; match=3/5; action=更新骨架
```

- 如果 < 3 次 → 不处理，仅记录：

```
[EVOLVE:template] DRIFT | 漂移不达标           | template=component.md; position=defineOptions; match=2/5; threshold=3; action=跳过
```

- 检查骨架引用率：

```
[EVOLVE:template] DRIFT | 检查引用率           | template=xxx.md; ref_count=N; total_tasks=N; ref_rate=N%
```

- 如果最近 10 次任务中引用率为 0 → 标记废弃候选项：

```
[EVOLVE:template] DRIFT | 引用率为零           | template=xxx.md; action=标记废弃候选项
```

- 否则：

```
[EVOLVE:template] DRIFT | 引用正常             | template=xxx.md; ref_rate=N%
```

#### 2. 模板缺口检测

```
[EVOLVE:template] GAP   | 扫描文件类型分布     | total_files=N; type_count=N
```

- 按文件扩展名和目录模式分组，统计每类文件的数量（仅统计项目源文件，排除 node_modules / dist / .git）：

```
[EVOLVE:template] GAP   | 文件类型统计         | type=*.dto.ts; count=5; has_skeleton=false
[EVOLVE:template] GAP   | 文件类型统计         | type=*.middleware.ts; count=2; has_skeleton=false
[EVOLVE:template] GAP   | 文件类型统计         | type=*.entity.ts; count=3; has_skeleton=true
```

- 如果某类型文件 ≥ 3 个实例且无对应骨架 → 缺口命中：

```
[EVOLVE:template] GAP   | 缺口命中             | type=*.dto.ts; count=5; skeleton=dto.md; action=建议新增骨架
```

- 如果某类型文件 < 3 个实例，属于低频类型 → 不处理：

```
[EVOLVE:template] GAP   | 低频类型跳过         | type=*.middleware.ts; count=2; threshold=3; action=跳过
```

#### 3. 模板过时检测

```
[EVOLVE:template] OBSOLETE | 检查 API 弃用     | skeleton_count=N
```

- 遍历每个骨架文件，检查引用的 API / 装饰器 / 函数是否有已知的替代项：

```
[EVOLVE:template] OBSOLETE | 检查骨架           | skeleton=xxx.md; referenced_apis=[...]
```

- 如果发现弃用 → 标记更新：

```
[EVOLVE:template] OBSOLETE | API 弃用           | skeleton=xxx.md; api=@MikroORM/xxx; alternative=@MikroORM/yyy; action=更新骨架
```

- 如果无弃用 → 跳过：

```
[EVOLVE:template] OBSOLETE | API 正常           | skeleton=xxx.md; all_apis_up_to_date=true
```

#### 汇总

```
[EVOLVE:template] RESULT | 检测完成             | drift_hits=N; gap_hits=N; obsolete=N; total_issues=N
```

所有检测结果写入 `template_issues` 数组，作为分析输出的补充部分。

#### 4. 模式结晶（Pattern Crystallization）

从成功的任务执行中自动提取可复用的代码模式，写入 `.trae/memory/patterns/`。

```
[EVOLVE:crystal] START  | 模式结晶开始           | successful_tasks=N; span=最近任务数
```

**扫描范围：**

- 仅扫描最近评估为 `pass` 的任务经验数据
- 仅扫描 `task_type` 为 `create`、`modify`、`refactor` 的任务（fix 和 style 通常不产生新模式）
- 跳过依赖链中的中间步骤（只从最终通过的任务中提取）

```
[EVOLVE:crystal] SCAN  | 扫描成功任务           | tasks=N; create=N; modify=N; refactor=N
```

**模式候选提取：**

从每条成功经验中提取以下可复用信息：

| 信息来源                           | 提取内容     | 示例                                                         |
| ---------------------------------- | ------------ | ------------------------------------------------------------ |
| 执行过程中连续使用的工具组合       | 工具链模式   | `Glob → Read → SearchReplace → RunCommand(pnpm check-types)` |
| 多次同时出现的文件类型组合         | 文件结构模式 | `entity.ts + controller.ts + service.ts` 同时出现            |
| 成功通过 evaluation 的代码结构     | 代码风格模式 | `UForm + UInput + UButton` 组件组合                          |
| 在同一个任务中按固定顺序出现的步骤 | 流程模式     | "先创建 entity → 再 migration → 再 API"                      |

```
[EVOLVE:crystal] EXTRACT | 提取候选               | tool_chain=N; file_structure=N; code_style=N; workflow=N
```

**去重与合并（Jaccard 相似度算法）：**

将提取的候选模式与 `.trae/memory/patterns/` 中已有模式对比：

```
[EVOLVE:crystal] MATCH  | 对比已有模式           | candidates=N; existing=N
```

**相似度计算：** 对每种模式类型，将元素提取为集合，计算 Jaccard 相似度：

```
Jaccard(A, B) = |A ∩ B| / |A ∪ B|
```

| 模式类型     | 集合元素      | 示例                                    |
| ------------ | ------------- | --------------------------------------- |
| 工具链模式   | 工具名集合    | {Glob, Read, SearchReplace, RunCommand} |
| 文件结构模式 | 文件类型集合  | {entity.ts, controller.ts, service.ts}  |
| 代码风格模式 | 组件/元素集合 | {UForm, UInput, UButton}                |
| 流程模式     | 步骤名集合    | {create_entity, migration, create_api}  |

**判定阈值：**

| Jaccard 相似度 | 判定       | 动作                                                   |
| -------------- | ---------- | ------------------------------------------------------ |
| = 1.0          | 完全相同   | 已有模式 `success_count++`，不新增                     |
| ≥ 0.8          | 高度相似   | 合并为更通用的模式（取并集元素），`success_count` 累加 |
| 0.5 ≤ J < 0.8  | 相关但不同 | 独立存储，标注 `related_to=PTN-xxx`                    |
| < 0.5          | 不同       | 作为新候选入库                                         |

```
[EVOLVE:crystal] MERGE  | 合并模式               | existing=PTN-003; jaccard=0.85; variant_count=2; action=合并为通用模式
[EVOLVE:crystal] RELATE | 相关模式               | existing=PTN-003; jaccard=0.6; action=独立存储并标注关联
[EVOLVE:crystal] NEW    | 新增候选               | candidate=xxx; jaccard<0.5; success_count=1; action=暂存待结晶
```

**模式失效检测：** 每次聚合时检查已结晶模式的使用情况：

| 条件                            | 动作                                           |
| ------------------------------- | ---------------------------------------------- |
| 连续 3 次聚合中未被任何任务引用 | 标记为 `deprecated`，移出活跃列表              |
| `success_count` 未增长超 30 天  | 标记为 `stale`，等待 1 次聚合确认后 deprecated |

**结晶条件：**

候选模式只有在达到阈值后才正式"结晶"（写入 patterns/ 作为可用模式）：

| 条件                | 阈值 | 动作                         |
| ------------------- | ---- | ---------------------------- |
| 同一候选出现 ≥ 3 次 | 3    | 正式结晶，写入 patterns/     |
| 同一候选出现 2 次   | 2    | 暂存，标记为"待确认"         |
| 同一候选出现 1 次   | 1    | 丢弃（单次事件，不构成模式） |

```
[EVOLVE:crystal] CRYSTAL| 正式结晶               | candidate=xxx; match=3/3; target=patterns/xxx.json; status=crystallized
[EVOLVE:crystal] PENDING| 暂存待确认             | candidate=xxx; match=2/3; target=patterns/pending/xxx.json; action=下次再检
[EVOLVE:crystal] DISCARD| 单次事件丢弃           | candidate=xxx; match=1/3; action=不满足阈值
```

**写入 memory/patterns/：**

正式结晶后的模式写入 patterns/ 目录：

```json
{
  "pattern_id": "PTN-{seq}",
  "name": "{模式名称}",
  "type": "tool_chain | file_structure | code_style | workflow",
  "description": "{描述}",
  "elements": ["{元素1}", "{元素2}"],
  "success_count": 3,
  "first_seen": "2026-07-01",
  "last_seen": "2026-07-05",
  "source_tasks": ["task-hash-001", "task-hash-003", "task-hash-007"],
  "status": "active"
}
```

```
[EVOLVE:crystal] WRITE  | 写入模式文件           | path=patterns/PTN-001.json; type=code_style; elements=3
```

**汇总：**

```
[EVOLVE:crystal] RESULT | 模式结晶完成           | new=N; merged=N; pending=N; discarded=N; total_active=N
```

模式结晶结果写入分析输出的补充部分（与 template_issues 同级）。

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

### 自动应用方式（Two-Phase Commit）

```
Phase 1: 预写 Changelog（Prepare）
① 读取提案中的 target_file 和 proposed_change
② 读取目标文件当前内容（Read），保存原内容快照
③ 生成 diff（当前 vs 提议）
④ 写入临时 changelog 到 .trae/memory/changelog/{proposal-id}.pending.json
   包含：target_file、original_content、proposed_diff、timestamp、status="pending"
⑤ 日志：[EVOLVE:apply] PREPARE | 预写变更日志 | file={target};changelog={path}

Phase 2: 应用变更（Commit）或回滚（Abort）
⑥ 定位需要修改的位置
⑦ 写入目标文件（SearchReplace）
   ├── 成功 → 标记 changelog status="completed"，标记提案为 "applied"
   │          日志：[EVOLVE:apply] COMMIT  | 应用变更完成 | file={target};proposal={id}
   └── 失败 → 根据 changelog 中的 original_content 回滚目标文件
              标记 changelog status="aborted"，标记提案为 "failed_apply"
              日志：[EVOLVE:apply] ABORT   | 应用失败已回滚 | file={target};reason={错误}

⑧ 标记为 "待验证"
```

**原子性保证：** 如果 Phase 1 成功但 Phase 2 未完成（如会话中断），
下次 evolution 启动时扫描 `.pending.json` 文件，根据 status 决定：

- `pending` 且目标文件未变更 → 重新执行 Phase 2
- `pending` 且目标文件已变更 → 标记为 `completed`（可能已被其他流程处理）
- `aborted` → 清理临时文件

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
