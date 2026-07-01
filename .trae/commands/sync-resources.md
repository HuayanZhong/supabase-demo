---
name: sync-resources
description: 扫描 MCP 和 Skill 资源差异，同步到 governance 文件
---

请执行以下操作：

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

## 3. 扫描 router 引用

- 遍历 `.trae/runtime/` 下所有 `router.md`
- 标记各 MCP 和 Skill 是否被至少一个 router.md 的资源映射表引用

## 4. 输出差异报告

格式如下：

```markdown
## sync-resources 报告

### 新增资源

- mcp: {name}（{project/global}）→ 建议加入 {domain}/router.md
- skill: {name}（{project/global}）→ 建议加入 {domain}/router.md

### 已删除资源

- mcp: {name} → 需从 registry.md 移除
- skill: {name} → 需从 registry.md 移除

### 未引入 router 表

- mcp: {name} → 未被任何 router.md 引用
- skill: {name} → 未被任何 router.md 引用
```

## 5. 根据差异执行同步

执行 `.trae/resources/sync.md` 定义的同步流程：

- 有新增 → 更新 registry.md + 传播到路由资源表
- 有删除 → 清理 registry.md + 移除路由引用
- 无差异 → 输出"注册表与实际一致，无需变更"
