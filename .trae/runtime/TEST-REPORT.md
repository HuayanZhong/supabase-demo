# 全链路验证报告

## A. 单领域路由（6 域）

### 场景 1 — 前端创建

| 步骤                                                           | 文件                                | 结果 |
| -------------------------------------------------------------- | ----------------------------------- | ---- |
| "给 dashboard 加一个 habits 列表"                              |                                     |      |
| 总路由匹配"页面/组件" → `frontend`                             | `runtime/router.md` L31-36          | ✅   |
| 子路由匹配"新建/添加" → create                                 | `runtime/frontend/router.md` L13    | ✅   |
| Agent → ui-designer                                            | `runtime/frontend/router.md` L13    | ✅   |
| Workflow → `workflows/frontend/create.md`                      | 资源表含 `execution-plan/frontend/` | ✅   |
| Plan → `execution-plan/frontend/{constraint,heuristic,policy}` | 3 文件                              | ✅   |

### 场景 2 — 后端创建

| 步骤                                     | 文件                            | 结果 |
| ---------------------------------------- | ------------------------------- | ---- |
| "创建 habits 的 CRUD API"                |                                 |      |
| 总路由匹配"API/接口" → `backend`         | `runtime/router.md` L48         | ✅   |
| 子路由匹配"新建/创建" → create           | `runtime/backend/router.md` L13 | ✅   |
| Agent → backend-architect                | `runtime/backend/router.md` L13 | ✅   |
| Workflow → `workflows/backend/create.md` | 已含执行计划引用                | ✅   |
| Plan → `execution-plan/backend/`         | 3 文件                          | ✅   |

### 场景 3 — DevOps CI

| 步骤                                | 文件                           | 结果 |
| ----------------------------------- | ------------------------------ | ---- |
| "配置 GitHub Actions 自动部署"      |                                |      |
| 总路由匹配"CI/部署" → `devops`      | `runtime/router.md` L60-61     | ✅   |
| 子路由匹配"CI/CD" → ci              | `runtime/devops/router.md` L13 | ✅   |
| Agent → devops-architect            | `runtime/devops/router.md` L13 | ✅   |
| Workflow → `workflows/devops/ci.md` | 已含执行计划引用               | ✅   |
| Plan → `execution-plan/devops/`     | 3 文件                         | ✅   |

### 场景 4 — Shared 类型

| 步骤                                   | 文件                           | 结果 |
| -------------------------------------- | ------------------------------ | ---- |
| "给 User schema 加 phone 字段"         |                                |      |
| 总路由匹配"类型/Schema" → `shared`     | `runtime/router.md` L73        | ✅   |
| 子路由匹配"类型" → types               | `runtime/shared/router.md` L15 | ✅   |
| Agent → backend-architect              | `runtime/shared/router.md` L15 | ✅   |
| Workflow → `workflows/shared/types.md` | 已含执行计划引用               | ✅   |
| Plan → `execution-plan/shared/`        | 3 文件                         | ✅   |

### 场景 5 — AI 集成

| 步骤                                   | 文件                       | 结果 |
| -------------------------------------- | -------------------------- | ---- |
| "接入 DeepSeek 对话模型"               |                            |      |
| 总路由匹配"AI/模型" → `ai`             | `runtime/router.md` L84    | ✅   |
| 子路由匹配"接入/集成" → integrate      | `runtime/ai/router.md` L14 | ✅   |
| Agent → ai-integration-engineer        | `runtime/ai/router.md` L14 | ✅   |
| Workflow → `workflows/ai/integrate.md` | 已含执行计划引用           | ✅   |
| Plan → `execution-plan/ai/`            | 3 文件                     | ✅   |

### 场景 6 — Quality 审查

| 步骤                                     | 文件                            | 结果 |
| ---------------------------------------- | ------------------------------- | ---- |
| "审查昨天提交的 PR"                      |                                 |      |
| 总路由匹配"审查/Review" → `quality`      | `runtime/router.md` L97         | ✅   |
| 子路由匹配"审查" → review                | `runtime/quality/router.md` L14 | ✅   |
| Agent → compliance-checker               | `runtime/quality/router.md` L14 | ✅   |
| Workflow → `workflows/quality/review.md` | 已含执行计划引用                | ✅   |
| Plan → `execution-plan/quality/`         | 3 文件                          | ✅   |

---

