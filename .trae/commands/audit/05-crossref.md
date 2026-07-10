# Step 5: 交叉引用一致性审计

检查所有跨文件引用关系的一致性。

## 5a. AGENTS.md ↔ hooks/README.md 一致性

- 将 `AGENTS.md` 生命周期图和 `hooks/README.md` 生命周期图分别归一化为 `{事件名, 脚本文件名, [注入规则]}` 三元组列表
  - 解析：读取代码块中每一行，提取箭头左侧的事件名、箭头右侧的脚本文件名、说明中的规则文件名列表
- 逐行对比两个三元组列表
- 对比两份文档中都出现的规则文件名：生命周期事件和注入方式必须一致

## 5b. hooks/README.md ↔ hooks.json 一致性

- 从 `hooks/README.md`"事件明细"表提取 `{事件名, 脚本名, 类型, 作用}`
- 从 `hooks/README.md`"生命周期联动图"提取 `{事件名, 脚本文件名, [注入规则]}`
- 从 `hooks.json` 提取 `{事件名, 脚本文件名, hook 数组长度}`
- 逐事件对比：事件名一致、脚本名是 command basename、hook 绑定个数匹配
- "规则 ↔ Hook 映射"表验证：每行规则文件存在、事件是 hooks.json 的 key、"不通过 hooks 的规则"排除映射表中出现的规则

## 5c. hooks/README.md ↔ .ps1 文件 行为一致性

- 对 README 中每个脚本的描述提取关键词，用关键词集匹配 `.ps1` 实际内容：
  - "拦截破坏性 SQL" → 关键词 `{DROP, TRUNCATE, DELETE, ALTER}`
  - "指向规则" → 验证包含 `.trae/rules/xxx.md` 引用
  - "安全拦截" → 验证包含 `decision = 'block'` 或 `exit 1` 等阻断逻辑
  - "质量提醒" → 验证包含质量相关命令
- 匹配失败则报告"脚本描述与实际不一致"

## 5d. rules/README.md ↔ 其他文件 一致性

- **目录结构图**：提取 `rules/README.md` 中"目录结构"代码块的文件名列表，与实际文件对比
- **生效方式表**：逐行对比 `rules/README.md` 表与 `AGENTS.md` 规则表，规则名和生效方式必须一致
- **Hooks 注入关系表**：提取 `{生命周期事件, 脚本文件名, [注入规则]}` 三元组，与 hooks.json 对比
- **Three-way 约束**：将 `AGENTS.md`、`hooks/README.md`、`rules/README.md` 三份文件的 hooks 生命周期部分归一化为三元组列表，三个列表必须一致

## 5e. commands/README.md ↔ audit.md 一致性

- 提取 `commands/README.md` 中 `/audit` 的描述文本，提取 `audit.md` 中所有一级步骤名称
- 检查描述是否覆盖所有步骤（语义匹配），未覆盖则自动更新
- 命令表与 `.trae/commands/` 实际文件列表对比，缺漏则追加

## 5f. `.trae/rules/` 内规则间的交叉引用

- 扫描每个 `.md` 文件中匹配 `\.trae/rules/[a-zA-Z0-9_\-/]+\.md` 的引用路径
- 构建有向引用图 `{源文件 → [被引用文件列表]}`
- 对每对 `(A → B)`，检查 `(B → A)` 是否存在，不存在则报告"单向引用未回指"（仅提醒）

## 输出摘要

```
[{步骤5 交叉引用}] AGENTS↔hooks {N} | hooks↔hooks.json {N} | 脚本描述 {N} | rules/README {N} | commands/README {N} | 规则间 {N}
```
