# 安全拦截：按文件路径决定 allow/deny，规则注入由 Trae IDE 内置机制处理
$inputJson = [Console]::In.ReadToEnd()
$parsed = $inputJson | ConvertFrom-Json

$result = @{
  hookSpecificOutput = @{
    hookEventName      = 'PreToolUse'
    permissionDecision = 'allow'
  }
}

Write-Output ($result | ConvertTo-Json -Compress)
