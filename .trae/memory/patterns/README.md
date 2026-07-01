# patterns/ — 成功模式库

## 用途

记录在开发过程中被多次验证有效的代码模式、组件组合、API 结构等，供后续任务直接复用。

## 数据格式

```json
{
  "pattern_id": "PTN-001",
  "name": "表单组件模式",
  "description": "标准表单使用 UForm + UInput 组合",
  "files_pattern": ["**/components/**/*.vue"],
  "code_structure": ["UForm", "UFormGroup", "UInput", "UButton"],
  "success_count": 5,
  "first_seen": "2026-06-20",
  "last_seen": "2026-07-01",
  "status": "active" // active | deprecated
}
```

## 入库条件

- 同一模式出现 ≥ 3 次
- 每次使用都被评估为 pass
- 模式有明确的代码结构定义

## 使用场景

- execution-plan 阶段参考模式库做规划
- execution-engine 阶段直接套用已验证的模式
