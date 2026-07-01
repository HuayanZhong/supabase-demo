# 资源注册表

## 职责

`resources/registry.md` 是项目所有 MCP 和 Skill 的**权威清单**。每次变更后同步到此文件，确保 governance 其他模块中的资源引用与实际可用资源一致。

---

## MCP 服务

| 名称            | 类型 | 来源          | 功能域                     | 路由资源表引用                                    |
| --------------- | ---- | ------------- | -------------------------- | ------------------------------------------------- |
| supabase        | MCP  | `mcp.json`    | backend / quality / devops | ✅ backend/ai/quality router.md                   |
| nuxt-ui         | MCP  | `mcp.json`    | frontend                   | ✅ frontend router.md                             |
| tavily_search   | MCP  | Trae IDE 内置 | ai / general               | ⚠️ 仅在 general-rules.md 提及，未入 router 资源表 |
| chrome-devtools | MCP  | Trae IDE 内置 | frontend / quality         | ❌ 未在任何 router 资源表中引用                   |
| windows-cli     | MCP  | Trae IDE 内置 | devops                     | ❌ 未在任何 router 资源表中引用                   |

**MCP 统计：** 5 个 | 已纳入资源表：2 个 | 未纳入：3 个

---

## Skill

| 名称                             | 类型  | 位置                                       | 功能域            | 路由资源表引用        |
| -------------------------------- | ----- | ------------------------------------------ | ----------------- | --------------------- |
| ui-ux-pro-max                    | skill | `skills/ui-ux-pro-max/SKILL.md`            | frontend          | ✅ frontend router.md |
| nuxt-ui                          | skill | `skills/nuxt-ui/`                          | frontend          | ❌ 未引用             |
| supabase                         | skill | `skills/supabase/`                         | backend / quality | ❌ 未引用             |
| supabase-postgres-best-practices | skill | `skills/supabase-postgres-best-practices/` | backend           | ❌ 未引用             |
| turborepo                        | skill | `skills/turborepo/`                        | devops / shared   | ❌ 未引用             |

**Skill 统计：** 5 个 | 已纳入资源表：1 个 | 未纳入：4 个

---

## 领域映射汇总

| 领域     | MCP 覆盖                  | Skill 覆盖                                 | 状态                        |
| -------- | ------------------------- | ------------------------------------------ | --------------------------- |
| frontend | nuxt-ui                   | ui-ux-pro-max, nuxt-ui                     | ⚠️ skill/nuxt-ui 未入资源表 |
| backend  | supabase                  | supabase, supabase-postgres-best-practices | ⚠️ 2 skill 未入资源表       |
| devops   | windows-cli               | turborepo                                  | ❌ 均未入资源表             |
| shared   | —                         | turborepo                                  | ❌ 未入资源表               |
| ai       | tavily_search             | —                                          | ⚠️ tavily 未入资源表        |
| quality  | supabase, chrome-devtools | supabase                                   | ⚠️ 部分未入资源表           |

---

## 变更记录

| 日期 | 变更类型 | 资源 | 说明       |
| ---- | -------- | ---- | ---------- |
| —    | —        | —    | 首次初始化 |

---

## 行为约束

- 此文件是 governance 中所有资源引用的**真实来源（source of truth）**
- 添加/删除 MCP 或 Skill 后，必须先更新此文件，再通过 `sync.md` 传播到各 router.md
- 任何 router.md 的资源表引用不得超出此注册表的范围
