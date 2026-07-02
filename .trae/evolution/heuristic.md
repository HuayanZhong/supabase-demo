# Heuristic — 进化流程 v3

## 概述

进化周期从"被动等待 agent 记得"改为"数据驱动自动触发"。
触发源：`memory/experience/` 下有效经验文件的累积数量。

## 触发条件

| 阶段 | 触发条件                               | 产出                        |
| ---- | -------------------------------------- | --------------------------- |
| 收集 | 每次任务完成后（alwaysApply 清单要求） | `experience/{task-id}.json` |
| 提议 | `experience/` 下有效文件 ≥ 5 条        | agent 在对话中提议聚合      |
| 聚合 | 人工确认提议后                         | 聚合报告                    |
| 分析 | 聚合完成后                             | 根因 + 模式 + 规则变更检测  |
| 提案 | 分析完成后                             | 改进方案（待人工确认）      |
| 应用 | 提案确认后                             | 修改治理文件（每次仅 1 个） |
| 验证 | 应用后连续 3 个任务                    | 观察效果，决定保留或回滚    |

## 聚合分析模板

```
Evolution 聚合报告 ({from} ~ {to})
  任务总数: {total}
  按领域: frontend={n}, backend={n}, shared={n}, devops={n}, ai={n}
  失败数: {failures}
  规则覆盖率均值: {avg_pct}%
  未触发最多的规则: [{rule1}, {rule2}, {rule3}]
  建议:
    - {具体建议 1}
    - {具体建议 2}
```

## 提案约束

- 必须基于聚合报告中的真实数据
- 单次只改 1 个治理文件
- 规则覆盖率 < 30% 的领域优先提议
- 修改 `ai-safety.md` 必须人工额外确认

## 进化日志

```
[EVOLVE:collect]  收集经验数据 → experience/{task-id}.json
[EVOLVE:propose]  提议聚合分析 → experience/ 有效文件已达 {N} 条
[EVOLVE:aggregate] 聚合完成 → 报告
[EVOLVE:analyze]   分析完成 → 根因 + 模式
[EVOLVE:propose]   生成提案 → 待人工确认
[EVOLVE:apply]     应用变更 → 已修改 {file}
[EVOLVE:verify]    验证中 → 已观察 {n}/3 个任务
```
