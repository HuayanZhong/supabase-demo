$sessionModeFile = ".trae/.session-mode"

if (Test-Path $sessionModeFile) {
    $mode = Get-Content $sessionModeFile -Raw | ForEach-Object { $_.Trim() }
    if ($mode -eq "chat") {
        # 闲聊模式：不注入任何路由指令，零开销
        exit 0
    }
    # dev 模式：继续注入路由指令
}

# 清理提醒状态文件（每次用户消息开始时重置）
$reminderStateFile = ".trae/.task-log-reminder-shown"
if (Test-Path $reminderStateFile) {
    Remove-Item $reminderStateFile -Force
}

# 首次（无文件）或 dev 模式：注入路由指令
$router = @"
请阅读 `.trae/rules/agent-routing.md`，完成意图分类、Agent 选型和任务摘要。

每次任务完成后，必须输出完整的任务日志（按 .trae/rules/task-logging.md 格式），包含：
1. 领域和任务描述
2. 资源覆盖率（规则命中、Skills 调用、MCP 使用）
3. 调用链路（规则、Skills、MCP、子智能体）
4. 变更清单（创建/修改/删除的文件）
5. 验证结果（lint/format/typecheck）
6. 耗时对比（预估 vs 实际）
"@

$result = @{
  hookSpecificOutput = @{
    hookEventName     = 'UserPromptSubmit'
    additionalContext = $router
  }
}

Write-Output ($result | ConvertTo-Json -Compress)
