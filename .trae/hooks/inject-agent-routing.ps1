# UserPromptSubmit 注入：任务路由决策
# 根据会话模式判断是否需要注入执行规范
#
# 执行规范仅在 dev 模式下注入（涉及编码、重构等开发任务时）
# 聊天/问答模式下不注入执行规范以减少上下文占用

$sessionModeFile = ".trae/.session-mode"
$injectExecution = $false

# 只在 .session-mode 文件存在且内容为 dev 时注入执行规范
if (Test-Path $sessionModeFile) {
  $mode = Get-Content $sessionModeFile -Raw -Encoding UTF8 | ForEach-Object { $_.Trim() }
  if ($mode -eq "dev") {
    $injectExecution = $true
  }
}

$context = @"
请阅读 .trae/rules/agent/routing.md（任务路由决策）
"@

if ($injectExecution) {
  $context += "`n请阅读 .trae/rules/agent/execution.md（执行规范）"
}

$result = @{
  hookSpecificOutput = @{
    hookEventName     = 'UserPromptSubmit'
    additionalContext = $context
  }
}
Write-Output ($result | ConvertTo-Json -Compress)
