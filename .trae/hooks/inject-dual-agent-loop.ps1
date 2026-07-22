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

# 审查Agent在独立上下文（Task subagent）中执行，hook 无法追溯其执行状态
# 因此始终提醒审查Agent的存在，由主Agent按任务优先级决定是否触发
$context = @"
## ⚠️ 本轮改动建议通过审查Agent验证
本次写入了源码文件 `$(Split-Path $filePath -Leaf)`。P0/P1 级任务应调用 review-verifier 审查。

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