## B. 多领域依赖链（2 场景）

### 场景 7 — 头像上传（3 域依赖链）

| 步骤                                | 文件                           | 结果 |
| ----------------------------------- | ------------------------------ | ---- |
| "添加用户头像上传功能"              |                                |      |
| AI 拆 3 子任务 + 标注依赖           | `runtime/router.md` L132-136   | ✅   |
| 依赖链：devops → backend → frontend | `runtime/router.md` L141-148   | ✅   |
| Step 1 — devops 配存储桶            | 输出存储配置                   | ✅   |
| Step 2 — backend 写上传 API         | 输入：存储配置；输出：API 结构 | ✅   |
| Step 3 — frontend 做组件            | 输入：API 结构                 | ✅   |
| re-route 支持                       | `runtime/router.md` L136       | ✅   |

**关键检查点：** 依赖链能在路由阶段一次性排好顺序，不 loop。

### 场景 8 — 多语言全文搜索（4 域复杂链）

| 步骤                           | 分析                                      | 结果 |
| ------------------------------ | ----------------------------------------- | ---- |
| "给 habits 添加多语言全文搜索" |                                           |      |
| 涉及领域                       | devops + backend + ai + frontend + shared |      |
| 依赖关系                       | devops → backend → ai → frontend + shared |      |
| Step 1 — devops                | 检查 pgvector 扩展、部署配置              | ✅   |
| Step 2 — backend               | 建全文搜索 API                            | ✅   |
| Step 3 — ai                    | 接入 embedding 模型                       | ✅   |
| Step 4a — frontend             | 搜索 UI                                   | ✅   |
| Step 4b — shared               | 翻译搜索相关文案                          | ✅   |
| (4a 和 4b 无依赖，可并行)      | 根据"无依赖的多领域"规则 L119-126 并行    | ✅   |

---

## C. 冲突优先级（2 场景）

### 场景 9 — 质量 vs 开发

| 步骤                              | 文件                            | 结果 |
| --------------------------------- | ------------------------------- | ---- |
| "优化数据库查询性能"              |                                 |      |
| 总路由匹配"性能/优化" → quality   | `runtime/router.md` L98         | ✅   |
| 也匹配"数据库" → backend          | `runtime/router.md` L49         | ✅   |
| 冲突裁决：quality(1) > backend(4) | `runtime/router.md` L106-107    | ✅   |
| 最终路由 → quality/perf           | `runtime/quality/router.md` L15 | ✅   |

### 场景 10 — Shared 类型 vs 后端使用

| 步骤                                       | 文件                         | 结果 |
| ------------------------------------------ | ---------------------------- | ---- |
| "给 types 加 schema 并在后端使用"          |                              |      |
| 总路由匹配"类型/Schema" → shared           | `runtime/router.md` L73      | ✅   |
| 也匹配"API/服务" → backend                 | `runtime/router.md` L48      | ✅   |
| 冲突裁决：shared(2) > backend(4)           | `runtime/router.md` L106-108 | ✅   |
| 规则说明："先定义类型，完成后再路由到后端" | `runtime/router.md` L112-113 | ✅   |

---

## D. 边界情况（3 场景）

### 场景 11 — 无匹配回退

| 步骤                          | 文件                         | 结果 |
| ----------------------------- | ---------------------------- | ---- |
| "帮我查天气"                  |                              |      |
| 总路由无匹配                  | `runtime/router.md` L161-166 | ✅   |
| 回退 agents/ 匹配 description | 需 agents/ 文件齐全          | ⚠️   |
| 无匹配 → SOLO Agent           | `runtime/router.md` L165-166 | ✅   |

**发现 ⚠️：** agents/ 还未审查对齐到路由体系，回退效果取决于 agents 文件的完整性。

### 场景 12 — 执行中期发现新依赖

| 步骤                       | 文件                                    | 结果 |
| -------------------------- | --------------------------------------- | ---- |
| 前端开发中发现需要后端 API |                                         |      |
| 当前任务暂停               | `execution-plan/policy.md` 依赖冲突策略 | ✅   |
| 触发 re-route 追加子任务   | `runtime/router.md` L136                | ✅   |
| 新子任务插入依赖链顺序     | `runtime/router.md` L132-133            | ✅   |
| 完成后继续原任务           | `runtime/router.md` L134                | ✅   |

### 场景 13 — 前端翻译例外（边界关键词）

