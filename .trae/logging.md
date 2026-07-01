# 日志规范

## 目的

各关键节点输出结构化日志，便于任务卡住时快速定位断点位置。每个日志条目独立一行，按统一格式输出。

## 日志格式

```
[LAYER:step] STATUS | 描述 | key=value;key=value
```

各字段说明：

| 字段      | 必填 | 说明           | 可选值                                                  |
| --------- | ---- | -------------- | ------------------------------------------------------- |
| LAYER     | 是   | 当前层级       | ROUTE / WORKFLOW / PLAN / ENGINE / EVAL / LOOP / EVOLVE |
| step      | 是   | 当前步骤标识   | 见各层细分                                              |
| STATUS    | 是   | 当前状态       | OK / FAIL / START / END / SKIP / RETRY / BLOCKED        |
| 描述      | 是   | 一句话说明     | 自由文本                                                |
| key=value | 否   | 附带的关键数据 | 见各层约定                                              |

## 各层日志约定

### ROUTE — 路由层

```
[ROUTE:parse]     START  | 解析用户请求           | input=给dashboard加组件
[ROUTE:match]     OK     | 匹配领域               | domain=frontend;agent=ui-designer
[ROUTE:conflict]  OK     | 无冲突                 | priority=1
[ROUTE:chain]     OK     | 依赖链编排完成          | steps=3;order=devops→backend→frontend
[ROUTE:fallback]  SKIP   | 无匹配回退             | reason=无关键词匹配;fallback=solo-agent
```

### ENGINE — 执行层

```
[ENGINE:start]    START  | 开始执行               | domain=frontend;type=create
[ENGINE:step]     OK     | 创建组件文件           | file=component.vue;size=120lines
[ENGINE:tool]     OK     | 调用nuxt-ui MCP       | action=get-component;target=USelectMenu
[ENGINE:tool]     FAIL   | MCP调用失败            | tool=supabase;error=timeout;retry=1
[ENGINE:step]     OK     | 注册路由               | file=pages/index.vue;changed=1
[ENGINE:done]     END    | 执行完成               | files=3;tools=5;errors=0
```

### GUARD — 守卫节点

```
[GUARD:dedup]     SKIP   | 工具去重触发           | tool=pnpm;hash=a1b2c3;call_count=2
[GUARD:scope]     BLOCKED| 越界拦截               | file=超出范围文件;scope=限定范围
[GUARD:tool]      BLOCKED| 非法工具                | tool=未注册工具;allowed=允许列表
[GUARD:destructive]WARN   | 破坏性操作              | action=命令详情;confirmed=true/false
[GUARD:context]   FAIL   | 依赖链上下文缺失        | missing_key=缺失字段;required_by=需要方
```

### SILENT — 静默成功检测

```
[SILENT:zero]     FAIL   | 文件零字节              | file=文件名;size=0;action=要求重新创建
[SILENT:unchanged]FAIL   | 文件内容无变更           | file=文件名;before=hash;after=hash;same=true
[SILENT:empty]    FAIL   | 工具返回空              | tool=工具名;retry=1;action=重试
[SILENT:noop]     FAIL   | 命令执行无产出          | cmd=命令;exit=0;stdout=空;stderr=空
[SILENT:git-diff] FAIL   | Git 无 diff             | changed_files=0;expected=N
[SILENT:mcp]     FAIL   | MCP 静默失败            | mcp=名称;status=success;payload=空
[SILENT:escalate]BLOCKED | 连续静默失败升级        | count=2;action=升级loop-governance
```

### EVAL — 评估层

```
[EVAL:start]      START  | 开始评估               | domain=frontend;type=create
[EVAL:step]       OK     | ①完成检查清单          | checks=4;passed=4
[EVAL:step]       OK     | ②验证文件完整性        | files=3;expected=3;extra=0
[EVAL:step]       FAIL   | ③质量门禁              | check=check-types;errors=2;location=Composable.ts:15
[EVAL:step]       SKIP   | ④回归验证              | reason=无外部引用方
[EVAL:step]       OK     | ⑤范围检查              | plan_files=3;actual=3;extras=0
[EVAL:step]       OK     | ⑥输出评估报告          | conclusion=PASS
[EVAL:step]       OK     | ⑦写入经验数据         | path=.trae/memory/experience/frontend/create-2026-07-01.json
[EVAL:done]       END    | 评估完成               | conclusion=PASS;passed=6;failed=0;skipped=1
```

### LOOP — 循环治理

```
[LOOP:enter]      START  | 进入循环治理           | task_id=habits-123;trigger=eval-fail
[LOOP:cycle]      RETRY  | re-execute 第1次       | attempts=1/3;failure=check-types;prior_attempt=❌同错误
[LOOP:retry-wait] OK     | 退避等待               | wait_ms=4000;jitter=12%
[LOOP:tool-dedup] SKIP   | 工具调用去重触发        | action=pnpm check-types;hash=a1b2c3;reason=完全相同
[LOOP:semantic]   BLOCKED| 语义循环检测触发       | pattern=同文件同行号;conclusion=升级re-plan
[LOOP:context]    OK     | 上下文压缩             | original=34KB;compressed=12KB;kept=cycles+errors+change
[LOOP:cost]       WARN   | 工具调用数预警          | calls=28/30;limit=30
[LOOP:anchor]     OK     | 目标锚定通过            | deviation=5%;original=dashboard组件;current=组件+样式
[LOOP:exit]       END    | 退出循环               | exit_by=上限;cycles=3;result=re-plan→人工;path=.trae/loop-state/task-123-cycle-3.json
```

