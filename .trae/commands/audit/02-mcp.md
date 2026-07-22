# Step 2: MCP 审计

> **Skill 注入**：开始本步骤前，先调用 `Skill("TRAE-code-review")` 获取审计方法论框架（范围确定+上下文收集），然后按以下逻辑执行。

检查 MCP 工具描述文件存在性。

## 执行

- 如果前置准备中 `.trae/mcp.json` 标记为"跳过"，此步骤直接跳过
- 读取 `.trae/mcp.json` 中 `mcpServers` 对象下的所有 key，记录 MCP 服务器名列表
- 查找 MCP 工具描述目录：
  1. 读取 `.trae/mcp.json` 中每个 MCP 服务器的 `transport` 或 `url` 等配置，定位工具描述文件目录
  2. 工具描述文件通常位于系统用户目录下的 `.trae-cn/mcps/{project_hash}/{server_name}/tools/` 路径
  3. 如无法自动定位，执行：`Get-ChildItem "$env:USERPROFILE\.trae-cn\mcps\*\$server_name\tools\*.json"` 搜索
- 检查每个 MCP 服务器的工具描述 `.json` 文件是否存在
- 报告缺失的工具描述文件（需人工介入补全）

## 输出摘要

```
[{步骤2 MCP}] 已注册 {N} 个 | 工具描述正常 {N} 个 | 异常 {N} 个
```
