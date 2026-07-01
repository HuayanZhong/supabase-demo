---
alwaysApply: false
description: 当任务涉及 API Key、密钥、token、凭证处理或 LLM 服务集成时加载
---

# AI 集成密钥管理强制约束

- API key、secret、token 不得硬编码到源码
- 密钥必须通过环境变量或密钥管理服务读取
- `.env` 文件不得提交到 git，必须在 `.gitignore` 中显式忽略
- 日志中不得打印完整密钥，仅允许显示前 4 位字符加 `***` 掩码
- 前端代码不得包含任何后端密钥或服务端凭证
- 提交前必须检查 staged changes 中是否存在密钥泄漏
- 已泄露的密钥必须立即停止使用并轮换
