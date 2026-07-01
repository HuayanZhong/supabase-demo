# PATTERN-001 — 治理框架强制机制

## 元数据

| 字段         | 值                                 |
| ------------ | ---------------------------------- |
| pattern_id   | PATTERN-001                        |
| name         | 治理框架强制机制                   |
| created_at   | 2026-07-02                         |
| source       | META-001 + BUG-001（Jaccard=0.85） |
| status       | active                             |
| verify_count | 0/3                                |

## 问题描述

文档级治理框架（.trae/）无法保证 AI 实际执行时走完整流程。表现为：

- 任务执行时不输出 [ROUTE:parse] 日志
- 不触发守卫节点检查
- 不写入 experience/sessions
- 不走 evaluation 门禁

## 触发条件

当满足以下任一条件时，应应用此模式：

- 任务为低风险（重命名/格式修复/文档修订/查询/解释/单文件编辑）
- 任务无文件创建/删除（重命名例外）
- 任务无跨域影响
- 用户未要求完整治理流程

## 推荐方案

### Fast-Path 路由

走快路径，仅经过路由 + 守卫 + 日志，跳过 execution-plan 和 evaluation。

```
[ROUTE:parse] → [ROUTE:match] → [ROUTE:fast-path] OK → [GUARD:scope] WARN → [GUARD:destructive] → 执行 → [ENGINE:done] → [MEM:write]
```

### 强制机制（分级）

| 级别 | 机制              | 强制力         | 状态   |
| ---- | ----------------- | -------------- | ------ |
| 1    | 会话自检          | 低（依赖 AI）  | 已落地 |
| 2    | Trae IDE 规则触发 | 中（依赖 IDE） | 提案   |
| 3    | husky pre-commit  | 高（硬强制）   | 待确认 |

## 反模式

以下场景不得走 fast-path，必须走完整 7 层：

- 数据库变更（migration/seed/schema）
- 部署/CI/CD 配置
- 密钥/凭证/安全相关
- 跨领域依赖链
- 3 个以上文件修改
- evolution 自迭代变更

## 验证记录

| 日期 | 任务 | fast-path 触发 | 结果   |
| ---- | ---- | -------------- | ------ |
| -    | -    | -              | 待验证 |

## 关联

- 关联 bug：BUG-001、META-001
- 关联文件：runtime/router.md、logging.md
- 关联模式：PATTERN-002（守卫规则可执行性）
