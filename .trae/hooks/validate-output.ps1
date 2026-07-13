try {
    $inputJson = [Console]::In.ReadToEnd()
    $parsed = $inputJson | ConvertFrom-Json
    $lastMsg = $parsed.last_assistant_message

    # 检查是否包含任务日志（支持中英文）
    $hasTaskLog = $lastMsg -match '(?m)^#+\s*(Task Log|任务日志)'

    if (-not $hasTaskLog) {
        $result = @{
            decision = 'block'
            reason   = 'Please output task log (see .trae/rules/task-logging.md) and complete quality verification (see .trae/rules/agent-catalog.md)'
        }

        Write-Output ($result | ConvertTo-Json -Compress)
        exit 0
    }

    # 清理会话状态文件
    $sessionModeFile = ".trae/.session-mode"
    if (Test-Path $sessionModeFile) { Remove-Item $sessionModeFile -Force }
}
catch {
    # 出错时允许停止，避免阻塞
}
