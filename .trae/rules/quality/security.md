---
alwaysApply: false
description: 安全强制约束
scene: security
---

# 安全约束

- 用户输入必须经过验证和转义，禁止直接拼接
- 禁止将密钥、密码、token 写入代码或 config 文件中
- 禁止 CORS 配置允许所有来源（`Access-Control-Allow-Origin: *`）
