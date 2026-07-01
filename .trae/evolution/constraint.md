# Constraint — 元治理硬约束

## 概述

元治理（Meta-Governance）负责治理体系自身的迭代进化。本文件定义进化过程中的**不可违反的红线**。

### 定位

```
每个任务完成 → 收集经验数据 → 达到阈值 → 生成改进提案 → 应用变更
                                                          │
                                                ┌─────────┴─────────┐
                                                │  可自动化变更       │  需人工审批
                                                │  (约束/启发式)      │  (策略/自身)
                                                └─────────┬─────────┘
                                                          │
                                                    更新治理文件
```

---

## 基于证据

- **任何治理规则的变更必须基于具体证据**，不得凭直觉或无数据支撑的观点修改
- 证据的最低门槛：
  - **硬约束变更**：同一类型的失败在最近 10 次评估中出现 ≥ 3 次
  - **启发式变更**：同一类型的失败在最近 10 次评估中出现 ≥ 2 次
  - **策略变更**：同一类型的失败在最近 10 次评估中出现 ≥ 3 次，或连续 5 次全通过
  - **新增治理文件**：同一类型的失败在最近 15 次评估中出现 ≥ 5 次
- 单次偶发失败不足以触发任何治理变更

## 安全不可降级

- **任何涉及安全的约束不得被 evolution 移除或弱化**
- 以下类别禁止被修改或删除：
  - API key / 密钥硬编码检测与上报
  - SQL 注入 / 命令注入检测
  - CORS / CSP 安全配置检查
  - 依赖漏洞扫描要求（CVE）
  - 审计日志记录要求
- 如果 evolution 分析认为某条安全约束"太严"→ 输出"安全约束分析报告"到人工，但不自动修改
- 安全类约束的修改权限：**仅限人工**

## 先提案后修改

- 修改任何治理文件前，必须先生成**标准化的治理改进提案**
- 提案必须包含以下字段：

```json
{
  "proposal_id": "EVO-2026-07-001",
  "target_file": "execution-plan/frontend/constraint.md",
  "change_type": "add / modify / remove",
  "evidence": [
    { "task_id": "task-hash-001", "failure_type": "i18n_key_conflict", "date": "2026-07-01" },
    { "task_id": "task-hash-003", "failure_type": "i18n_key_conflict", "date": "2026-07-01" },
    { "task_id": "task-hash-005", "failure_type": "i18n_key_conflict", "date": "2026-07-02" }
  ],
  "current_state": "当前约束：翻译文件变更不归前端处理",
  "proposed_change": "新增：添加翻译 key 时必须在 i18n 中注册映射关系",
  "expected_effect": "减少翻译 key 遗漏次数",
  "rollback_plan": "3 次评估内未改善 → 回滚变更"
}
```

- 无提案的治理变更视为无效变更，禁止执行

## 版本可追溯

- 每一次治理变更必须记录到 `.trae/governance-changelog/` 目录下
- 变更记录文件命名规则：
  ```
  .trae/governance-changelog/{file_path_sanitized}-{yyyymmdd}-{v{n}}.md
  示例：execution-plan-frontend-constraint-20260701-v2.md
  ```
- 变更记录包含：
  - 变更时间
  - 变更类型（add/modify/remove）
  - 变更前后的内容对比（diff）
  - 触发变更的提案 ID
  - 证据来源（关联的任务 ID）
- 不允许覆盖历史记录，旧版本必须可查询

## 不自改

- **evolution/ 目录下的文件自身禁止被 evolution 自动修改**
- 以下文件不可被 evolution 自动变更：

  ```
  .trae/evolution/constraint.md
  .trae/evaluation/loop-governance.md
  .trae/rules/language.md
  .trae/rules/interaction.md
  .trae/rules/ai-safety.md
  .trae/runtime/router.md
  ```

- 这些文件如需修改，必须由人工完成
- evolution 可以输出"建议修改"的报告到路径，但不执行修改

## 回滚机制

- 每次治理变更后，系统标记为"待验证"状态
- 变更生效后的 **3 次同类任务** 作为验证期
- 如果验证期内：
  - 同类失败次数没有减少，或反而增加 → 自动回滚变更
  - 引入了新的失败模式 → 自动回滚变更
  - 效果有显著改善（失败减少 ≥ 50%）→ 标记为"已验证"
- 回滚后系统输出回滚报告，说明回滚原因及建议的替代方案

## 数据收集范围

- 每次任务完成（无论通过/不通过），都必须向 evolution 系统提交经验数据
- 提交的数据最小集合：

```json
{
  "task_id": "task-hash-001",
  "domain": "frontend",
  "task_type": "create",
  "evaluation_result": "pass / conditional_pass / fail",
  "failed_items": [],
  "cycle_count": 2,
  "subagent_used": "ui-designer",
  "templates_used": ["frontend/page.md", "frontend/component.md"],
  "key_observations": "开发顺利，无阻塞"
}
```

- 不得选择性提交数据（只交失败的、不交成功的）
- 成功和失败的经验同等重要——成功说明当前治理有效，失败说明需要改进

## 进化不破坏

- 治理变更不得破坏**现有治理框架的结构一致性**
- 以下情况禁止：
  - 删除一个目录下所有文件（如清空某个领域的所有约束）
  - 修改文件格式或结构导致原有引用失效
  - 引入与现有规则自相矛盾的条款

### 矛盾检测方法

由于完全自动化的语义矛盾检测不可行，使用以下启发式方式辅助判断：

1. **关键词对立检测** — 检查提案中是否出现以下对立词组组合（与目标文件中已有的规则对比）：

   | 关键词 A          | 关键词 B          | 可能的矛盾              |
   | ----------------- | ----------------- | ----------------------- |
   | "必须用 / 优先用" | "禁止用 / 不得用" | 同一工具/方法的对立指令 |
   | "先 A 后 B"       | "先 B 后 A"       | 执行顺序矛盾            |
   | "必须验证"        | "无需验证"        | 验证要求对立            |
   | "用 A 替代 B"     | "用 B 替代 A"     | 替代关系矛盾            |

2. **范围重叠检测** — 如果提案和现有规则针对同一文件类型 / 同一目录 / 同一命令，检查规则方向是否一致

3. **检出矛盾后的动作**：
   - 如果检测到明确对立 → 阻止提案，输出"矛盾详情"，要求人工介入
   - 如果无法确认但是可疑 → 标记"可疑矛盾"，在提案中附带冲突片段，暂缓自动应用

4. 安全类约束不与任何规则比较——安全约束永远优先

- 每次变更前，必须检查 `runtime/` `workflows/` `execution-plan/` `execution-engine/` `evaluation/` `templates/` 中引用该文件的位置是否需要同步更新
