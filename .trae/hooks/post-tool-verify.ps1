# PostToolUse 验证：工具执行后自动检查
# 针对 Write/Edit 工具执行后运行 lint 检查

$inputJson = [Console]::In.ReadToEnd()
$parsed = $inputJson | ConvertFrom-Json

$toolName = $parsed.toolName
$file_path = $parsed.toolArgs.file_path

# 仅针对 Write/Edit 工具且涉及代码文件
if ($toolName -match "^(Write|Edit)$" -and $file_path) {
  # 判断文件类型
  $isBackend = $file_path -match "apps/backend.*\.(ts|js)$"
  $isFrontend = $file_path -match "apps/frontend.*\.(vue|ts|js)$"
  
  $lintResult = ""
  
  if ($isBackend -and (Test-Path "apps/backend")) {
    # 后端文件：运行 ESLint
    try {
      $lintOutput = pnpm --filter backend lint 2>&1
      if ($LASTEXITCODE -eq 0) {
        $lintResult = "✅ 后端 lint 检查通过"
      } else {
        $lintResult = "⚠️ 后端 lint 检查失败：$lintOutput"
      }
    } catch {
      $lintResult = "⚠️ 后端 lint 检查执行失败：$_"
    }
  }
  elseif ($isFrontend -and (Test-Path "apps/frontend")) {
    # 前端文件：运行 oxlint
    try {
      $lintOutput = pnpm --filter frontend lint 2>&1
      if ($LASTEXITCODE -eq 0) {
        $lintResult = "✅ 前端 lint 检查通过"
      } else {
        $lintResult = "⚠️ 前端 lint 检查失败：$lintOutput"
      }
    } catch {
      $lintResult = "⚠️ 前端 lint 检查执行失败：$_"
    }
  }
  
  if ($lintResult) {
    $result = @{
      hookSpecificOutput = @{
        hookEventName     = 'PostToolUse'
        additionalContext = $lintResult
      }
    }
    Write-Output ($result | ConvertTo-Json -Compress)
  }
}
