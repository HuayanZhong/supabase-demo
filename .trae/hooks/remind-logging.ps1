# 指令流程或手动压缩上下文期间，创建 .trae/.hooks-mute 可抑制此提醒
$muteFile = Join-Path $PSScriptRoot ".." ".hooks-mute"
if (Test-Path $muteFile) {
  $result = @{
    hookSpecificOutput = @{
      hookEventName     = 'PostToolUse'
      additionalContext = ""
    }
  }
  Write-Output ($result | ConvertTo-Json -Compress)
  exit
}

$reminder = "> 工具已执行，请在 Stop 阶段按 .trae/rules/task-logging.md 输出结构化日志"

$result = @{
  hookSpecificOutput = @{
    hookEventName     = 'PostToolUse'
    additionalContext = $reminder
  }
}

Write-Output ($result | ConvertTo-Json -Compress)
