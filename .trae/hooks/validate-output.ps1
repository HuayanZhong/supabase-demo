try {
    $inputJson = [Console]::In.ReadToEnd()
    $parsed = $inputJson | ConvertFrom-Json
    $lastMsg = $parsed.last_assistant_message

    # 质量验证逻辑（可在此添加自定义检查）

    # 清理会话状态文件
    $sessionModeFile = ".trae/.session-mode"
    if (Test-Path $sessionModeFile) { Remove-Item $sessionModeFile -Force }
}
catch {
    # 出错时允许停止，避免阻塞
}
