---
alwaysApply: false
description: 当任务涉及 AI Agent 工具调用、Shell 命令执行或网络请求时加载
---

# Agent 工具权限白名单强制约束

- AI Agent 只能调用白名单内的工具
- 文件写入工具（Write/Edit/SearchReplace）不得用于修改 `.trae/` 目录下的治理文件
- Shell 命令执行工具不得运行 `rm -rf`、`git push --force`、`drop table` 等破坏性命令
- 网络请求工具不得访问内网地址（`127.0.0.1`、`10.x`、`172.16-31.x`、`192.168.x`）
- 工具调用必须记录日志，包含工具名、参数摘要、返回状态
- 白名单外的工具调用必须被拒绝
