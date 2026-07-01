# Evaluation — 任务评估与循环治理

## 职责

`evaluation/` 负责在执行完成后检查成果质量，决定任务是否通过，以及在不通过时驱动重试或重新规划。

```
execution-engine/{domain}/   ← 执行完成
          │
          ▼
evaluation/{domain}/          ← 评估：质量门禁 + 完整性检查
          │
     ┌────┴────┐
     ▼         ▼
  通过       不通过
     │         │
     ▼         ▼
  Finished   loop-governance.md
                  │
            ┌─────┴─────┐
            ▼           ▼
       re-execute    re-plan  → 人工
```

---

## 文件结构

```
.trae/evaluation/
├── README.md                # 本文档
├── constraint.md            # 通用评估约束（含静默成功检测）
├── heuristic.md             # 通用评估流程
├── policy.md                # 通用评估决策
├── loop-governance.md       # 循环治理 — 重试/重新规划/人工介入
├── frontend/
│   ├── constraint.md        # 前端 — 组件完整性、类型检查
│   ├── heuristic.md         # 前端 — 各 task-type 检查项
│   └── policy.md            # 前端 — 风格偏差、回归策略
├── backend/
│   ├── constraint.md        # 后端 — API 契约、Migration 验证
│   ├── heuristic.md         # 后端 — 各场景检查清单
│   └── policy.md            # 后端 — 数据变更、错误处理评估
├── devops/
│   ├── constraint.md        # DevOps — CI 语法、部署验证
│   ├── heuristic.md         # DevOps — 配置变更检查项
│   └── policy.md            # DevOps — 环境偏差、依赖风险
├── shared/
│   ├── constraint.md        # 共享 — 类型导出、翻译覆盖
│   ├── heuristic.md         # 共享 — 类型/i18n/lint 检查
│   └── policy.md            # 共享 — Breaking Change 判定
├── ai/
│   ├── constraint.md        # AI — 密钥安全、输出格式
│   ├── heuristic.md         # AI — 集成验证检查项
│   └── policy.md            # AI — 质量降级判定
└── quality/
    ├── constraint.md        # 质量 — 测试覆盖、安全门禁
    ├── heuristic.md         # 质量 — test/review/perf 检查
    └── policy.md            # 质量 — 缺陷定级、修复决策
```

---

## 评估流程

| 步骤       | 内容                                        |
| ---------- | ------------------------------------------- |
| ① 加载约束 | 读取 evaluation/{domain}/constraint.md      |
| ② 清单对比 | 对照 workflow 的输出清单逐项确认            |
| ③ 质量门禁 | check-types / lint / build / test           |
| ④ 回归检查 | 确保已有功能未被破坏                        |
| ⑤ 范围检查 | 没有越界创建/修改文件                       |
| ⑥ 输出报告 | 结构化评估结论                              |
| ⑦ 写入经验 | 无论通过与否，写入经验数据供 evolution 收集 |

---

## 循环治理（loop-governance.md）

当评估不通过时进入循环治理：

- **re-execute（≤3 次）** → 修复问题后重新评估
- **re-plan（≤2 次）** → 方案有根本问题，重新规划后执行
- **人工介入** → 超出上限时输出完整报告升级给人工
- 附带检测：工具去重、语义循环、静默失败、目标锚定、成本熔断

---

## 行为约束

- 评估不通过不得标记任务完成
- 每次循环必须比上次有可量化的改进
- 安全类约束不通过直接阻断，不可豁免
- 评估报告必须写入经验数据，即使任务失败
