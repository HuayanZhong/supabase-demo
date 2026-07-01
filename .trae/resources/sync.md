# 资源同步流程

## 职责

`resources/sync.md` 定义资源变更后的自动同步流程——当 MCP 或 Skill 新增/删除/更新时，传播到所有引用了该资源的 governance 文件。

---

## 触发条件

以下任一情况发生时，必须执行同步流程：

| 触发条件     | 场景                                              |
| ------------ | ------------------------------------------------- |
| **新安装**   | 安装了新的 MCP 或 Skill                           |
| **卸载**     | 移除了某个 MCP 或 Skill                           |
| **更新**     | 已有 MCP 或 Skill 版本升级、路径改变、能力变化    |
| **定期审查** | 每完成 10 次任务后，随 evolution 聚合同步检查一次 |
| **主动检查** | 输入 `/sync-resources`（AI 自动扫描对比并同步）   |

---

## 同步流程

```
变更发生 → [对比注册表] → [更新 registry.md] → [传播到各 router.md] → [通知] → 完成
```

### 步骤 1：对比注册表

读取 `mcp.json` 和 `skills/` 目录当前状态，与 `registry.md` 对比，标记差异：

| 对比项 | MCP                 | Skill              |
| ------ | ------------------- | ------------------ |
| 名称   | mcp.json 中的 key   | skills/ 下的目录名 |
| 数量   | mcpServers 对象长度 | skills/ 目录数     |
| 可用性 | URL 是否可达        | SKILL.md 是否存在  |

### 步骤 2：更新 registry.md

按差异更新 `registry.md` 的三个部分：

- **MCP/Skill 表格** — 新增行/删除行/修改状态
- **领域映射汇总** — 重新计算每个领域的资源覆盖状态
- **变更记录** — 追加一行新的变更记录

### 步骤 3：传播到各 router.md

根据变更的资源所属领域，更新对应 `runtime/{domain}/router.md` 的资源映射表：

| 变更的资源              | 需要更新的 router.md                                                             |
| ----------------------- | -------------------------------------------------------------------------------- |
| supabase MCP            | `runtime/backend/router.md`、`runtime/ai/router.md`、`runtime/quality/router.md` |
| nuxt-ui MCP             | `runtime/frontend/router.md`                                                     |
| tavily_search MCP       | `runtime/ai/router.md`                                                           |
| chrome-devtools MCP     | `runtime/frontend/router.md`、`runtime/quality/router.md`                        |
| windows-cli MCP         | `runtime/devops/router.md`                                                       |
| ui-ux-pro-max skill     | `runtime/frontend/router.md`                                                     |
| nuxt-ui skill           | `runtime/frontend/router.md`                                                     |
| supabase skill          | `runtime/backend/router.md`、`runtime/quality/router.md`                         |
| supabase-postgres skill | `runtime/backend/router.md`                                                      |
| turborepo skill         | `runtime/devops/router.md`、`runtime/shared/router.md`                           |

更新内容格式：

```markdown
| 资源             | 类型  | 用途     |
| ---------------- | ----- | -------- |
| `skill/{name}`   | skill | 简述用途 |
| `{mcp_name} MCP` | MCP   | 简述用途 |
```

### 步骤 4：通知

在任务日志中输出同步结果。

---

## 同步检查清单

每次同步后确认：

- [ ] registry.md 的 MCP 表格与 mcp.json 一致
- [ ] registry.md 的 Skill 表格与 skills/ 目录一致
- [ ] 所有受影响的路由资源表已更新
- [ ] 变更记录已追加
- [ ] 无冗余引用（已被删除的资源未遗留在任何 router.md 中）

---

## 行为约束

- 同步流程不得跳过步骤 1（直接改 router.md），必须先更新 registry.md
- 删除资源时须确认已无活跃任务依赖它
- registry.md 和 router.md 的变更应随同一次任务提交，不单独提交
