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

## 核心发现

| #   | 问题                                                                                                      | 优先级 |
| --- | --------------------------------------------------------------------------------------------------------- | ------ |
| ①   | agents/ 未审查，回退链路不可靠                                                                            | 中等   |
| ②   | 场景 8（4 域复杂链）依赖链识别全靠 AI 自主判断，无文件指引                                                | 较低   |
| ③   | backend/create 额外资源引用了 `rules/frontend/frontend-types.md` — 路径前缀是 frontend/ 但 backend 也引用 | 建议   |
| ④   | 场景 7 的"re-route"机制无实际可用文件来记录依赖链中间状态                                                 | 较低   |
| ⑤   | execution-engine/ 和 evaluation/ 空缺，整个流程到 Plan 就断                                               | **高** |

## 链路完整性

```
runtime/ → workflow/ → execution-plan/ →  ❌ execution-engine/  →  ❌ evaluation/
   ✅           ✅             ✅
```

前三步都已打通并验证。下半段还在等架构设计。
