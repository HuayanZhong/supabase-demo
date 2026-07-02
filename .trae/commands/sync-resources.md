---
name: sync-resources
description: 扫描 MCP 和 Skill 资源差异，自动同步到 governance 文件
---

## 1. 读取当前状态

**MCP 来源（两处）：**

- **项目级** — 读取 `.trae/mcp.json`，提取 `mcpServers` 下所有 key
- **全局级** — 全局 MCP 不写进 mcp.json，需通过 registry.md 中"来源=全局"的条目来识别

将上述合并为**完整 MCP 列表**。

**Skill 来源（两处）：**

- **项目级** — 读取 `.trae/skills/` 目录，列出有 SKILL.md 的子目录
- **全局级** — 全局 Skill 不在 skills/ 目录中（如 nuxt-ui、supabase、supabase-postgres-best-practices、turborepo），需通过 registry.md 中"来源=全局"的条目来识别

将上述合并为**完整 Skill 列表**。

## 2. 对比注册表

- 读取 `.trae/resources/registry.md`
- 标记差异：
  - 真实存在但注册表没有 → **新增资源**
  - 注册表有但真实已不存在 → **已删除资源**
  - 两者一致 → **正常**

> 注意：全局资源（Trae IDE 内置）不出现在 mcp.json 或 skills/ 目录中，如果 registry.md 已正确标注其来源为"全局"，则视为已注册。

## 3. 扫描所有引用

- 遍历 `rules/` 下所有 `.md`，标记各 MCP 和 Skill 是否被引用
- 遍历 `agents/` 下所有 `.md`，标记是否引用该资源
- 遍历 `templates/` 下所有 `.md`，标记是否引用该资源

## 4. 根据差异执行同步

### 有新增资源

1. 在 `registry.md` 的 MCP/Skill 表格中新增一行，标注来源、类型、功能域
2. 按 `.trae/resources/sync.md` 的传播规则更新所有 affected 文件
3. 追加变更记录到 registry.md
4. 输出 `[SYNC] ADD | {name} | {type} | {domain}`

### 有删除资源

1. 从 `registry.md` 的 MCP/Skill 表格中删除对应行
2. 清理所有引用该资源的 governance 文件（rules/ / agents/ / templates/）
3. 追加变更记录到 registry.md
4. 输出 `[SYNC] DEL | {name} | {type} | 已清理 {N} 个引用`

### 未引入 router 表

对于已注册但未被任何 governance 文件引用的资源，不自动添加，仅在日志中提示：

```
[SYNC] WARN | {name} | {type} | 已注册但未被任何 governance 文件引用
```

### 无差异

输出 `[SYNC] OK | 注册表与实际一致，无需变更`