| 步骤                          | 文件                           | 结果 |
| ----------------------------- | ------------------------------ | ---- |
| "给登录页加日文翻译"          |                                |      |
| 总路由匹配"翻译" → frontend   | `runtime/router.md` L36        | ❓   |
| 但"涉及翻译文件的增删改"例外  | `runtime/router.md` L40        | ✅   |
| 例外规则 → shared 领域        | `runtime/router.md` L40        | ✅   |
| shared/i18n → workflow → plan | `runtime/shared/router.md` L16 | ✅   |

---

## E. 评估模块防御测试（12 场景）

### 场景 14 — 范围溢出：AI 创建了计划外文件

| 检查点                                               | 文件                                        | 结果 |
| ---------------------------------------------------- | ------------------------------------------- | ---- |
| "改登录页按钮颜色"，AI 额外创建了 `test-button.scss` |                                             |      |
| evaluation/frontend/constraint.md L27                | "apps/frontend/ 不得有未列入计划的新建文件" | ✅   |
| evaluation/frontend/heuristic.md style ④             | "多余文件检查"                              | ✅   |

### 场景 15 — 静默越界：AI 修改了计划外文件

| 检查点                                       | 文件                              | 结果 |
| -------------------------------------------- | --------------------------------- | ---- |
| "修改用户列表页面"，AI 顺手改了后端 API 文件 |                                   |      |
| execution-engine/general/constraint.md L43   | "单领域任务不得修改其他领域代码"  | ✅   |
| evaluation/frontend/constraint.md L26        | "只读文件不得有变更"              | ✅   |
| evaluation/frontend/policy.md L21            | "计划外文件被修改 → 阻断性不通过" | ✅   |

### 场景 16 — 静默语义错误：类型语法对但逻辑错

| 检查点                                                             | 文件                                             | 结果        |
| ------------------------------------------------------------------ | ------------------------------------------------ | ----------- |
| AI 写了 `z.string()` 但应是 `z.string().email()`，check-types 通过 |                                                  |             |
| evaluation/frontend/heuristic.md create ⑦                          | "数据流验证 → 预览确认数据正确"                  | ⚠️ 依赖预览 |
| evaluation/frontend/constraint.md L12-18                           | 门禁不检查语义正确性                             | ❌ 无法兜住 |
| **结论**                                                           | 治理框架不替代代码审查，此类问题依赖 AI 代码质量 |             |

### 场景 17 — 翻译不完整：只添加 2/4 语言

| 检查点                                        | 文件                         | 结果 |
| --------------------------------------------- | ---------------------------- | ---- |
| "给登录页加日语翻译"，AI 只更新了 zh-CN 和 en |                              |      |
| evaluation/shared/constraint.md L12           | "4 语言翻译文件必须同时更新" | ✅   |
| evaluation/shared/policy.md L19-21            | "2/4 → 不通过"               | ✅   |
| evaluation/shared/heuristic.md L23            | i18n 检查第①步 key 完整性    | ✅   |

### 场景 18 — Migration 缺少回滚

| 检查点                                          | 文件                            | 结果 |
| ----------------------------------------------- | ------------------------------- | ---- |
| "给 users 表加 phone 字段"，migration 无 down() |                                 |      |
| evaluation/backend/constraint.md L11            | "migration 必须包含 up 和 down" | ✅   |
| evaluation/backend/constraint.md L22            | "新增 migration 无 down → 阻断" | ✅   |
| evaluation/backend/policy.md L10                | "migration 缺失 down → 不通过"  | ✅   |

### 场景 19 — 模块注册遗漏：创建了文件但没注册

| 检查点                                                   | 文件                                          | 结果 |
| -------------------------------------------------------- | --------------------------------------------- | ---- |
| 创建了 HabitsEntity/Service/Controller 但忘记注册 Module |                                               |      |
| evaluation/backend/constraint.md L20                     | "DTO/Entity/Service/Controller/Module 链完整" | ✅   |
| evaluation/backend/heuristic.md L17                      | create 第①步 "文件完整性检查"                 | ✅   |
| execution-engine/backend/heuristic.md                    | 执行步骤含模块注册验证                        | ✅   |

### 场景 20 — Breaking change 未标注

