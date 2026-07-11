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
  $context = @"
你需要用以下账号登录 Google 服务时使用：
- 用户名/邮箱：`$($cred.google.username)
- 密码：`$($cred.google.password)
"@
  $result = @{
    hookSpecificOutput = @{
      hookEventName      = 'PreToolUse'
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
