# PreToolUse 注入：按工具名匹配注入对应 tool/*.md 规则
# 工具调用前注入该工具的使用规范

$inputJson = [Console]::In.ReadToEnd()
$parsed = $inputJson | ConvertFrom-Json

# 提取工具名（兼容 toolName 和 tool_name）
$toolName = if ($parsed.toolName) { $parsed.toolName } elseif ($parsed.tool_name) { $parsed.tool_name } else { "" }

# 工具名到规则文件的映射
$toolRuleMap = @{
  "mcp_chrome-devtools" = "tool/chrome-devtools.md"
  "mcp_supabase"        = "tool/supabase.md"
  "mcp_Filesystem"      = "tool/filesystem.md"
  "mcp_Sequential_Thinking" = "tool/sequential-thinking.md"
  "mcp_context7"        = "tool/context7.md"
  "mcp_tavily_search"   = "tool/tavily-search.md"
  "mcp_nuxt-ui"         = "tool/nuxt-ui.md"
  "mcp_github"          = "tool/github.md"
  "mcp_windows-cli"     = "tool/windows-cli.md"
  "mcp_autoglm"         = "tool/autoglm.md"
  "mcp_aminer"          = "tool/aminer-data-search.md"
  "integrated_code_mode" = "tool/integrated-code-mode.md"
}

# 匹配工具名前缀（使用 [regex]::Escape 转义防止正则注入）
$matchedRule = $null
foreach ($prefix in $toolRuleMap.Keys) {
  if ($toolName -match ('^' + [regex]::Escape($prefix))) {
    $matchedRule = $toolRuleMap[$prefix]
    break
  }
}

if ($matchedRule) {
  $rulePath = ".trae/rules/$matchedRule"
  # 检查规则文件是否存在
  if (Test-Path $rulePath) {
    $result = @{
      hookSpecificOutput = @{
        hookEventName     = 'PreToolUse'
        permissionDecision = 'allow'
        additionalContext = "请阅读 $rulePath（工具使用规范）"
      }
    }
  } else {
    # 规则文件不存在，静默放行
    $result = @{
      hookSpecificOutput = @{
        hookEventName      = 'PreToolUse'
        permissionDecision = 'allow'
      }
    }
  }
} else {
  # 未匹配到工具规则，静默放行
  $result = @{
    hookSpecificOutput = @{
      hookEventName      = 'PreToolUse'
      permissionDecision = 'allow'
    }
  }
}

Write-Output ($result | ConvertTo-Json -Compress)
