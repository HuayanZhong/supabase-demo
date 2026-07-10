$inputJson = [Console]::In.ReadToEnd()
$parsed = $inputJson | ConvertFrom-Json
# execute_sql 的参数名是 query，而非 sql
$sql = $parsed.tool_input.query

$dangerousPattern = '\b(DROP\s+(TABLE|VIEW|INDEX|SCHEMA|DATABASE)|TRUNCATE\s+TABLE|ALTER\s+.*\s+DROP\s+COLUMN|DELETE\s+FROM)\b'

if ($sql -match $dangerousPattern) {
  $result = @{
    hookSpecificOutput = @{
      hookEventName           = 'PreToolUse'
      permissionDecision      = 'deny'
      permissionDecisionReason = '破坏性 SQL 操作（DROP/TRUNCATE/ALTER DROP/DELETE）需用户确认后方可执行'
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
