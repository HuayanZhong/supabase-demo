$message = @"
## 质量提醒

任务完成后建议执行以下检查：

| 命令 | 用途 |
|------|------|
| `pnpm check-types` | 类型检查 |
| `pnpm lint` | 代码质量 |
| `pnpm format:fix` | 格式修复 |
| `/audit` | 全量审计 |
"@

# Notification 为非阻断事件，纯文本输出即可作为提醒
Write-Output $message
