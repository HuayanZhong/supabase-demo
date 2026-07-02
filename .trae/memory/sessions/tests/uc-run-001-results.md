# 使用层面测试 Run-001 结果

---

## U1 — 执行中用户打断

**输入**：后端 API 写到一半，用户说"等一下，先别执行，我改个需求"

**当前框架检查**：

- router.md: 无"中断"相关机制
- loop-timer.md: 有 cancel/pause，但那是循环级别的，不是单次任务的
- execution-engine/constraint.md: git guard 有 "snapshot"（commit wip），但那是防止脏工作区的，不是 checkpoint

**结果**: **FAIL** ⚠️

**缺失机制**: 任务级 checkpoint 系统。当前框架有 git snapshot（commit wip），但没有标准化的 checkpoint 恢复机制——无法回答"断在哪里"和"从哪恢复"。

**预期日志**:

```
[ENGINE:interrupt]  START | 用户打断            | step=3/5;task=写API路由
[ENGINE:checkpoint] SAVE  | 保存检查点          | step=3;files_changed=2;scope=backend
[ENGINE:checkpoint] DONE  | 已暂停              | resume_with=/continue TIMER-xxx
```

**实际框架**:

```
(无此日志——机制不存在)
```

---

## U2 — 执行中用户补充

**输入**：后端 API 写到一半，用户说"这个接口再加个分页参数"

**当前框架检查**：

- scope 守卫是任务开始前设置的，不支持中途追加
- router.md 无"增量追加"概念

**结果**: **FAIL** ⚠️

**缺失机制**: 任务执行中的 scope 追加机制。当前必须是"任务开始时定好 scope"，中途无法追加。

**预期日志**:

```
[ENGINE:amend]   START  | 用户补充需求           | current_step=3;amendment=加page参数
[ENGINE:amend]   EVAL   | 评估影响               | scope_extend=true;current_step可保留
[ENGINE:amend]   SAVE   | 更新 scope             | scope=original+分页参数
```

---

## U3 — 用户否定自己

**输入**：前端表格已完成，用户说"算了别用表格了，改成卡片布局"

**当前框架检查**：

- 有回滚策略，但回滚是为了"依赖链失败回滚"不是"用户方向变更回滚"
- 无"撤销已完成工作"的机制

**结果**: **FAIL** ⚠️

**缺失机制**: 方向变更回滚——用户否定已完成工作时的撤销机制。与 U2 的区别：U2 是追加，U3 是替换。

**预期日志**:

```
[ENGINE:redirect] START | 用户方向变更           | completed=表格组件;new=卡片布局
[ENGINE:redirect] UNDO  | 撤销已完成             | file=TableComponent.vue;revert=git revert
[ENGINE:redirect] REBASE| 重新规划               | scope=card-layout
```

---

## U4 — 部分接受

**输入**：全栈任务（后端+前端+测试），用户说"后端写完了，前端先不用了"

**当前框架检查**：

- router.md 依赖链有回滚策略，但那是"失败回滚"不是"部分提交"
- 无"只提交链中某一段"的能力

**结果**: **FAIL** ⚠️

**缺失机制**: 依赖链的部分提交——用户可能只接受链中的部分成果。当前要么全提交要么全回滚。

**预期日志**:

```
[ENGINE:partial]  START | 部分接受               | completed=backend;remaining=frontend,test
[ENGINE:partial]  SUBMIT| 提交已完成             | target=backend;action=git commit
[ENGINE:partial]  DROP  | 放弃未完成             | target=frontend,test;action=标记废弃
```

---

## U5 — 多重打断

**输入**：连续 3 次打断，每次改方向（表格→卡片→列表→表单）

**当前框架检查**：

- 无频繁方向变更检测

**结果**: **FAIL** ⚠️

**缺失机制**: 频繁变更检测——当用户在短时间内多次改变需求时，框架应主动提示。

**预期日志**:

```
[ENGINE:redirect] START | 方向变更 #1            | direction=table→card
[ENGINE:redirect] START | 方向变更 #2            | direction=card→list
[ENGINE:redirect] START | 方向变更 #3            | direction=list→form
[ENGINE:redirect] WARN  | 频繁变更检测           | changes=3/3;limit=3;action=建议用户先确认需求
```

---

