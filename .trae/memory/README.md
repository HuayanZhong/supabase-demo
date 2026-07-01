# Memory — 跨对话记忆系统

## 定位

与 Trae 内置记忆（全局/项目各 20 条）互补，提供结构化、无上限的治理经验存储。

```
Trae 内置记忆                 .trae/memory/
──────────────                ──────────────
有限（20条）                  无上限
自然语言摘要                  结构化数据
自动管理                     显式读写（constraint/heuristic/policy 控制）
跨所有项目                    仅当前项目
```

## 数据流

```
任务完成 → sessions/（上下文归档）
              ↓
evolution 聚合 → experience/（经验快照）
                   ↓
              分析 → patterns/（成功模式）
                   → profile/（用户偏好）
                   → Trae 项目记忆（摘要同步）
```

## 目录结构

| 目录          | 内容               | 保留期 | 读写方                            |
| ------------- | ------------------ | ------ | --------------------------------- |
| `profile/`    | 用户偏好/决策记录  | 永久   | evolution 写，execution-plan 读   |
| `experience/` | evolution 经验快照 | 60 天  | evolution 读写                    |
| `patterns/`   | 识别到的成功模式   | 永久   | evolution 写，execution-engine 读 |
| `sessions/`   | 跨会话上下文摘要   | 30 天  | 任务收尾逻辑写，新会话启动时读    |
