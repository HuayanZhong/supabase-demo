# .trae/.hooks-mute 抑制提醒（指令执行期或手动压缩上下文时使用）
$muteFile = Join-Path $PSScriptRoot "..\.hooks-mute"
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

# 检查是否已经提醒过（每次用户消息只提醒一次）
$reminderStateFile = Join-Path $PSScriptRoot "..\.task-log-reminder-shown"
if (Test-Path $reminderStateFile) {
  # 已提醒过，不再重复
  $result = @{
    hookSpecificOutput = @{
      hookEventName     = 'PostToolUse'
      additionalContext = ""
    }
  }
  Write-Output ($result | ConvertTo-Json -Compress)
  exit
}

# 增强的任务日志提醒
$reminder = @"
> ⚠️ 任务完成提醒：请在最终回复前输出完整的任务日志（按 .trae/rules/task-logging.md 格式）
>
> 任务日志必须包含：
> 1. 领域和任务描述
> 2. 资源覆盖率（规则命中、Skills 调用、MCP 使用）
> 3. 调用链路（规则、Skills、MCP、子智能体）
> 4. 变更清单（创建/修改/删除的文件）
> 5. 验证结果（lint/format/typecheck）
> 6. 耗时对比（预估 vs 实际）
>
> 未输出任务日志将导致 Stop hook 阻止结束！
"@

# 标记已提醒（Stop hook 会清理此文件）
Set-Content -Path $reminderStateFile -Value "reminded"

$result = @{
  hookSpecificOutput = @{
    hookEventName     = 'PostToolUse'
    additionalContext = $reminder
  }
}

Write-Output ($result | ConvertTo-Json -Compress)
