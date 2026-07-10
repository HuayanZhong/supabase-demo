$context = @"
## 项目上下文
项目: supabase-demo | 技术栈: NestJS + Nuxt + Supabase + MikroORM | Monorepo: pnpm + Turborepo
质量: oxlint + oxfmt | 类型检查: pnpm check-types | 审计: /audit
规则: .trae/rules/ | Skills: .trae/skills/ | MCP: .trae/mcp.json

请阅读以下规则了解项目基础约束：
- `.trae/rules/language.md` — 语言约束
- `.trae/rules/shared/monorepo.md` — Monorepo 结构
"@

$json = @{
  hookSpecificOutput = @{
    hookEventName     = 'SessionStart'
    additionalContext = $context
  }
} | ConvertTo-Json -Compress

Write-Output $json
