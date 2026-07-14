---
description: 全量扫描治理架构中的资源存在性与交叉引用一致性，自动修复可自动修复的偏差，增加语义检查步骤
---

全量扫描项目治理架构，覆盖**资源存在性 + 交叉引用一致性 + 语义检查**三个维度，自动修复可自动修复的偏差。

审计范围：`AGENTS.md`、`.trae/` 下所有目录与文件、`.agents/skills/`、`.env.example`

详细步骤文件在 `.trae/commands/audit/` 目录下。执行到每一步时，先读取对应子文件获取详细指令。

## 设计约束

1. **比较规则**：除非明确标注"精确匹配"，所有文本比较使用**语义匹配**（内容含义一致即通过，不要求逐字相同）
2. **安全操作**：所有"删除"和"修改 AGENTS.md"的操作**必须**在执行前输出具体变更内容，等待用户确认
3. **修复确保幂等**：所有自动修复必须保证重复执行不会出错（如 `New-Item` 加 `-Force`）
4. **进度输出**：每完成一个步骤，立即输出该步骤的统计摘要，最后汇总为完整报告
5. **并行多 Agent**：步骤 1-7 可并行执行，步骤 8-9 串行执行
6. **语义检查**：步骤 8 专门检查语法错误和语义不一致

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

## 并行执行策略

### 阶段一：并行审计（步骤 1-6）

使用 **Task 工具** 分派 6 个子 agent 并行执行，每个子 agent 负责一个独立审计步骤：

```
主 agent 同时发起 6 个 Task 调用：
├─ Task(subagent_type=general_purpose_task) → 步骤 1: Skills 审计
├─ Task(subagent_type=general_purpose_task) → 步骤 2: MCP 审计
├─ Task(subagent_type=general_purpose_task) → 步骤 3: 规则审计
├─ Task(subagent_type=general_purpose_task) → 步骤 4: Hooks 审计
├─ Task(subagent_type=general_purpose_task) → 步骤 5: 交叉引用审计
└─ Task(subagent_type=general_purpose_task) → 步骤 6: 配置审计

每个子 agent 返回：{步骤号, 摘要, 发现的问题, 修复建议}
```

**子 agent 职责**：
- 读取对应的 `audit/{NN}-*.md` 详细指令
- 执行审计逻辑，记录发现的问题
- 可自动修复的问题立即修复（幂等操作）
- 返回结构化摘要（按各步骤的输出摘要格式）

### 阶段二：修复验证（步骤 7）

主 agent 汇总阶段一的修复结果，执行验证：
- 重新检查已修复项
- 确认修复幂等性
- 输出验证摘要

### 阶段三：语义检查（步骤 8）

主 agent 串行执行：
- 读取 `audit/08-semantic-check.md`
- 检查 Markdown 一致性、脚本路径、matcher 正则、Skills 和规则文件
- 输出语义检查摘要

### 阶段四：输出报告（步骤 9）

主 agent 串行执行：
- 汇总所有步骤的统计结果
- 按 `audit/09-report.md` 模板生成完整报告
- 输出最终审计报告

## 执行步骤

每步执行前先读取 `audit/{file}` 获取详细指令，执行后输出统计摘要。

| #   | 步骤         | 详细指令文件                 | 输出摘要格式                                                                           |
| --- | ------------ | ---------------------------- | -------------------------------------------------------------------------------------- |
| 1   | Skills 审计  | `audit/01-skills.md`         | `[{步骤1 Skills}] 已安装 {N} 个 \| 新建 junction {N} 个 \| ...`                        |
| 2   | MCP 审计     | `audit/02-mcp.md`            | `[{步骤2 MCP}] 已注册 {N} 个 \| 工具描述正常 {N} 个 \| 异常 {N} 个`                    |
| 3   | 规则审计     | `audit/03-rules.md`          | `[{步骤3 规则}] 总 {N} 个 \| frontmatter缺失 {N} 个 \| 引用异常 {N} 处 \| ...`         |
| 4   | Hooks 审计   | `audit/04-hooks.md`          | `[{步骤4 Hooks}] 事件绑定 {N} 个 \| .ps1已注册 {N} / 孤立 {N} \| ...`                  |
| 5   | 交叉引用审计 | `audit/05-crossref.md`       | `[{步骤5 交叉引用}] AGENTS↔hooks {N} \| ...`                                           |
| 6   | 配置审计     | `audit/06-config.md`         | `[{步骤6 配置}] 新增 {N} 项 \| 冗余 {N} 项`                                            |
| 7   | 修复验证     | `audit/07-verify.md`         | `[{步骤7 验证}] 通过 {N} 项 \| 失败(转人工) {N} 项`                                    |
| 8   | 语义检查     | `audit/08-semantic-check.md` | `[{步骤8 语义检查}] Markdown {N} \| 脚本 {N} \| matcher {N} \| Skills {N} \| 规则 {N}` |
| 9   | 输出报告     | `audit/09-report.md`         | 按模板输出完整 markdown 报告                                                           |
