# PostToolUse(Write|Edit) 注入：双Agent循环提醒
# 每次写代码后检查是否已触发审查Agent，若未触发则提醒
# 挂载点：PostToolUse(Write|Edit)
# 作用和 post-tool-verify.ps1 类似——提醒（非阻断）

$inputJson = [Console]::In.ReadToEnd()
$parsed = $inputJson | ConvertFrom-Json

$toolName = $parsed.toolName

# 仅处理 Write 和 Edit
if ($toolName -ne "Write" -and $toolName -ne "Edit") {
  $result = @{
    hookSpecificOutput = @{
      hookEventName      = $null
      permissionDecision = 'allow'
    }
  }
  Write-Output ($result | ConvertTo-Json -Compress)
  exit 0
}

# 从文件路径判断是否属于双Agent循环审查范围
$filePath = $parsed.toolArgs.filePath

# 规则文件本身、.trae/ 基础设施文件、非源码文件不触发提醒
$excludePatterns = @(
  '\.trae\\rules\\',
  '\.trae\\hooks\\',
  '\.trae\\hooks\.json',
  '\.trae\\agents\\',
  '\.trae\\mcp\.json',
  '\.gitignore',
  '\.env',
  '\.md$',
  '\.json$'
)

$shouldExclude = $false
foreach ($pattern in $excludePatterns) {
  if ($filePath -match $pattern) {
    $shouldExclude = $true
    break
  }
}

if ($shouldExclude) {
  $result = @{
    hookSpecificOutput = @{
      hookEventName      = $null
      permissionDecision = 'allow'
    }
  }
  Write-Output ($result | ConvertTo-Json -Compress)
  exit 0
}

# 检查是否已经触发过审查Agent（通过 review-verifier 标记文件）
$reviewFlagPath = ".trae/.review-triggered"
$reviewTriggered = Test-Path $reviewFlagPath

if (-not $reviewTriggered) {
  # 未触发审查 → 注入提醒
  $context = @"
## ⚠️ 本轮改动尚未经过审查Agent验证
本次写入了源码文件 `$(Split-Path $filePath -Leaf)`，但尚未调用 review-verifier 进行审查。

### 建议操作
根据 routing.md 的审查验证规则，P0/P1 级任务必须经过 review-verifier 审查。
请在任务完成前，调用 review-verifier 审查计划或已有改动。

请阅读 .trae/rules/agent/dual-agent-loop.md（双Agent协作循环）
"@

  $result = @{
    hookSpecificOutput = @{
      hookEventName      = $null
      permissionDecision = 'allow'
      additionalContext  = $context
    }
  }
  Write-Output ($result | ConvertTo-Json -Compress)
  exit 0
}

# 已触发过审查，通过
$result = @{
  hookSpecificOutput = @{
    hookEventName      = $null
    permissionDecision = 'allow'
  }
}
Write-Output ($result | ConvertTo-Json -Compress)
