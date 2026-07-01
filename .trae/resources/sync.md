# 资源同步流程

## 职责

`resources/sync.md` 定义资源变更后的同步流程——当 MCP 或 Skill 新增/删除/更新时，传播到所有引用了该资源的 governance 文件。同时也定义了未知资源的领域归属决策规则。

---

## 触发条件

以下任一情况发生时，必须执行同步流程：

| 触发条件     | 场景                                              |
| ------------ | ------------------------------------------------- |
| **新安装**   | 安装了新的 MCP 或 Skill                           |
| **卸载**     | 移除了某个 MCP 或 Skill                           |
| **更新**     | 已有 MCP 或 Skill 版本升级、路径改变、能力变化    |
| **定期审查** | 每完成 10 次任务后，随 evolution 聚合同步检查一次 |
| **主动检查** | 输入 `/sync-resources`                            |

---

## 同步流程

```
变更发生 → [对比注册表] → [更新 registry.md] → [传播到各引用文件] → [通知] → 完成
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

### 步骤 3：传播到各引用文件

根据变更的资源所属领域，按以下规则更新所有引用了该资源的 governance 文件。

#### 3a. runtime/router.md 传播表

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

更新格式：在对应 router.md 的资源映射表中添加一行。

#### 3b. workflows/ 传播表

| 资源类型                | 需要更新的 workflow 范围                                                    | 更新位置        |
| ----------------------- | --------------------------------------------------------------------------- | --------------- |
| supabase MCP            | `workflows/backend/*.md`                                                    | "可用资源" 段落 |
| supabase MCP            | `workflows/ai/*.md`                                                         | "可用资源" 段落 |
| supabase MCP            | `workflows/quality/api-test.md`                                             | "可用资源" 段落 |
| nuxt-ui MCP             | `workflows/frontend/*.md`                                                   | "可用资源" 段落 |
| skill/supabase          | `workflows/backend/*.md`                                                    | "参考文档" 段落 |
| skill/supabase          | `workflows/ai/integrate.md`                                                 | "参考文档" 段落 |
| skill/supabase-postgres | `workflows/backend/*.md`                                                    | "参考文档" 段落 |
| skill/nuxt-ui           | `workflows/frontend/*.md`                                                   | "参考文档" 段落 |
| skill/turborepo         | `workflows/shared/*.md`、`workflows/quality/*.md`、`workflows/backend/*.md` | "参考文档" 段落 |
| skill/ui-ux-pro-max     | `workflows/frontend/refactor.md`                                            | "参考文档" 段落 |

#### 3c. execution-engine/ 传播表

| 资源类型       | 需要更新的 execution-engine 范围                                                                                                                                                                    | 更新位置            |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| supabase MCP   | `execution-engine/backend/`、`execution-engine/frontend/`、`execution-engine/devops/`、`execution-engine/quality/`                                                                                  | "可调用的 MCP" 段落 |
| nuxt-ui MCP    | `execution-engine/frontend/*.md`                                                                                                                                                                    | "可调用的 MCP" 段落 |
| skill/supabase | `execution-engine/backend/policy.md`、`execution-engine/devops/policy.md`、`execution-engine/frontend/policy.md`、`execution-engine/frontend/heuristic.md`、`execution-engine/quality/heuristic.md` | "可用 Skill" 段落   |
| skill/nuxt-ui  | `execution-engine/frontend/heuristic.md`、`execution-engine/frontend/policy.md`                                                                                                                     | "可用 Skill" 段落   |

#### 3d. ARCHITECTURE.md + logging.md

如果新增/删除的资源属于核心资源（supabase、nuxt-ui），同步更新 `ARCHITECTURE.md` 的资源章节和 `logging.md` 的领域章节。

### 步骤 4：未知资源领域归属

当新增的资源不在上述传播表范围内时，按以下规则推断其领域归属：

```
资源名/描述关键词 → 推断领域
```

| 关键词                         | 推断领域 |
| ------------------------------ | -------- |
| database / db / postgres / sql | backend  |
| ui / component / icon / style  | frontend |
| deploy / ci / docker / k8s     | devops   |
| test / lint / check / security | quality  |
| chat / llm / ai / model        | ai       |
| i18n / type / config / pkg     | shared   |

**推断不可靠时的兜底规则：**

1. 输出 `[SYNC] UNKNOWN | {name} | 无法确定领域归属，等待人工确认`
2. 将资源信息写入 registry.md 并标注功能域为"待确认"
3. 人工确认后，更新传播表并执行同步

**已确认的归属会被记住：**

更新 `registry.md` 的领域映射汇总表后，该资源即可在后续同步中自动匹配传播规则。

---

### 步骤 5：通知

在任务日志中输出同步结果，格式：

```
[SYNC] {操作} | {资源名} | {类型} | {说明}
```

---

## 同步检查清单

每次同步后确认：

- [ ] registry.md 的 MCP 表格与 mcp.json 一致
- [ ] registry.md 的 Skill 表格与 skills/ 目录一致
- [ ] 所有受影响的 router.md 资源表已更新
- [ ] 所有受影响的 workflow 文件已更新
- [ ] 所有受影响的 execution-engine 文件已更新
- [ ] 变更记录已追加
- [ ] 无冗余引用（已被删除的资源未遗留在任何引用文件中）

---

## 行为约束

- 同步流程不得跳过步骤 1（直接改引用文件），必须先更新 registry.md
- 删除资源时须确认已无活跃任务依赖它
- registry.md 和各引用文件的变更应随同一次任务提交，不单独提交
- 未知资源未确认归属前，不主动将资源写入任何 router.md 或 workflow
