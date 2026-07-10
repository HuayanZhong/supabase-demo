$inputJson = [Console]::In.ReadToEnd()
$parsed = $inputJson | ConvertFrom-Json
$lastMsg = $parsed.last_assistant_message

$hasTaskLog = $lastMsg -match '任务日志'

if (-not $hasTaskLog) {
  $result = @{
    decision = 'block'
    reason   = '请先输出[任务日志]（按 .trae/rules/task-logging.md 格式），并完成质量验收（按 .trae/rules/agent-collaboration.md 的 4c 章节）'
  }

  Write-Output ($result | ConvertTo-Json -Compress)
  exit 0
}

# 日志已输出，允许停止
$result = @{
  hookSpecificOutput = @{
    hookEventName = 'Stop'
  }
}
Write-Output ($result | ConvertTo-Json -Compress)
