# 资源注册表

## 职责

`resources/registry.md` 是项目所有 MCP 和 Skill 的**权威清单**。每次变更后同步到此文件，确保 governance 其他模块中的资源引用与实际可用资源一致。

---

## MCP 服务

| 名称            | 类型 | 来源                  | 实际位置                       | 功能域                     | 路由资源表引用                                     |
| --------------- | ---- | --------------------- | ------------------------------ | -------------------------- | -------------------------------------------------- |
| supabase        | MCP  | `mcp.json`            | 项目级 + 全局 MCPS 注册        | backend / quality / devops | ✅ backend/ai/quality router.md                    |
| nuxt-ui         | MCP  | `mcp.json`            | 项目级 + 全局 MCPS 注册        | frontend                   | ✅ frontend router.md                              |
| tavily_search   | MCP  | 全局（Trae IDE 内置） | `~/.trae-cn/mcps/s_{project}/` | ai / general               | ⚠️ 仅在 document-query.md 提及，未入 router 资源表 |
| chrome-devtools | MCP  | 全局（Trae IDE 内置） | `~/.trae-cn/mcps/s_{project}/` | frontend / quality         | ❌ 未在任何 router 资源表中引用                    |
| windows-cli     | MCP  | 全局（Trae IDE 内置） | `~/.trae-cn/mcps/s_{project}/` | devops                     | ❌ 未在任何 router 资源表中引用                    |

**MCP 统计：** 5 个（project: 2 + global: 3）| 已纳入资源表：2 个 | 未纳入：3 个

---

## Skill

| 名称                             | 类型  | 来源     | 实际位置                                          | 功能域            | 路由资源表引用                      |
| -------------------------------- | ----- | -------- | ------------------------------------------------- | ----------------- | ----------------------------------- |
| ui-ux-pro-max                    | skill | 原生目录 | `skills/ui-ux-pro-max/`                           | frontend          | ✅ frontend router.md               |
| nuxt-ui                          | skill | Junction | `skills/nuxt-ui/` → `.agents/skills/nuxt-ui/`     | frontend          | ✅ frontend router.md               |
| supabase                         | skill | Junction | `skills/supabase/` → `.agents/skills/supabase/`   | backend / quality | ✅ backend/ai router.md             |
| supabase-postgres-best-practices | skill | Junction | `skills/supabase-postgres/` → `.agents/skills/`   | backend           | ✅ backend router.md                |
| turborepo                        | skill | Junction | `skills/turborepo/` → `.agents/skills/turborepo/` | devops / shared   | ✅ backend/devops/quality router.md |

**Skill 统计：** 5 个（原生: 1 + Junction: 4）| 已纳入资源表：5 个 | 未纳入：0 个

---

## 领域映射汇总

| 领域     | MCP 覆盖                  | Skill 覆盖                                 | 状态                              |
| -------- | ------------------------- | ------------------------------------------ | --------------------------------- |
| frontend | nuxt-ui + chrome-devtools | ui-ux-pro-max, nuxt-ui                     | ⚠️ chrome-devtools MCP 未入资源表 |
| backend  | supabase                  | supabase, supabase-postgres-best-practices | ✅ 全部已入表                     |
| devops   | windows-cli               | turborepo                                  | ⚠️ 均未入资源表                   |
| shared   | —                         | turborepo                                  | ⚠️ 未入资源表                     |
| ai       | tavily_search             | —                                          | ⚠️ tavily 未入资源表              |
| quality  | supabase, chrome-devtools | supabase                                   | ⚠️ chrome-devtools 未入资源表     |

---

## 变更记录

| 日期       | 变更类型 | 资源 | 说明                                          |
| ---------- | -------- | ---- | --------------------------------------------- |
| 2026-07-01 | 修正     | —    | 区分 project/global 来源，修正 Skill 引用状态 |

---

## 行为约束

- 此文件是 governance 中所有资源引用的**真实来源（source of truth）**
- 添加/删除 MCP 或 Skill 后，必须先更新此文件，再通过 `sync.md` 传播到各 router.md
- 资源按来源分三类：
  - **原生目录** — 直接在 `.trae/skills/` 中有实体文件和 SKILL.md
  - **Junction（符号链接）** — `.trae/skills/` 中是目录符号链接，实际文件在 `.agents/skills/`
  - **全局 MCPS** — 在 `~/.trae-cn/mcps/s_{project}/` 中有注册，Trae IDE 自动注入
