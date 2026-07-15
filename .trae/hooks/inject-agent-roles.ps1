# SessionStart 注入：角色与资源定义
# 会话开始时注入 agent/roles.md 指针，建立角色认知

$result = @{
  hookSpecificOutput = @{
    hookEventName     = 'SessionStart'
    additionalContext = "请阅读 .trae/rules/agent/roles.md（角色与资源定义）"
  }
}
Write-Output ($result | ConvertTo-Json -Compress)
