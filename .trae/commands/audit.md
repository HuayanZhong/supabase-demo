---
description: 扫描并同步治理架构中的所有资源，确保文档与规则、Skills、MCP 保持一致性
---

## 任务

全量扫描项目治理架构，自动检测未同步的资源、修复连接一致性、更新相关文档。

## 执行步骤

### 1. Skills 审计

- 读取 `.agents/skills/` 下所有已安装技能包（每个子目录为一个技能包）
- 读取 `.trae/skills/` 下所有 junction，对比是否有遗漏或孤立
  - 缺失 junction → 使用 `New-Item -ItemType Junction -Target ".agents/skills/{name}" -Path ".trae/skills/{name}"` 创建
  - 孤立 junction（`.trae/skills/` 下有但 `.agents/skills/` 已无）→ 删除
- 检查 `.trae/skills/` 的 junction 目标路径是否有效，无效则重建
- 根据扫描结果，更新 `.trae/skills/README.md` 中的技能包清单表

### 2. MCP 审计

- 读取 `.trae/mcp.json` 中注册的 MCP 服务器列表
- 检查每个 MCP 服务器的工具描述文件是否存在（`mcp_info_folder` 目录）
- 报告缺失的 MCP 工具描述文件

### 3. 规则审计

- 递归扫描 `.trae/rules/` 下所有 `.md` 文件
- 对每个规则文件检查：
  - 是否包含正确的 YAML frontmatter（`---` 包围）
  - 是否包含 `alwaysApply` 字段（`true` 或 `false`）
  - 是否包含 `description` 字段
  - 如果 `alwaysApply: true`，检查其在 `AGENTS.md` 的规则表中是否标注为"始终生效"
- 对比 `AGENTS.md` 的规则表与 `.trae/rules/` 的实际文件列表：
  - `AGENTS.md` 未收录的规则文件 → 追加到规则表
  - 已收录但文件已删除的 → 从规则表中移除

### 4. 配置审计

- 读取 `packages/config/src/env.ts` 导出的环境变量名称
- 读取 `.env.example` 中的变量名列表
- 对比两者：
  - `env.ts` 有但 `.env.example` 没有的变量 → 追加到 `.env.example`
  - `.env.example` 有但 `env.ts` 没有的变量 → 报告冗余（不自动删除）

### 5. 输出报告

```markdown
## audit 报告

### Skills

- 已安装: {N} 个
- 新建 junction: {N} 个
- 孤立清理: {N} 个

### MCP

- 已注册: {N} 个
- 工具描述正常: {N} 个
- 异常: {N} 个

### 规则

- 总规则: {N} 个
- 始终生效: {N} 个 / 智能生效: {N} 个
- AGENTS.md 新增: {N} 条 / 移除: {N} 条
- 前导元数据缺失: {N} 个

### 配置

- .env.example 新增: {N} 项
- 冗余: {N} 项

### 总结

- 自动修复: {N} 项
- 需人工介入: {N} 项
```
