---
alwaysApply: false
description: 任务日志追踪规范，UserPromptSubmit 和 Stop 时注入
---

# Agent 任务日志追踪

本文件定义了两类日志写入规则，统一记录到 `.trae/agents/logs/agent-invoke.log`。

## Subagent 调用日志

适用场景：每次通过 `Task` 工具启动 Subagent 时触发。

写入格式：

```
[yyyy-MM-dd HH:mm:ss] {agent-name} | 用户请求：{一句话描述任务}
```

示例：

```
[2026-07-18 09:00] backend-architect | 用户请求：实现位置服务搜索接口
[2026-07-18 09:05] test-completer | 用户请求：为 LocationService 写单元测试
```

执行方式：

- 首次使用时通过 `Read` 确认日志文件存在
- 后续使用 `Edit` 在文件末尾追加
- 如果日志文件尚不存在，通过 `Write` 创建并写入 header（见下文）
- 写入后无需通知用户，属于后台记录

## 主 Agent 会话日志

适用场景：每次 Stop 触发时（一轮响应结束），如果本轮涉及工具调用写入。

写入格式：

```
[yyyy-MM-dd HH:mm:ss] [MAIN] 任务摘要 | 工具调用 {N} 次
```

示例：

```
[2026-07-18 09:00] [MAIN] 修复 QWeather API 路径 | 工具调用 5次
[2026-07-18 17:00] [MAIN] 复盘报告生成 | 工具调用 12次 | Subagent 0次
```

执行方式：使用 `Edit` 在文件末尾追加。如果日志文件尚不存在，使用 `Write` 创建。

## 日志文件 header

首次创建时写入以下 3 行 header：

```
# 日志文件说明：记录 Subagent 被调用和主 Agent 任务执行情况
# Subagent 格式：[yyyy-MM-dd HH:mm:ss] agent-name | 用户请求：关键词描述
# 主 Agent 格式：[yyyy-MM-dd HH:mm:ss] [MAIN] 任务摘要 | 工具调用 {N} 次
```

## 注意事项

- Subagent 调用日志和主 Agent 会话日志互不冲突，各自独立写入
- 如果本轮既启动了 Subagent 又执行了主 Agent 任务，两条都写入
- 写入内容保持简洁，不包含过于细节的信息
- 日志文件编码为 UTF-8
