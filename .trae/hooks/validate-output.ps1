$inputJson = [Console]::In.ReadToEnd()
$parsed = $inputJson | ConvertFrom-Json
$lastMsg = $parsed.last_assistant_message

$hasTaskLog = $lastMsg -match '任务日志'

if (-not $hasTaskLog) {
  $result = @{
    decision = 'block'
    reason   = '请先输出[任务日志]（按 .trae/rules/task-logging.md 格式），并完成质量验收（按 .trae/rules/agent-catalog.md 质量验证章节）'
  }

  Write-Output ($result | ConvertTo-Json -Compress)
  exit 0
}

# 清理会话状态文件，避免状态泄漏到下一会话
$sessionModeFile = ".trae/.session-mode"
if (Test-Path $sessionModeFile) { Remove-Item $sessionModeFile -Force }

# 日志已输出，允许停止
$result = @{
  hookSpecificOutput = @{
    hookEventName = 'Stop'
  }
}
Write-Output ($result | ConvertTo-Json -Compress)
