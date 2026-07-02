# write-guide — 经验数据写入模板 v3

## 何时写入

每次编码任务完成后，按 `ai-safety.md` 收尾清单第 2 步执行。

## 文件命名

```
memory/experience/{task-id}.json
```

`task-id` 用简洁的英文 slug，如 `learn-page`、`fix-auth-bug`、`add-docker-ci`。

## JSON 模板

```json
{
  "task_id": "learn-page",
  "date": "2026-07-02",
  "domain": "frontend",
  "description": "学习与资料页面",
  "files_created": 10,
  "files_modified": 6,
  "files_deleted": 0,
  "verification": {
    "lint": true,
    "typecheck": true,
    "format": true
  },
  "rules": {
    "triggered": [
      "document-query",
      "frontend-types",
      "frontend-i18n",
      "frontend-styles",
      "monorepo"
    ],
    "relevant": [
      "code-style",
      "comments",
      "document-query",
      "frontend-comments",
      "frontend-i18n",
      "frontend-styles",
      "frontend-types",
      "monorepo",
      "naming",
      "review",
      "security"
    ],
    "unused_relevant": [
      "code-style",
      "comments",
      "frontend-comments",
      "naming",
      "review",
      "security"
    ],
    "coverage_pct": 45
  },
  "outcome": "pass",
  "notes": ""
}
```

**关键约束**: `triggered ⊆ relevant`，`unused_relevant = relevant - triggered`。
`coverage_pct = trigged.length / relevant.length × 100`。

## 字段说明

| 字段                    | 类型     | 必填 | 说明                                                     |
| ----------------------- | -------- | ---- | -------------------------------------------------------- |
| `task_id`               | string   | ✅   | 任务英文 slug                                            |
| `date`                  | string   | ✅   | 完成日期 YYYY-MM-DD                                      |
| `domain`                | string   | ✅   | frontend/backend/shared/devops/ai/quality                |
| `description`           | string   | ✅   | 任务中文简述                                             |
| `files_created`         | number   | ✅   | 新建文件数                                               |
| `files_modified`        | number   | ✅   | 修改文件数                                               |
| `files_deleted`         | number   |      | 删除文件数（可选，默认为 0）                             |
| `verification`          | object   | ✅   | lint/typecheck/format 三项结果                           |
| `rules.triggered`       | string[] | ✅   | 显式触发（Read 过）的规则文件名，必须为 relevant 的子集  |
| `rules.relevant`        | string[] | ✅   | 本任务相关的全部规则文件名（含已触发 + 未触发）          |
| `rules.unused_relevant` | string[] |      | 相关但未触发的规则（= relevant - triggered），可为空数组 |
| `rules.coverage_pct`    | number   | ✅   | triggered.length / relevant.length × 100                 |
| `outcome`               | string   | ✅   | pass / fail / partial                                    |
| `notes`                 | string   |      | 额外备注（失败原因等）                                   |

## 检查清单

- [ ] 文件名不含中文、空格
- [ ] `verification` 三项都有值（true/false）
- [ ] `triggered` 是 `relevant` 的子集
- [ ] `coverage_pct` 计算正确（triggered 数 / relevant 数 × 100）
- [ ] JSON 格式合法
