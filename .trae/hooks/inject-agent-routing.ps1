# UserPromptSubmit 注入：任务路由决策 + 执行规范
# 用户提交 prompt 时注入路由规则和执行规范

$result = @{
  hookSpecificOutput = @{
    hookEventName     = 'UserPromptSubmit'
    additionalContext = @"
请阅读 .trae/rules/agent/routing.md（任务路由决策）
请阅读 .trae/rules/agent/execution.md（执行规范）
"@
  }
}
Write-Output ($result | ConvertTo-Json -Compress)