### EVOLVE — 元治理（慢循环）

```
[EVOLVE:collect]  OK     | 收集经验数据           | domain=frontend;records=12;period=3天
[EVOLVE:aggregate]START  | 开始聚合分析           | threshold=10次;trigger=次数达标
[EVOLVE:analyze]  OK     | 根因分析完成           | top=类型错误;count=4/12;gap=eval遗漏check-types
[EVOLVE:propose]  OK     | 生成提案               | target=execution-engine/frontend/constraint.md;type=收紧;auto_apply=true
[EVOLVE:contradict]OK    | 矛盾检测通过           | checked=12rules;conflict=none
[EVOLVE:compare]  OK     | 多提案比较完成          | total=2;winner=方案B;reason=影响范围更小
[EVOLVE:apply]    OK     | 应用变更               | file=execution-plan/frontend/heuristic.md;change=+Agent映射表;auto=true
[EVOLVE:verify]   START  | 开始验证               | task_count=0/3;remaining=3
[EVOLVE:verify]   OK     | 验证完成               | task_count=3/3;passed=3;failed=0;conclusion=保留变更
[EVOLVE:rollback] OK     | 回滚变更               | file=execution-engine/frontend/constraint.md;revert_to=version-3;reason=验证失败3/3
```

## 日志输出规则

1. **状态切换必记** — START / OK / FAIL / END 每步都必须有日志
2. **错误必记详情** — FAIL 必须附带 error / location / context 信息
3. **循环必记次数** — 所有 RETRY 和 BLOCKED 必须附带 cycle 号
4. **耗时操作必记** — 超过 5 秒的操作需要 START + END 对
5. **不得累积** — 每步独立一行，不要合并多步到一条日志

## 最终路径摘要

**任务完成后，必须在输出中附加一条追踪路径摘要**，压缩显示本次任务经历的全链路。

### 格式

```
任务执行追踪 (task: "<任务简要描述>")
  路径: [LAYER] → [LAYER] → [LAYER] → ...
  关键节点:
    ROUTE → {domain} ({agent})
    PLAN  → {task-type}
    ENGINE→ {关键步骤摘要}
    {LOOP → N 次循环}
    EVAL  → {评估结果}
    EVOLVE→ {经验已收集 / 触发进化}
  总耗时: {循环次数} / {估算耗时}
  结论: ✅ 通过 / ❌ 不通过 / ⚠️ 人工介入
```

### 示例

```
任务执行追踪 (task: "给 dashboard 加 habits 列表")
  路径: ROUTE → PLAN → ENGINE → EVAL → LOOP → ENGINE → EVAL
  关键节点:
    ROUTE → frontend (ui-designer)
    PLAN  → frontend/create
    ENGINE→ 创建组件 → 注册导航 → 添加国际化 key
    EVAL  → ③质量门禁 FAIL (check-types ×2)
    LOOP  → re-execute ① (修复类型错误) → ② (修复未定义变量)
    ENGINE→ 修复类型错误
    EVAL  → ③质量门禁 OK ✅
  循环: 2 次 re-execute
  结论: ✅ 通过
```

```
任务执行追踪 (task: "配置 GitHub Actions 自动部署")
  路径: ROUTE → PLAN → ENGINE → EVAL
  关键节点:
    ROUTE → devops (devops-architect)
    PLAN  → devops/ci
    ENGINE→ 创建 .github/workflows/deploy.yml
    EVAL  → ①文件完整性 ✅ | ③语义验证 ✅ | ⑤范围检查 ✅
  循环: 0 次
  结论: ✅ 通过
```

```
任务执行追踪 (task: "接入 DeepSeek 对话模型")
  路径: ROUTE → PLAN → ENGINE → EVAL → LOOP → LOOP → HUMAN
  关键节点:
    ROUTE → ai (ai-integration-engineer)
    PLAN  → ai/integrate
    ENGINE→ 创建 service → 配置 provider
    EVAL  → 密钥硬编码 FAIL → 修复 → EVAL FAIL → 同错误
    LOOP  → re-execute ① (移动 env) → re-execute ② (仍暴露)
    LOOP  → 语义循环检测 → re-plan → 仍出同类问题
    HUMAN → 人工介入
  循环: 3 次 re-execute → 1 次 re-plan (已超上限)
  结论: ⚠️ 人工介入
```

### 应用位置

- 单步任务：在 evaluation 最终结果之后输出
- 依赖链任务：在整条链完成后输出全链追踪，每步独立输出子追踪
- 人工介入：在人工报告末尾输出，附带卡住原因
