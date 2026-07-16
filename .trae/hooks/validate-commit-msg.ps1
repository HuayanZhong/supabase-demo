# PreToolUse(commit) 验证：检查 commit message 格式
# 确保符合 git-commit-message.md 规范

$inputJson = [Console]::In.ReadToEnd()
$parsed = $inputJson | ConvertFrom-Json

$toolName = $parsed.toolName

# 仅针对 RunCommand 工具且涉及 git commit
if ($toolName -eq "RunCommand") {
  $command = $parsed.toolArgs.command

  if ($command -match "git\s+commit") {
    # 提取 commit message
    $messageMatch = [regex]::Match($command, '-m\s+["''](.+?)["'']')

    if ($messageMatch.Success) {
      $message = $messageMatch.Groups[1].Value

      # 检查是否符合 Conventional Commits 格式
      # 格式: <type>(<scope>): <description>
      $pattern = '^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?:\s+.+$'

      if ($message -notmatch $pattern) {
        $result = @{
          hookSpecificOutput = @{
            hookEventName            = 'PreToolUse'
            permissionDecision       = 'deny'
            permissionDecisionReason = "Commit message 不符合规范。请使用 Conventional Commits 格式：type(scope): description。例如：feat(auth): 添加登录功能"
          }
        }
        Write-Output ($result | ConvertTo-Json -Compress)
        exit 0
      }

      # 检查是否使用中文（根据 language.md 规范）
      if ($message -notmatch '[\u4e00-\u9fa5]') {
        $result = @{
          hookSpecificOutput = @{
            hookEventName            = 'PreToolUse'
            permissionDecision       = 'deny'
            permissionDecisionReason = "Commit message 应使用中文。例如：feat(auth): 添加登录功能"
          }
        }
        Write-Output ($result | ConvertTo-Json -Compress)
        exit 0
      }
    }
  }
}

# 通过检查
$result = @{
  hookSpecificOutput = @{
    hookEventName      = 'PreToolUse'
    permissionDecision = 'allow'
  }
}
Write-Output ($result | ConvertTo-Json -Compress)
