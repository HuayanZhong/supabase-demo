# Step 4: Hooks 审计

> **Skill 注入**：开始本步骤前，先调用 `Skill("TRAE-code-review")` 获取审计方法论框架（范围确定+上下文收集），然后按以下逻辑执行。

检查 hooks 存在性、配置合法性及 AGENTS.md 一致性。

## 4a. 存在性检查

- 读取 `.trae/hooks.json`，解析 JSON 结构
- 对每个 hook 事件（`SessionStart`、`UserPromptSubmit`、`PreToolUse`、`PostToolUse`、`Stop`、`Notification`）：
  - 遍历 hooks 数组，提取每个 hook 的 `command` 值
  - `command` 值为 `powershell ... -File <path>` 格式时，提取 `<path>` 部分
  - 验证提取的文件路径指向的文件是否存在
- 对每个 `.ps1` 脚本文件，扫描内容中匹配正则 `\.trae/rules/[a-zA-Z0-9_\-/]+\.md` 的路径，验证目标文件存在
- 扫描 `.trae/hooks/` 下所有 `.ps1` 文件，与 `hooks.json` 中所有 command 提取的文件名对比：
  - 未在 `hooks.json` 中出现的 → 报告为孤立文件
- 检查是否有 hook 事件类型在 `hooks.json` 中完全不存在

## 4b. hooks.json 配置合法性

- 检查 `matcher` 模式：
  - `DeleteFile|Edit|Write`：确认至少覆盖这三个写工具
  - `mcp__.*__execute_sql`：确认该模式只匹配预期 MCP 工具名
- 验证 `loop_limit` 字段：仅应出现在 `Stop` 等需要重试的事件中
- 验证 `timeout` 字段（如存在）：取值在 1000ms ~ 30000ms 范围内

## 4c. AGENTS.md ↔ hooks.json 一致性

- 从 `AGENTS.md` 中提取"Hooks 生命周期与规则注入"代码块中每一行，解析为 `{事件名, 脚本文件名, [规则列表]}` 三元组
- 将 `hooks.json` 配置归一化为同样的三元组列表（规则列表从 `.ps1` 脚本中提取）
- 逐行对比：事件名、脚本文件名、规则列表（作为集合对比，忽略顺序）必须一致

## 输出摘要

```
[{步骤4 Hooks}] 事件绑定 {N} 个 | .ps1已注册 {N} / 孤立 {N} | 规则引用异常 {N} 处 | 配置问题 {N} 处
```
