# Constraint — 执行阶段通用硬约束

## 执行前约束

- 开始执行前，必须读取对应领域 `workflows/{domain}/{task-type}.md` 了解执行步骤
- 开始执行前，必须读取对应领域 `execution-plan/{domain}/` 了解规划约束/启发/策略
- 开始执行前，必须通过对应领域 `runtime/{domain}/router.md` 确认分配的资源
- 未明确领域归属的任务，必须回退总路由 `runtime/router.md` 重新分发

## 守卫节点（预执行校验）

**每次执行任何 action 之前，必须先通过守卫节点检查。** 守卫节点是执行前的前置防线，检测不通过 → 拦截 + 日志 + 不执行。

```
决策 → [守卫节点] → 通过 → 执行 → 验证
              ↓
           不通过 → 拦截 + 日志 + 升级/跳过
```

### 守卫规则

| 守卫项         | 检测条件                                                                                                                                                                | 通过              | 不通过                                                         |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | -------------------------------------------------------------- |
| **工具去重**   | 本次要调用的 `工具名+核心参数语义哈希` 是否与**同任务中**已调用过的重复（忽略空白和注释差异）                                                                           | ✅ 继续           | ❌ 拦截，输出 `[GUARD:dedup] SKIP`，记录重复次数               |
| **范围守卫**   | 本次操作的文件是否在任务 scope 内（以 `execution-plan` 输出的 scope 声明为准；无 scope 声明则 BLOCKED）                                                                 | ✅ 继续           | ❌ 拦截，输出 `[GUARD:scope] BLOCKED`，要求上报确认            |
| **工具守卫**   | 本次要调用的 MCP/skill 是否在对应 `runtime/{domain}/router.md` 的资源表中列出                                                                                           | ✅ 继续           | ❌ 拦截，输出 `[GUARD:tool] BLOCKED`，要求使用合法工具         |
| **破坏性守卫** | 命令或生成内容是否涉及破坏性操作（中英文关键词：delete/rm/format/init/reset/drop + 删除/清理/清除/销毁/抹除/格式化/移除/还原/重置/清空 + 内容扫描 DROP TABLE/TRUNCATE） | ✅ 标注风险后继续 | ⚠️ 拦截并输出 `[GUARD:destructive] WARN`，必须显式确认后再执行 |
| **依赖链守卫** | 当前任务是否依赖上一步骤的 context 输入？context 中是否有缺失的必要字段                                                                                                 | ✅ 继续           | ❌ 拦截，输出 `[GUARD:context] FAIL`，要求先获取缺失的上下文   |
| **幂等性守卫** | 部署、migration、seed 等操作是否已执行过（检查执行标记或数据库迁移记录）                                                                                                | ✅ 继续           | ❌ 拦截，输出 `[GUARD:idempotent] SKIP`，跳过重复执行          |
| **环境守卫**   | 当前环境是否为生产环境？生产环境下的破坏性命令需额外确认                                                                                                                | ✅ 继续           | ⚠️ 拦截，输出 `[GUARD:env] WARN`，生产环境必须双重确认         |
| **并发守卫**   | 目标文件/表是否正在被其他任务修改（检查 .trae/loop-state/ 中的活跃任务锁）                                                                                              | ✅ 继续           | ❌ 拦截，输出 `[GUARD:concurrent] BLOCKED`，等待或上报         |
| **git 守卫**   | 破坏性操作前 `git status` 是否干净（无未提交的无关变更）                                                                                                                | ✅ 继续           | ⚠️ 拦截，输出 `[GUARD:git] WARN`，要求先处理工作区             |

### 守卫细则

#### 工具去重哈希算法（BUG-004 修复）

"核心参数语义哈希"具体算法：

```
1. 提取核心参数：工具名 + 必填参数 + 影响范围的参数（忽略 verbose/dry-run 等开关）
2. 归一化：去除前后空白 + 参数按 key 字典序排序 + 路径转绝对路径
3. 哈希：SHA256(归一化后的字符串) → 取前 16 字符
4. 比较：与同任务中已调用过的工具哈希对比
```

示例：`pnpm check-types` 与 `pnpm check-types --verbose` 哈希相同（verbose 被忽略）。

#### 范围守卫 fast-path（BUG-002 修复）

