# Subagent 参与度专项测试

## 测试焦点

1. plan 是否知道由哪个 subagent 执行
2. 多领域依赖链的每一步是否调用了正确的 subagent
3. 同一领域内跨 task-type 是否需要切换 subagent

---

## 场景 1 — 前端创建（单任务单 subagent）

"给 dashboard 加一个 habits 列表"

| 步骤                            | 文件                           | 期望 subagent   | 实际情况                            | 结果 |
| ------------------------------- | ------------------------------ | --------------- | ----------------------------------- | ---- |
| 路由 → frontend/create          | `runtime/frontend/router.md`   | **ui-designer** | router.md 明确写 ui-designer        | ✅   |
| Workflow → create.md            | `workflows/frontend/create.md` | ui-designer     | frontmatter 写 ui-designer          | ✅   |
| Plan → execution-plan/frontend/ | 3 文件                         | ui-designer     | **未提及** — 全是"前端规划"无执行者 | ❌   |

**问题 1:** execution-plan 不知道谁会执行，ui-designer 和 frontend-architect 都读同一套 plan，但两者的关注点不同。

---

## 场景 2 — 前端 i18n（同领域不同 subagent）

"给登录页按钮加中文翻译"

```
路由 → frontend/i18n → frontend-architect 执行
但前端 i18n 任务可能还需 ui-designer（涉及 UI 组件中新增 t() 调用）
```

| 步骤                                | subagent              | 结果 |
| ----------------------------------- | --------------------- | ---- |
| 路由决定：frontend-architect        | router.md L18         | ✅   |
| 但实际上要在 UI 组件中加 `t()` 调用 | 需要 ui-designer 经验 | ❌   |
| execution-plan 如何处理？           | 无指引                | ❌   |

**问题 2:** 同领域内不同 task-type 的 plan 没有区分 subagent 协作场景。

---

## 场景 3 — 头像上传（多领域依赖链）

"添加用户头像上传功能"

依赖链：`devops → backend → frontend`

| 步骤                          | 负责 subagent         | plan 是否指引到正确 subagent                   |
| ----------------------------- | --------------------- | ---------------------------------------------- | --- |
| Step 1 — devops 配存储桶      | **devops-architect**  | execution-plan/devops/ 未提及                  | ❌  |
| Step 2 — backend 写上传 API   | **backend-architect** | execution-plan/backend/ 未提及                 | ❌  |
| Step 3 — frontend 做上传组件  | **ui-designer**       | execution-plan/frontend/ 未提及                | ❌  |
| 上下文传递（存储配置→API→UI） | 3 个 subagent 串联    | runtime/router.md 写了依赖链但 plan 无交接机制 | ❌  |

**问题 3:** 依赖链的每一步没有文件指引 "此刻应由谁执行" + "交接上下文是什么"。

---

## 场景 4 — 独立多领域（并行）

"改登录页样式 + 添加后端健康检查 API"

| 子任务                        | subagent              | plan                                      |
| ----------------------------- | --------------------- | ----------------------------------------- | --- |
| frontend/style — 改登录页样式 | **ui-designer**       | execution-plan/frontend/ 无 subagent 指引 | ❌  |
| backend/create — 健康检查 API | **backend-architect** | execution-plan/backend/ 无 subagent 指引  | ❌  |
| 两者无依赖，可并行            | router.md 无依赖规则  | ✅                                        | ✅  |

---

## 场景 5 — Quality 审计（按业务域加载不同 subagent）

"审计后端 API 安全"

| 步骤                                | subagent                            | 实际情况                                |
| ----------------------------------- | ----------------------------------- | --------------------------------------- | --- |
| 路由 → quality/security             | **compliance-checker**              | router.md L17                           | ✅  |
| 但安全审计需要读取后端代码分析风险  | compliance-checker 需要了解后端架构 | compliance-checker agent 已更新安全部分 | ✅  |
| plan 需指引"关注后端 API endpoints" | execution-plan/quality/ 无相关指引  | ❌                                      |

---

## 场景 6 — Plan 代差问题

写 execution-plan 时是按整体"前端/后端/DevOps"粒度写的，但实际执行时：

```
frontend/create  → ui-designer（关注 UI 规范、组件库）
frontend/modify  → frontend-architect（关注架构、组合式函数）
```

两份 plan 读同一套 `execution-plan/frontend/{constraint,heuristic,policy}`，但**ui-designer 和 frontend-architect 的关注点不同**。

| Agent                                            | 关心                           | execution-plan 当前覆盖 |
| ------------------------------------------------ | ------------------------------ | ----------------------- |
| ui-designer                                      | 组件 API、图标、样式语义色     | ✅ 有组件约束和样式规则 |
| frontend-architect                               | 数据结构、composable、页面状态 | ✅ 有数据约束           |
| 但 plan 没有区分"你是 subagent A，请关注 X 部分" | —                              | ❌                      |

---

## 汇总

| #   | 问题                                              | 影响              | 优先级 |
| --- | ------------------------------------------------- | ----------------- | ------ |
| P1  | execution-plan 不含 subagent 归属，任何人读同一套 | 所有领域          | **高** |
| P2  | 依赖链的上下文传递无标准化交接机制                | 多领域任务        | 中     |
| P3  | 同领域跨 task-type 的 subagent 切换无指引         | 跨 task-type 任务 | 低     |

## 修复建议

### P1 — plan 文件标注 subagent 归属

每个 `execution-plan/{domain}/heuristic.md` 顶部加 Agent 映射表：

```markdown
## Agent 映射

| Task Type | 执行 Agent         | 关注重点                   |
| --------- | ------------------ | -------------------------- |
| create    | ui-designer        | 组件规范、Nuxt UI 组件 API |
| modify    | frontend-architect | 数据结构、composable       |
| style     | ui-designer        | 语义色、响应式、间距       |
```

### P2 — 依赖链上下文的标准化格式

在 `runtime/router.md` 依赖链机制中补充上下文传递规范：

```markdown
上下文传递格式：
```

subtask A 完成 → 输出 { file_path: "...", key_config: "...", api_structure: "..." }
↓
subtask B 读取上一输出作为输入

```

### P3 — 同领域跨 subagent 时，plan 指引"如需另一 subagent 参与，应先回路由重新分发"
```
