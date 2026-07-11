$sessionModeFile = ".trae/.session-mode"

if (Test-Path $sessionModeFile) {
    $mode = Get-Content $sessionModeFile -Raw | ForEach-Object { $_.Trim() }
    if ($mode -eq "chat") {
        # 闲聊模式：不注入任何路由指令，零开销
        exit 0
    }
    # dev 模式：继续注入路由指令
}

# 首次（无文件）或 dev 模式：注入路由指令
$router = @"
请阅读 `.trae/rules/agent-routing.md`，完成意图分类、Agent 选型和任务摘要。
"@

$result = @{
  hookSpecificOutput = @{
    hookEventName     = 'UserPromptSubmit'
    additionalContext = $router
  }
}

Write-Output ($result | ConvertTo-Json -Compress)