- **有 execution-plan**：scope 以 plan 输出为准，越界 BLOCKED
- **无 execution-plan**（简单任务、对话型任务、快路径任务）：scope 守卫降级为 WARN（记录但不拦截），日志 `[GUARD:scope] WARN | no_plan=true;action=记录`
- **快路径判定**：任务输入含"重命名/格式修复/文档修订/查询/解释"等关键词，且无文件创建/删除时，走快路径

#### 幂等性检查机制（BUG-005 修复）

- **执行标记存储**：`.trae/loop-state/idempotent-marks.jsonl`，每行一个 JSON：`{"action":"migration","target":"apps/backend","ts":"...","hash":"..."}`
- **幂等性敏感操作清单**：migration / seed / deploy / database reset / index create / RLS policy apply
- **检查方式**：执行前读标记文件，匹配 `action+target+hash`，命中则 SKIP
- **hash 计算**：操作参数的 SHA256 前 16 字符（同工具去重算法）
- **标记写入时机**：操作成功完成后立即写入

#### git 守卫干净标准（BUG-006 修复）

- **干净定义**：`git status --porcelain` 输出为空，或仅包含当前任务已声明的文件
- **非干净判定**：存在未声明的 unstaged / staged / untracked 文件
- **处理建议优先级**：
  1. `git stash --include-untracked`（保留变更）
  2. 若 stash 失败 → `git commit -m "wip: 任务前快照"` 当前任务文件
  3. 仍失败 → 上报人工
- **与 ai-safety.md 协同**：ai-safety.md 禁止"修改超出任务描述范围的文件"，git 守卫是其在执行层的兜底

### 异常处理细则

#### 工具调用超时阈值（BUG-018 修复）

| 工具类型   | 超时阈值 | 超时动作                    |
| ---------- | -------- | --------------------------- |
| MCP 调用   | 30 秒    | 重试 1 次 → 降级方案        |
| Shell 命令 | 120 秒   | 重试 1 次 → 上报人工        |
| 文件读写   | 10 秒    | 不重试 → 上报人工（非临时） |
| 网络请求   | 60 秒    | 重试 3 次（退避 30s）→ 降级 |

超时日志：`[ENGINE:tool] WARN | 工具调用超时 | tool=xxx;timeout=30s;action=重试`

#### 降级方案库（BUG-019 修复）

每个 MCP 必须在 `.trae/resources/degradation-registry.md` 中登记降级方案：

| MCP             | 降级方案                                    | 触发条件          |
| --------------- | ------------------------------------------- | ----------------- |
| supabase        | 本地 PostgreSQL 直连（读 `.env` 连接串）    | MCP 不可用 / 超时 |
| nuxt-ui         | 查询本地组件文档 `.trae/resources/nuxt-ui/` | MCP 不可用        |
| tavily_search   | WebSearch 工具替代                          | MCP 不可用 / 超时 |
| chrome-devtools | 跳过浏览器验证，标记"未验证"                | MCP 不可用        |
| windows-cli     | Shell 工具替代（部分命令兼容）              | MCP 不可用        |

降级方案库维护规则：

- 新增 MCP 时，sync.md 必须同时登记降级方案
- 降级方案不可用 → 标记"无降级方案"并上报人工（违反 constraint.md L86）
- 降级方案执行后，必须在日志中标注 `degraded=true`

#### 运行时 MCP 健康检查（新增）

降级方案不仅用于"初始不可用"，也用于"运行时断连"：

```
[ENGINE:tool]      OK     | MCP 调用成功          | tool=supabase;step=2/3
[ENGINE:tool]      FAIL   | MCP 断连              | tool=supabase;error=connection_lost
[ENGINE:degrade]   TRIGGER| 触发运行时降级         | mcp=supabase;fallback=execute_sql
[ENGINE:degrade]   DONE   | 降级执行成功          | degraded=true;result=成功
```

**触发点**：每次 MCP 调用失败时自动触发，与初始可用性检查走同一降级方案库。不区分"初始"和"运行时"。

#### Checkpoint 系统（新增）

用于支持用户中断、会话超时恢复、异常后暂停（覆盖 U1、V1、X1）。

**触发点**：以下情况执行 checkpoint：

