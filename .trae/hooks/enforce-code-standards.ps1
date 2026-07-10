$standards = @"
写代码前请先阅读以下规范：
- `.trae/rules/naming.md` — 命名规范（文件名、变量名、类型名）
- `.trae/rules/comments.md` — 注释规范（何时写、如何写）
- `.trae/rules/agent-catalog.md`（安全约束章节）— Agent 安全与 MCP 约束
"@

$result = @{
  hookSpecificOutput = @{
    hookEventName      = 'PreToolUse'
    permissionDecision = 'allow'
    additionalContext  = $standards
  }
}

Write-Output ($result | ConvertTo-Json -Compress)
