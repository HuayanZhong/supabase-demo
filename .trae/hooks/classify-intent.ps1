$router = @"
请阅读 `.trae/rules/agent-collaboration.md` 的「0. 任务路由决策」章节，完成意图分类、Agent 选型和任务摘要。
"@

$result = @{
  hookSpecificOutput = @{
    hookEventName     = 'UserPromptSubmit'
    additionalContext = $router
  }
}

Write-Output ($result | ConvertTo-Json -Compress)
