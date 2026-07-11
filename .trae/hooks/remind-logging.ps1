# .trae/.hooks-mute 抑制提醒（指令执行期或手动压缩上下文时使用）
# 文件有效期为 10 分钟，超时后自动失效，无需手动删除
$muteFile = Join-Path $PSScriptRoot "..\.hooks-mute"
if (Test-Path $muteFile) {
  $now = Get-Date
  $lastWrite = (Get-Item $muteFile).LastWriteTime
  $ageMinutes = ($now - $lastWrite).TotalMinutes
  if ($ageMinutes -le 10) {
    # 文件在有效期内 → 抑制提醒
    $result = @{
      hookSpecificOutput = @{
        hookEventName     = 'PostToolUse'
        additionalContext = ""
      }
    }
    Write-Output ($result | ConvertTo-Json -Compress)
    exit
  } else {
    # 文件已过期（超过 10 分钟）→ 自动清理
    Remove-Item $muteFile -Force
  }
}

$reminder = "> 工具已执行，请在 Stop 阶段按 .trae/rules/task-logging.md 输出结构化日志"

$result = @{
  hookSpecificOutput = @{
    hookEventName     = 'PostToolUse'
    additionalContext = $reminder
  }
}

Write-Output ($result | ConvertTo-Json -Compress)