## V1 — AI 会话超时恢复

**输入**：长时间无响应后重新发起会话

**当前框架检查**：

- memory/policy.md: "会话中断后恢复 → 读取中断会话的最后状态" — 有描述，但无"任务级别"的 checkpoint
- loop-governance.md: "工作区一致性校验 + 状态文件持久化" — 有覆盖循环治理的，但单次任务的没有
- memory/heuristic.md: Bootstrap 策略有 sessions/ 加载 — 但 sessions 存的是完成后的摘要，不是中间状态

**结果**: **FAIL** ⚠️

**缺失机制**: 任务级 checkpoint 持久化 + 恢复入口。policy.md 的"会话中断后恢复"只能恢复会话层面的上下文，不能恢复"任务执行到哪一步"。

**预期日志**:

```
[MEM:bootstrap]   WARN   | 发现未完成任务        | task_id=xxx;checkpoint=step=3/5
[MEM:bootstrap]   RECOVER| 恢复任务              | task_id=xxx;from_step=3;scope=backend
```

---

## V2 — 用户关闭 IDE 后重新打开

**输入**：任务执行到一半关闭 IDE，重新打开后恢复

**当前框架检查**：

- loop-governance.md: 有 git diff 校验工作区一致性 + 不一致上报人工
- execution-engine/constraint.md: git guard 有 snapshot 机制

**结果**: **PASS** ✅

**实际日志**:

```
[GUARD:git]       WARN   | 工作区检查            | dirty=true;snapshot=commit wip
[LOOP:state]      CHECK  | 工作区一致性           | git_diff=不一致;expected=中断前;actual=当前
[LOOP:state]      INCONSISTENT | 外部修改         | action=上报人工
```

**说明**: V2 实际上已有覆盖。loop-governance.md 和 constraint.md 的 git 守卫 + 一致性校验可以处理关闭 IDE 的场景。无需新增。

---

## V3 — MCP 中途断连

**输入**：依赖链第 2 步时 supabase MCP 不可用

**当前框架检查**：

- degradation-registry.md: 有 supabase MCP 的降级方案（execute_sql 直连）
- 但 degradation-registry 只在"任务开始时"检查 MCP 可用性，不支持"执行中"断连

**结果**: **FAIL** ⚠️

**缺失机制**: MCP 在执行过程中的健康检查 + 断连时的降级触发。当前降级方案只覆盖初始可用性检查，不覆盖运行中检查。

**预期日志**:

```
[ENGINE:tool]      FAIL   | MCP 断连              | tool=supabase;step=2/3;error=connection_lost
[ENGINE:degrade]   TRIGGER| 触发降级              | mcp=supabase;fallback=execute_sql
[ENGINE:degrade]   OK     | 降级执行成功          | degraded=true;result=查询完成
[ENGINE:degrade]   WARN   | 写入经验              | action=下次聚合优先修复 MCP 连接
```

---

## V4 — pnpm 冲突（git 冲突）

**输入**：迁移执行到一半，另一个人改了同文件

**当前框架检查**：

- execution-engine/constraint.md: git guard 有 snapshot + 冲突检测
- "若检出冲突 → 上报人工解决" 已有

**结果**: **PASS** ✅

**实际日志**:

```
[GUARD:git]       START  | git 守卫              | action=git stash
[GUARD:git]       FAIL   | 检出冲突              | file=migration.ts;type=merge conflict
[GUARD:git]       FAIL   | 请求人工解决           | action=上报人工
```

**说明**: git 守卫的冲突检测已覆盖此场景。

---

## W1 — 路由纠正

**输入**：用户说"不对，这个应该在 devops 里做"

**当前框架检查**：

- router.md: 有 re-route 机制（BUG-001 修复），最大 2 次
- 但 re-route 是"自动重新路由"不是"用户手动纠正路由"

**结果**: **PASS** ✅

**实际日志**:

```
[ROUTE:re-route]   COUNT  | 用户纠正路由          | reason=用户明确指定devops;count=1/2;action=重新路由到devops
```

**说明**: re-route 机制（max=2）天然支持用户纠正路由。

---

## W2 — 质量要求豁免

**输入**：用户说"不需要写测试，直接部署"

**当前框架检查**：

