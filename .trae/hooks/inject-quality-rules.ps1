# Stop 注入：质量验证规范
# 会话结束时注入质量验证规则，确保产出达标

$result = @{
  hookSpecificOutput = @{
    hookEventName     = 'Stop'
    additionalContext = "请阅读 .trae/rules/agent/quality.md（质量验证规范）"
  }
}
Write-Output ($result | ConvertTo-Json -Compress)
