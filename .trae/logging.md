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

### EVAL — 评估层

```
[EVAL:start]      START  | 开始评估               | domain=frontend;type=create
[EVAL:step]       OK     | ①完成检查清单          | checks=4;passed=4
[EVAL:step]       OK     | ②验证文件完整性        | files=3;expected=3;extra=0
[EVAL:step]       FAIL   | ③质量门禁              | check=check-types;errors=2;location=Composable.ts:15
[EVAL:step]       SKIP   | ④回归验证              | reason=无外部引用方
[EVAL:step]       OK     | ⑤范围检查              | plan_files=3;actual=3;extras=0
[EVAL:step]       OK     | ⑥输出评估报告          | conclusion=PASS
[EVAL:step]       OK     | ⑦写入经验数据         | path=.trae/experience/frontend/create-2026-07-01.json
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
