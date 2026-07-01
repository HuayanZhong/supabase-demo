# PATTERN-001 — 治理框架强制机制

## 元数据

| 字段         | 值                                 |
| ------------ | ---------------------------------- |
| pattern_id   | PATTERN-001                        |
| type         | governance                         |
| name         | 治理框架强制机制                   |
| created_at   | 2026-07-02                         |
| source       | META-001 + BUG-001（Jaccard=0.85） |
| status       | draft                              |
| verify_count | 0/3                                |

## 问题描述

文档级治理框架（.trae/）无法保证 AI 实际执行时走完整流程。表现为：

- 任务执行时不输出 [ROUTE:parse] 日志
- 不触发守卫节点检查
- 不写入 experience/sessions
- 不走 evaluation 门禁

## 触发条件

当**同时满足**以下全部条件时，应应用此模式（AND 逻辑，与 router.md Fast-Path 判定一致）：

- 任务为低风险（重命名/格式修复/文档修订/查询/解释/单文件编辑）
- 任务无文件创建/删除（重命名例外，需破坏性守卫确认）
- 任务无跨域影响（仅涉及单一领域，无依赖链）
- 无破坏性命令（不含 delete/rm/drop/清理 等关键词，重命名例外）
- 用户未要求完整治理流程（未明确要求"走完整流程"/"严格治理"）

## 推荐方案

### Fast-Path 路由

走快路径，仅经过路由 + 守卫 + 日志，跳过 execution-plan 和 evaluation。每步独立一行日志（符合 logging.md 规范）：

```
[ROUTE:parse]       START  | 解析用户请求           | input=用户输入
[ROUTE:match]       OK     | 匹配领域               | domain=xxx;agent=xxx
[ROUTE:fast-path]   OK     | 走快路径               | reason=低风险;type=重命名
[GUARD:scope]       WARN   | 范围守卫降级           | no_plan=true;action=记录
[GUARD:destructive] WARN   | 破坏性守卫确认         | action=重命名;confirmed=true
[ENGINE:done]       END    | 执行完成               | files=N;tools=N;errors=0
[MEM:write]         OK     | 写入会话摘要           | path=.trae/memory/sessions/
```

### 强制机制（分级）

| 级别 | 机制              | 强制力         | 状态   |
| ---- | ----------------- | -------------- | ------ |
| 1    | 会话自检          | 低（依赖 AI）  | 已落地 |
| 2    | Trae IDE 规则触发 | 中（依赖 IDE） | 提案   |
| 3    | husky pre-commit  | 高（硬强制）   | 待确认 |

## 反模式

以下场景不得走 fast-path，必须走完整 7 层（与 router.md "不走 Fast-Path 的场景"一致）：

- 数据库变更（migration/seed/schema）
- 部署/CI/CD 配置
- 密钥/凭证/安全相关
- 跨领域依赖链
- 3 个以上文件修改
- 用户明确要求"严格治理"/"完整流程"
- evolution 自迭代变更

## 验证记录

| 日期 | 任务 | fast-path 触发 | 结果   |
| ---- | ---- | -------------- | ------ |
| -    | -    | -              | 待验证 |

## 关联

- 关联 bug：BUG-001、META-001
- 关联文件：.trae/runtime/router.md、.trae/logging.md、.trae/execution-engine/constraint.md
- 关联模式：PATTERN-002（守卫规则可执行性）
