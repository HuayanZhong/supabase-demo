# 日志规范 v3（精简版）

## 原则

日志只有两个用途：给用户看的结果、给 agent 用的经验数据。
v2 的 10 层 180 行格式定义过度设计，v3 砍到只保留追踪路径摘要。

## 追踪路径摘要

**任务完成后必须在对话中输出**，格式如下：

```
任务追踪 (task: "{任务描述}")
  文件: 创建 N 个 / 修改 M 个
  验证: lint ✅/❌ | typecheck ✅/❌ | format ✅/❌
  规则: 触发 N 个 / 相关 M 个 ({百分比}%)
  结论: ✅ 通过 / ❌ 不通过 / ⚠️ 人工介入
```

### 示例

```
任务追踪 (task: "学习与资料页面")
  文件: 创建 10 个 / 修改 6 个
  验证: lint ✅ | typecheck ✅ | format ✅
  规则: 触发 5 / 相关 11 (45%)
  结论: ✅ 通过
```

## 经验数据文件

任务完成后写入 `memory/experience/{task-id}.json`，格式规范见 `memory/write-guide.md`。

字段摘要：

```json
{
  "task_id": "learn-page",
  "date": "2026-07-02",
  "domain": "frontend",
  "files_created": 10,
  "files_modified": 6,
  "verification": { "lint": true, "typecheck": true, "format": true },
  "rules": {
    "triggered": ["document-query", "frontend-types"],
    "relevant": ["code-style", "document-query", "frontend-types"],
    "unused_relevant": ["code-style"],
    "coverage_pct": 67
  },
  "outcome": "pass"
}
```