- execution-engine/constraint.md: 无"约束豁免"机制
- scope 守卫有 fast-path 降级为 WARN，但约束豁免是针对评估阶段的

**结果**: **FAIL** ⚠️

**缺失机制**: 用户显式要求跳过某个评估约束的机制。任务级别不应有`禁止跳过`的硬规则，用户有权决定不写测试。

**预期日志**:

```
[GUARD:override]  START  | 用户豁免               | constraint=必须写测试;reason=用户明确跳过
[GUARD:override]  LOG    | 记录豁免               | context=部署紧急;action=eval 不阻断此约束
```

---

## W3 — 需求收缩

**输入**：用户说"只需要做查询，不用增删改"

**当前框架检查**：

- 无 scope 缩减机制

**结果**: **FAIL** ⚠️

**缺失机制**: scope 缩减——与 U2 的 scope 扩展对应，但需丢弃已完成的部分。

**预期日志**:

```
[ENGINE:shrink]   START  | 用户缩减 scope         | original=CRUD;remaining=R(查询)
[ENGINE:shrink]   DROP   | 放弃超出部分           | extra=create,update,delete;action=标记废弃
```

---

## W4 — 需求膨胀

**输入**：用户说"再加一个导出功能"

**当前框架检查**：

- 无 scope 膨胀检测

**结果**: **FAIL** ⚠️

**缺失机制**: scope 膨胀检测——当用户需求明显超出当前任务范围，应提示"这可能是新任务"。

**预期日志**:

```
[ENGINE:scope]     WARN   | 需求膨胀检测          | original=CRUD;amendment=导出;action=建议新任务
[ENGINE:scope]     ACCEPT | 用户坚持               | action=追加到当前任务
```

---

## X1 — 异常 + 打断复合

**输入**：迁移报错 + 用户说"先停下"

**当前框架检查**：

- 有异常处理（re-execute/回滚）
- 有打断意图，但无 checkpoint
- 组合场景无覆盖

**结果**: **FAIL** ⚠️

**缺失机制**: 异常→打断→恢复的完整链路。

**预期日志**:

```
[ENGINE:migration]  FAIL   | 迁移失败              | error=字段已存在
[ENGINE:interrupt]  START  | 用户打断              | action=先停下
[ENGINE:rollback]   EXECUTE| 回滚迁移              | command=pnpm migration:down
[ENGINE:checkpoint] SAVE   | 保存检查点            | step=失败前;scope=backend
[ENGINE:checkpoint] DONE   | 已暂停                | resume_with=手动修复后/continue
```

---

## X2 — 中断 + 环境变化

**输入**：中断期间依赖升级

**当前框架检查**：

- 无环境一致性校验机制

**结果**: **FAIL** ⚠️

**缺失机制**: 环境一致性校验——恢复时检查 pnpm-lock.yaml / .nvmrc 是否与 checkpoint 一致。

**预期日志**:

```
[MEM:recover]     START  | 检查环境一致性         | checkpoint_ts=2026-07-01T10:00:00
[MEM:recover]     WARN   | 环境已变化             | pnpm-lock.yaml=changed;nvmrc=unchanged
[MEM:recover]     ACTION | 建议先 pnpm install    | reason=依赖可能已变化
```

---

## 汇总

| 用例        | 结果 | 缺失机制          |
| ----------- | ---- | ----------------- |
| U1 用户打断 | FAIL | checkpoint 系统   |
| U2 用户补充 | FAIL | scope 追加        |
| U3 否定自己 | FAIL | 方向变更回滚      |
| U4 部分接受 | FAIL | 部分提交          |
| U5 多重打断 | FAIL | 频繁变更检测      |
| V1 会话超时 | FAIL | 任务级 checkpoint |
| V2 关闭 IDE | PASS | —                 |
| V3 MCP 断连 | FAIL | 运行中健康检查    |
| V4 git 冲突 | PASS | —                 |
| W1 路由纠正 | PASS | —                 |
| W2 质量豁免 | FAIL | 约束豁免机制      |
| W3 需求收缩 | FAIL | scope 缩减        |
| W4 需求膨胀 | FAIL | 膨胀检测          |
| X1 复合异常 | FAIL | 异常+打断链路     |
| X2 环境变更 | FAIL | 环境一致性校验    |

**总计**: 12 FAIL / 3 PASS
