# Trae 命令

`.trae/commands/` 目录下的命令通过 `/` 前缀在对话中直接触发。

## 可用命令

| 命令     | 文件       | 用途                                              |
| -------- | ---------- | ------------------------------------------------- |
| `/audit` | `audit.md` | 全量扫描治理架构，检查 Skills/MCP/规则/配置一致性 |

> `/audit` 的详细步骤存放在 `audit/` 子目录下，编排器按步骤逐一加载。

## 使用方式

在对话中输入 `/命令名` 即可触发 AI 执行对应流程。

## 命令清单

### `/audit`

全量扫描项目治理架构，覆盖 **资源存在性 + 交叉引用一致性** 两个维度：

**存在性维度**（单个资源是否正常存在）：

- Skills junction 完整性（`.agents/skills/` ↔ `.trae/skills/`）
- MCP 工具描述文件存在性
- 规则文件 frontmatter 元数据完整性
- Hooks 绑定完整性（`hooks.json` ↔ `.ps1` 文件 ↔ 内部规则引用）
- 环境变量与 `.env.example` 一致性

**交叉引用维度**（资源间的引用关系是否正确）：

- `AGENTS.md` ↔ 规则文件（树形图、规则表、生效方式、适用场景）
- `AGENTS.md` ↔ `hooks.json`（生命周期图一致性）
- `AGENTS.md` ↔ `hooks/README.md`（生命周期图、规则映射一致性）
- `hooks/README.md` ↔ `hooks.json`（事件明细表一致性）
- `hooks/README.md` ↔ `.ps1` 脚本（行为描述一致性）
- `rules/README.md` ↔ `AGENTS.md` / `hooks.json`（三路一致性）
- `commands/README.md` ↔ `audit.md`（命令描述覆盖度）
- 规则文件间的交叉引用有效性

执行后输出结构化的审计报告。
