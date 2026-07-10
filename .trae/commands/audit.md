---
description: 全量扫描治理架构中的资源存在性与交叉引用一致性，自动修复可自动修复的偏差
---

全量扫描项目治理架构，覆盖**资源存在性 + 交叉引用一致性**两个维度，自动修复可自动修复的偏差。

审计范围：`AGENTS.md`、`.trae/` 下所有目录与文件、`.agents/skills/`、`.env.example`

详细步骤文件在 `.trae/commands/audit/` 目录下。执行到每一步时，先读取对应子文件获取详细指令。

## 设计约束

1. **比较规则**：除非明确标注"精确匹配"，所有文本比较使用**语义匹配**（内容含义一致即通过，不要求逐字相同）
2. **安全操作**：所有"删除"和"修改 AGENTS.md"的操作**必须**在执行前输出具体变更内容，等待用户确认
3. **修复确保幂等**：所有自动修复必须保证重复执行不会出错（如 `New-Item` 加 `-Force`）
4. **进度输出**：每完成一个步骤，立即输出该步骤的统计摘要，最后汇总为完整报告
5. **抑制冗余 Logger**：审计自带完整报告输出（第 8 步），PostToolUse 的 `remind-logging.ps1` 提醒是冗余噪声。执行前创建 `.trae/.hooks-mute` 标记文件以抑制，执行结束后删除

## 交叉引用关系图

```
AGENTS.md ──────────→ .trae/rules/        规则表 + 树形图 vs 实际文件
AGENTS.md ──────────→ hooks.json          生命周期图 vs 实际绑定
AGENTS.md ──────────→ hooks/README.md     生命周期图 vs 事件明细

hooks.json ─────────→ .trae/hooks/*.ps1   command 路径 vs 文件存在性
.trae/hooks/*.ps1 ──→ .trae/rules/        规则引用路径 vs 文件存在性

hooks/README.md ────→ hooks.json          事件明细表 vs 实际绑定
hooks/README.md ────→ .trae/hooks/*.ps1   作用描述 vs 实际脚本行为
hooks/README.md ────→ .trae/rules/        规则映射表 vs 规则文件

rules/README.md ────→ .trae/rules/        目录结构图 vs 实际文件
rules/README.md ────→ AGENTS.md           生效方式表 vs 规则表
rules/README.md ────→ hooks.json          Hooks 注入关系 vs 实际绑定

commands/README.md ─→ .trae/commands/     命令表 vs 实际命令文件
commands/README.md ─→ audit.md            /audit 描述 vs 实际步骤

.trae/skills/ ──────→ .agents/skills/     junction 目标 vs 目标存在性
```

Three-way 约束：`AGENTS.md` 生命周期图 == `hooks/README.md` 生命周期图 == `rules/README.md` Hooks 注入关系表
比较方法：归一化为 `{事件名 → 脚本文件名 → [注入规则]}` 三元组列表再逐行对比。

## 前置准备

先验证以下路径是否存在：

| 路径                         | 缺失时处理       |
| ---------------------------- | ---------------- |
| `AGENTS.md`                  | 阻断，需人工修复 |
| `.trae/hooks.json`           | 阻断，需人工修复 |
| `.trae/rules/`               | 阻断，需人工修复 |
| `.trae/hooks/`               | 阻断，需人工修复 |
| `.agents/skills/`            | 跳过 Skills 审计 |
| `.trae/skills/`              | 跳过 Skills 审计 |
| `.trae/mcp.json`             | 跳过 MCP 审计    |
| `packages/config/src/env.ts` | 跳过配置审计     |
| `.env.example`               | 跳过配置审计     |

## 执行步骤

每步执行前先读取 `audit/{file}` 获取详细指令，执行后输出统计摘要。

| #   | 步骤         | 详细指令文件           | 输出摘要格式                                                                   |
| --- | ------------ | ---------------------- | ------------------------------------------------------------------------------ |
| 1   | Skills 审计  | `audit/01-skills.md`   | `[{步骤1 Skills}] 已安装 {N} 个 \| 新建 junction {N} 个 \| ...`                |
| 2   | MCP 审计     | `audit/02-mcp.md`      | `[{步骤2 MCP}] 已注册 {N} 个 \| 工具描述正常 {N} 个 \| 异常 {N} 个`            |
| 3   | 规则审计     | `audit/03-rules.md`    | `[{步骤3 规则}] 总 {N} 个 \| frontmatter缺失 {N} 个 \| 引用异常 {N} 处 \| ...` |
| 4   | Hooks 审计   | `audit/04-hooks.md`    | `[{步骤4 Hooks}] 事件绑定 {N} 个 \| .ps1已注册 {N} / 孤立 {N} \| ...`          |
| 5   | 交叉引用审计 | `audit/05-crossref.md` | `[{步骤5 交叉引用}] AGENTS↔hooks {N} \| ...`                                   |
| 6   | 配置审计     | `audit/06-config.md`   | `[{步骤6 配置}] 新增 {N} 项 \| 冗余 {N} 项`                                    |
| 7   | 修复验证     | `audit/07-verify.md`   | `[{步骤7 验证}] 通过 {N} 项 \| 失败(转人工) {N} 项`                            |
| 8   | 输出报告     | `audit/08-report.md`   | 按模板输出完整 markdown 报告                                                   |