| 触发条件                          | 动作                              |
| --------------------------------- | --------------------------------- |
| 用户明确说"等一下/先停下/暂停"    | 保存 checkpoint → 暂停            |
| 任务过程中异常（失败/超时）       | 保存 checkpoint → 执行恢复策略    |
| 用户关闭 IDE（靠 git commit wip） | 工作区 recovery 时读取 checkpoint |
| 用户说"继续"                      | 读取 checkpoint → 从断点恢复      |

**数据格式**（写入 `.trae/loop-state/checkpoint-{task_id}.json`）：

```json
{
  "task_id": "TASK-001",
  "checkpoint_ts": "2026-07-02T15:00:00Z",
  "step_current": 3,
  "step_total": 5,
  "scope": "backend",
  "files_changed": ["apps/backend/src/api.ts"],
  "convergence_state": null,
  "env_snapshot": {
    "lock_hash": "sha256_of_pnpm-lock.yaml",
    "nvmrc": "24"
  }
}
```

**恢复流程**：

```
[MEM:recover]     START  | 发现 checkpoint        | task_id=TASK-001;step=3/5
[MEM:recover]     CHECK  | 环境一致性             | lock_hash=匹配;nvmrc=匹配
[MEM:recover]     OK     | 环境未变               | action=继续 step 4
[MEM:recover]     WARN   | 环境已变               | pnpm-lock.yaml=changed;action=pnpm install
[ENGINE:resume]   START  | 恢复任务               | from_step=4;scope=backend
```

#### 任务中 Scope 变更（新增）

覆盖用户补充（U2）、方向变更（U3）、scope 收缩（W3）、scope 膨胀（W4）。

**触发点**：用户在中途提出新需求或变更方向时。

| 变更类型           | 用户行为           | 框架判断                   | 动作                             |
| ------------------ | ------------------ | -------------------------- | -------------------------------- |
| scope 扩展（追加） | "再加一个分页参数" | 评估是否与当前任务兼容     | 兼容→追加；不兼容→建议新任务     |
| scope 缩减         | "不需要增删改了"   | 标记已完成中超出范围的部分 | 超出部分标记废弃                 |
| 方向变更（替换）   | "不要表格，要卡片" | 评估已完成的能否保留       | 不能保留→git revert；能保留→保留 |
| scope 膨胀         | "再加个导出功能"   | 判断是否超当前任务范围     | 超范围→建议新任务                |

**日志格式**：

```
[ENGINE:amend]   START  | 用户补充需求           | current_step=3;amendment=加page参数
[ENGINE:amend]   EVAL   | 评估影响               | scope_extend=true
[ENGINE:redirect] START | 方向变更               | completed=表格;new=卡片;revert=git revert
[ENGINE:shrink]   START | scope 缩减             | original=CRUD;remaining=R
[ENGINE:shrink]   DROP   | 放弃超出              | extra=CUD;action=标记废弃
[ENGINE:scope]    WARN   | 需求膨胀检测          | current=CRUD;amendment=导出;action=建议新任务
```

#### 频繁变更检测（新增，覆盖 U5）

同一任务内检测用户方向变更次数：

| 连续变更次数 | 动作                           |
| ------------ | ------------------------------ |
| 1 次         | 正常处理，记录方向             |
| 2 次         | 记录，提示"已变更两次"         |
| ≥ 3 次       | WARN，建议用户先确认需求再继续 |

```
[ENGINE:redirect] START | 方向变更 #1            | direction=table→card
[ENGINE:redirect] START | 方向变更 #2            | direction=card→list
[ENGINE:redirect] WARN  | 频繁变更               | changes=3≥3;action=建议先确认需求
```

计数器在任务完成后归零。

#### 约束豁免（新增，覆盖 W2）

用户有权显式跳过某个评估约束，但须记录：

| 豁免内容     | 触发方式         | 日志                                                                  |
| ------------ | ---------------- | --------------------------------------------------------------------- |
| 跳过测试     | 用户说"不写测试" | `[GUARD:override] START \| constraint=必须写测试;reason=用户明确跳过` |
| 跳过类型检查 | 用户说"先部署"   | `[GUARD:override] START \| constraint=check-types;reason=部署紧急`    |

**规则**：

