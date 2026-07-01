# profile/ — 用户偏好与决策记录

## 用途

记录用户在开发过程中明确表达或通过多次纠正体现出的偏好，供后续会话直接引用。

## 数据格式

```json
{
  "timestamp": "2026-07-01T10:30:00Z",
  "source": "task-hash-001",
  "preference": "使用 RESTful 命名而非 GraphQL",
  "evidence": "用户在 review 时将 `/goals` 改为 `/api/goals`",
  "confidence": "confirmed" // confirmed | inferred | deprecated
}
```

## 写入条件

- 用户明确表达偏好（如"我不喜欢用 scoped css"）
- 用户多次纠正同一类问题（≥ 2 次）
- 用户在 review 中表达了明确的选择倾向

## 读取场景

- execution-plan 阶段参考用户偏好做技术选型
- execution-engine 阶段参考用户偏好决定代码风格
