$inputJson = [Console]::In.ReadToEnd()
$parsed = $inputJson | ConvertFrom-Json
$lastMsg = $parsed.last_assistant_message

$hasTaskLog = $lastMsg -match '任务日志'

if (-not $hasTaskLog) {
  $checklist = @"
## 最终验收

1. 输出前请阅读 `.trae/rules/task-logging.md`，按格式输出结构化日志
2. 质量验收请阅读 `.trae/rules/agent-collaboration.md` 的「4c 结果质量校验」章节
"@

  $result = @{
    decision = 'block'
    reason   = '请先输出[任务日志]（按 .trae/rules/task-logging.md 格式），并完成质量验收（按 .trae/rules/agent-collaboration.md 的 4c 章节）'
    hookSpecificOutput = @{
      hookEventName     = 'Stop'
      additionalContext = $checklist
    }
  }

  Write-Output ($result | ConvertTo-Json -Compress)
  exit 0
}

$result = @{
  hookSpecificOutput = @{
    hookEventName = 'Stop'
  }
}
Write-Output ($result | ConvertTo-Json -Compress)
