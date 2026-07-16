# PreToolUse(chrome-devtools) 注入：本地凭证注入
# 浏览器操作前注入本地凭证到 AI 上下文
# 安全改进：不注入明文密码，仅注入"已配置凭证"状态标记

$credPath = Join-Path $PSScriptRoot "..\local-credentials.json"

if (-not (Test-Path $credPath)) {
  # 文件不存在，静默跳过
  $result = @{
    hookSpecificOutput = @{
      hookEventName      = 'PreToolUse'
      permissionDecision = 'allow'
    }
  }
  Write-Output ($result | ConvertTo-Json -Compress)
  exit
}

try {
  $cred = Get-Content $credPath -Raw | ConvertFrom-Json
  
  # 安全检查：仅注入状态标记，不暴露明文凭证
  $hasGoogleCreds = ($null -ne $cred.google.username) -and ($null -ne $cred.google.password)
  
  if ($hasGoogleCreds) {
    $context = @"
本地已配置 Google 服务凭证（用户名：$($cred.google.username)）。
如需使用凭证，请从安全存储中读取，不要在对话中明文展示密码。
"@
  } else {
    $context = "本地凭证文件存在但 Google 凭证未配置完整。"
  }
  
  $result = @{
    hookSpecificOutput = @{
      hookEventName     = 'PreToolUse'
      permissionDecision = 'allow'
      additionalContext  = $context
    }
  }
  Write-Output ($result | ConvertTo-Json -Compress)
}
catch {
  $result = @{
    hookSpecificOutput = @{
      hookEventName      = 'PreToolUse'
      permissionDecision = 'allow'
    }
  }
  Write-Output ($result | ConvertTo-Json -Compress)
}