- 必须是**用户主动要求**跳过，AI 不得主动建议跳过约束
- 每次豁免必须记录原因
- 豁免不改变约束本身，仅在本次任务中跳过
- 豁免记录写入 experience/，evolution 聚合时分析是否有滥用趋势

#### 部分提交（新增，覆盖 U4）

依赖链任务中，用户可接受链中部分步骤，放弃其余步骤。

```
[ENGINE:partial]  START | 用户部分接受          | completed=backend;remaining=frontend,test
[ENGINE:partial]  SUBMIT| 提交已完成            | target=backend;action=git commit
[ENGINE:partial]  DROP  | 放弃未完成            | target=frontend,test;action=标记废弃
```

**触发点**：依赖链执行中，用户说"XX 写完了，YY 先不用了"。

**规则**：

- 已完成的步骤提交（git commit）
- 未完成/放弃的步骤标记废弃（记录到 experience/）
- 依赖链后续步骤不再执行
- 下次 evolution 聚合时分析废弃原因

#### 并发上限（BUG-020 修复）

| 场景             | 并发上限 | 说明                                        |
| ---------------- | -------- | ------------------------------------------- |
| 单任务内工具调用 | 串行     | 默认串行，避免文件冲突                      |
| 多任务总并发     | 3        | 避免资源争用（与 router.md 多任务调度一致） |
| 共享文件操作     | 1        | 强制串行，避免冲突                          |
| git 操作         | 1        | 强制串行，避免 index 锁                     |

并发守卫日志：`[GUARD:concurrent] WARN | 并发超限 | current=N;limit=M;action=排队`

### 守卫失败处理

- 单次守卫拦截 → 记录日志，任务继续（AI 自主修正后重试）
- 同一守卫**连续 2 次**拦截 → 上报给 `loop-governance.md` 进入循环治理
- 守卫拦截是"保护性暂停"——不消耗 re-execute 计数

## 工具调用约束

- 调用 MCP 前，必须先通过 Read 读取对应工具的描述文件，确认参数后再调用
- 调用 skill 前，确保目标 skill 适用于当前领域，不得跨域调用无关 skill
- 不得直接调用未在工作流或路由资源表中列出的 MCP 或 skill
- 命令行工具（`RunCommand`）执行前，必须确认目标命令在当前操作系统（Windows）可用
- 涉及破坏性操作（删除、格式化、初始化）的命令，执行前必须标注风险
- **所有 MCP 调用必须定义降级路径** — 不得标记"无降级方案"，MCP 不可用时：
  1. 先重试 1 次（退避 60 秒）
  2. 仍不可用 → 标注待确认，输出 `[ENGINE:fallback] tool={name};action=标注待确认`
  3. 标注待确认的步骤不得阻塞后续不依赖该结果的步骤
  4. 任务完成时汇总所有"待确认"项上报 evaluation

## 执行过程约束

- 执行必须严格按 `workflows/{domain}/{task-type}.md` 的步骤顺序进行
- 每一步完成后必须确认输出符合预期后再进入下一步
- 执行中发现计划外的文件需要修改时，必须先上报再修改
- 涉及修改文件时，必须先 Read 当前内容再修改，不得凭记忆重写
- 涉及创建文件时，必须先确认目标路径是否存在，不存在则创建目录
- 单次工具写入内容超过 200 行时，应分段写入

## 验证约束

- 所有涉及类型定义变更的任务，必须执行类型检查
- 所有涉及代码变更的任务，必须执行 lint 和格式化验证
- 所有涉及配置文件变更的任务，必须验证配置语法正确性
- 验证命令因项目不同而异，以对应 workflow 中定义的命令为准

## 错误处理约束

- 执行中遇到错误时，必须停止当前步骤并记录错误信息
- 阻断性错误必须修复后才能继续，非阻断性错误记录后统一处理
- 同一错误连续 2 次修复失败时，暂停执行并上报
- 修改必须可回滚（通过 git），破坏性变更前确保工作区已提交

## 跨域约束

- 单领域任务不得修改其他领域代码（`apps/frontend/` 任务不得写 `apps/backend/`）
- 跨领域任务由总路由分配依赖链，每步 subagent 只处理自己领域部分
- 上一步输出结构化的 context JSON，下一步 subagent 先读 context 再执行
