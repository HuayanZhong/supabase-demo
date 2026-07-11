$standards = @"
写代码前请先阅读以下规范：
- `.trae/rules/naming.md` — 命名规范（文件名、变量名、类型名）
- `.trae/rules/comments.md` — 注释规范（全项目通用，始终生效）
- `.trae/rules/frontend/comments.md` — 前端注释规范（.vue / composable）
- `.trae/rules/frontend/i18n.md` — 国际化约束（禁止硬编码文本，必须用 t()）
- `.trae/rules/agent-catalog.md`（安全约束章节）— Agent 安全与 MCP 约束
"@

$result = @{
  hookSpecificOutput = @{
    hookEventName      = 'PreToolUse'
    permissionDecision = 'allow'
    additionalContext  = $standards
  }
}

Write-Output ($result | ConvertTo-Json -Compress)
