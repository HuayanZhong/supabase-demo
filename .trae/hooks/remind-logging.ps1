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

$result = @{
  hookSpecificOutput = @{
    hookEventName     = 'PostToolUse'
    additionalContext = $reminder
  }
}

Write-Output ($result | ConvertTo-Json -Compress)
