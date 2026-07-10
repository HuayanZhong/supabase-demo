$reminder = "> 工具已执行，请在 Stop 阶段按 .trae/rules/task-logging.md 输出结构化日志"

$result = @{
  hookSpecificOutput = @{
    hookEventName     = 'PostToolUse'
    additionalContext = $reminder
  }
}

Write-Output ($result | ConvertTo-Json -Compress)
