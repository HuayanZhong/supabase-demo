$inputJson = [Console]::In.ReadToEnd()
$parsed = $inputJson | ConvertFrom-Json

$filePath = $parsed.tool_input.file_path
$normalizedPath = $filePath -replace '\\', '/'

$commentsRule = if ($normalizedPath -match 'apps/backend/') {
    '.trae/rules/backend/comments.md -- backend comments (Service/Controller/Util JSDoc)'
} else {
    '.trae/rules/frontend/comments.md -- frontend comments (.vue / composable)'
}

$backendRules = ""
if ($normalizedPath -match 'apps/backend/') {
    $backendRules = "`nBackend rules: .trae/rules/backend/nestjs.md, database.md, error-handling.md, logging.md"
}

$frontendRules = ""
if ($normalizedPath -match 'apps/frontend/' -or $normalizedPath -match '\.vue$') {
    $frontendRules = "`nFrontend rules: .trae/rules/frontend/nuxt.md, styles.md, quality.md"
}

$standards = "Read before coding: naming.md, comments.md, $commentsRule, i18n.md, agent-catalog.md$backendRules$frontendRules"

$result = @{
  hookSpecificOutput = @{
    hookEventName      = 'PreToolUse'
    permissionDecision = 'allow'
    additionalContext  = $standards
  }
}

Write-Output ($result | ConvertTo-Json -Compress)