| 检查点                                                          | 文件                            | 结果 |
| --------------------------------------------------------------- | ------------------------------- | ---- |
| "用户 API 的 id 从 number 改为 string"，无 breaking change 标注 |                                 |      |
| evaluation/backend/constraint.md L32-33                         | "API 结构变更通知前端引用方"    | ✅   |
| evaluation/backend/constraint.md L42                            | "涉及 breaking change 必须标注" | ✅   |
| evaluation/shared/policy.md L28-34                              | 类型 breaking change 判定表     | ✅   |

### 场景 21 — 依赖链 context key 错位

| 检查点                                                      | 文件                                                                                   | 结果 |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------- | ---- |
| 头像上传 devops BUCKET_NAME 写成 bucketName，backend 读不到 |                                                                                        |      |
| runtime/router.md L152-158                                  | 定义标准上下文格式（outputs: [{key, value}]）                                          | ✅   |
| execution-engine/heuristic.md L18-23                        | 依赖链执行模式描述                                                                     | ✅   |
| evaluation/heuristic.md L35-36                              | "上下文交接内容必须可追溯"                                                             | ✅   |
| **建议**                                                    | 可补充 evaluation 通用约束：上一步 context outputs 中 key 必须与下一步 inputs 完全匹配 | 待定 |

### 场景 22 — 硬编码密钥

| 检查点                                             | 文件                              | 结果 |
| -------------------------------------------------- | --------------------------------- | ---- |
| "接入第三方天气 API"，AI 把 API key 写进 config.ts |                                   |      |
| evaluation/ai/constraint.md L10                    | "API key 硬编码 → 阻断并上报"     | ✅   |
| evaluation/ai/policy.md L19-21                     | "0/3 硬编码 → 通过；1-2 → 不通过" | ✅   |
| evaluation/ai/heuristic.md L15                     | "密钥安全确认"                    | ✅   |

### 场景 23 — 无高可用/降级方案

| 检查点                                         | 文件                              | 结果 |
| ---------------------------------------------- | --------------------------------- | ---- |
| "接入 DeepSeek 对话"，模型调用无错误处理和超时 |                                   |      |
| evaluation/ai/constraint.md L12-13             | "有降级处理、超时机制"            | ✅   |
| evaluation/ai/policy.md L27-33                 | "网络不通→友好提示；429→自动重试" | ✅   |
| evaluation/ai/heuristic.md L31                 | "错误处理确认"                    | ✅   |

### 场景 24 — 性能退化未被检出

| 检查点                                         | 文件                      | 结果 |
| ---------------------------------------------- | ------------------------- | ---- |
| "给 habits 加搜索"，AI 写客户端 10K 条全量过滤 |                           |      |
| evaluation/quality/policy.md L39-44            | "P50 退化 > 10% → 不通过" | ✅   |
| evaluation/quality/heuristic.md L41-47         | "基线数据确认 + 对比分析" | ✅   |
| evaluation/quality/constraint.md L14           | "性能退化 < 10%"          | ✅   |

### 场景 25 — 安全审计 high 未修复

| 检查点                                   | 文件                            | 结果 |
| ---------------------------------------- | ------------------------------- | ---- |
| "审查后端 API 安全"，发现 SQL 注入但没修 |                                 |      |
| evaluation/quality/policy.md L15         | "安全审计 high 未修复 → 不通过" | ✅   |
| evaluation/quality/policy.md L29-34      | "high → 本次任务内修复"         | ✅   |
| evaluation/quality/constraint.md L24-27  | "高危及阻断性问题必须先修复"    | ✅   |

---

## 核心发现

| #   | 问题                                           | 优先级 | 状态     |
| --- | ---------------------------------------------- | ------ | -------- |
| ①   | agents/ 未审查，回退链路不可靠                 | 中等   | **待定** |
| ②   | 场景 21 依赖链 context key 校验需补充          | 较低   | **建议** |
| ③   | 场景 16 治理无法替代代码审查（语义错误兜不住） | —      | 认知上限 |

## 链路完整性

```
language.md + interaction.md + ai-safety.md (alwaysApply 触发)
      ↓
 runtime/      →  workflows/   →  execution-plan/
    ✅               ✅               ✅
      ↓
      ↓                ↓
 execution-engine/ →  evaluation/
    ✅                  ✅
      ↓                  ↓
   Finished ✅    re-execute/re-plan 🔄
```

全链路 7 层（触发→路由→工作流→规划→执行→评估→决策）全部打通。
