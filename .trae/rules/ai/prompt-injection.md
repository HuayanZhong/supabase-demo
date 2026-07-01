---
alwaysApply: false
description: 当任务涉及 LLM 提示词构造、用户输入处理或 RAG 检索结果整合时加载
---

# Prompt 注入防护强制约束

- 用户输入不得直接拼接进 system prompt
- 用户输入必须使用边界标记包裹，如 `<user_input>...</user_input>`
- RAG 检索结果必须标记为 `<retrieved_content>` 并与用户指令隔离
- LLM 输出包含 `ignore previous`、`system:`、`new instructions` 等注入特征时必须拦截
- Agent 工具调用参数必须经过结构化校验，不得直接执行 LLM 生成的命令字符串
- 跨边界内容必须与系统指令严格分离
