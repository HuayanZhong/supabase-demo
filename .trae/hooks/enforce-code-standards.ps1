# 安全拦截：按文件路径决定 allow/deny，规则注入由 Trae IDE 内置机制处理
# 同时注入注释规范指针（根据文件路径判断后端/前端）
$inputJson = [Console]::In.ReadToEnd()
$parsed = $inputJson | ConvertFrom-Json

# 提取工具参数中的文件路径
$toolName = $parsed.toolName
$toolArgs = $parsed.toolArgs
$filePath = ""

if ($toolArgs -and $toolArgs.file_path) {
  $filePath = $toolArgs.file_path
} elseif ($toolArgs -and $toolArgs.path) {
  $filePath = $toolArgs.path
}

# 判断是后端还是前端文件
$isBackend = $filePath -match "apps/backend"
$isFrontend = $filePath -match "apps/frontend|packages/ui"

# 构建规则指针
$rulePointers = @()
$rulePointers += "请阅读 .trae/rules/comments.md（注释规范）"

if ($isBackend) {
  $rulePointers += "请阅读 .trae/rules/backend/comments.md（后端注释规范）"
} elseif ($isFrontend) {
  $rulePointers += "请阅读 .trae/rules/frontend/comments.md（前端注释规范）"
}

$result = @{
  hookSpecificOutput = @{
    hookEventName      = 'PreToolUse'
    permissionDecision = 'allow'
    hookSpecificMessage = ($rulePointers -join "`n")
  }
}

Write-Output ($result | ConvertTo-Json -Compress)
