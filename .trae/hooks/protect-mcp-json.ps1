$inputJson = [Console]::In.ReadToEnd()
$parsed = $inputJson | ConvertFrom-Json
$filePath = $parsed.tool_input.file_path

if ($filePath -match '\.trae\\mcp\.json') {
  $result = @{
    hookSpecificOutput = @{
      hookEventName           = 'PreToolUse'
      permissionDecision      = 'deny'
      permissionDecisionReason = '.trae/mcp.json 包含明文 GitHub Token，禁止直接写入。如需修改请在 IDE 设置中操作或先确认 Token 安全'
    }
  }
  Write-Output ($result | ConvertTo-Json -Compress)
  exit 0
}

$result = @{
  hookSpecificOutput = @{
    hookEventName      = 'PreToolUse'
    permissionDecision = 'allow'
  }
}
Write-Output ($result | ConvertTo-Json -Compress)
