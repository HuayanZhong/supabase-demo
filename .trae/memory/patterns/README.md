# patterns/ — 模式库

## 用途

记录在开发过程中被多次验证有效的模式，供后续任务直接复用。支持两类模式：

- **code（代码模式）** — 组件组合、API 结构、错误处理等代码级模式
- **governance（治理模式）** — 治理框架自身的强制机制、守卫规则等元模式

## 数据格式

### code 模式（JSON 文件）

文件名：`{pattern_id}.json`（如 `PTN-001.json`）

```json
{
  "pattern_id": "PTN-001",
  "type": "code",
  "name": "表单组件模式",
  "description": "标准表单使用 UForm + UInput 组合",
  "files_pattern": ["**/components/**/*.vue"],
  "code_structure": ["UForm", "UFormGroup", "UInput", "UButton"],
  "success_count": 5,
  "first_seen": "2026-06-20",
  "last_seen": "2026-07-01",
  "status": "active"
}
```

### governance 模式（Markdown 文件）

文件名：`{pattern_id}.md`（如 `PATTERN-001.md`）

```markdown
# {pattern_id} — {name}

## 元数据

| 字段         | 值               |
| ------------ | ---------------- |
| pattern_id   | PATTERN-XXX      |
| type         | governance       |
| name         | 模式名称         |
| created_at   | 创建日期         |
| source       | 来源（bug/聚合） |
| status       | active           |
| verify_count | N/3              |

## 问题描述

## 触发条件

## 推荐方案

## 反模式

## 验证记录

## 关联
```

## 必填字段对照

| 字段           | code 模式 | governance 模式    |
| -------------- | --------- | ------------------ |
| pattern_id     | ✅ 必填   | ✅ 必填            |
| type           | ✅ 必填   | ✅ 必填            |
| name           | ✅ 必填   | ✅ 必填            |
| description    | ✅ 必填   | （在"问题描述"段） |
| files_pattern  | ✅ 必填   | ❌ 不适用          |
| code_structure | ✅ 必填   | ❌ 不适用          |
| success_count  | ✅ 必填   | ❌ 不适用          |
| first_seen     | ✅ 必填   | （用 created_at）  |
| last_seen      | ✅ 必填   | （用验证记录）     |
| status         | ✅ 必填   | ✅ 必填            |
| source         | ❌ 选填   | ✅ 必填            |
| verify_count   | ❌ 选填   | ✅ 必填            |
| 触发条件       | ❌ 选填   | ✅ 必填            |
| 推荐方案       | ❌ 选填   | ✅ 必填            |
| 反模式         | ❌ 选填   | ✅ 必填            |
| 验证记录       | ❌ 选填   | ✅ 必填            |
| 关联           | ❌ 选填   | ✅ 必填            |

## 入库条件

| 类型       | 入库条件                                                 |
| ---------- | -------------------------------------------------------- |
| code       | 同一模式出现 ≥ 3 次，每次评估为 pass，有明确代码结构定义 |
| governance | 来源为已修复的 P0/P1 bug 或聚合分析，verify_count 达 3/3 |

governance 模式可在 verify_count 未达 3/3 时以 `status: draft` 预入库，达 3/3 后转 `active`。

## 使用场景

- execution-plan 阶段参考模式库做规划
- execution-engine 阶段直接套用已验证的 code 模式
- 治理框架迭代时参考 governance 模式避免重蹈覆辙
- evolution 聚合时用 Jaccard 相似度合并或新增模式

## 保留策略

- active 模式永久保留
- deprecated 模式保留 60 天后归档
- draft 模式 14 天未转 active 则删除
