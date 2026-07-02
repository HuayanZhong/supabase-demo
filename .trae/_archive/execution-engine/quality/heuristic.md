# Heuristic — 质量执行阶段最佳实践

## 执行前资源加载顺序

```
1. workflows/quality/{task-type}.md       → 明确执行步骤
2. execution-plan/quality/（3 文件）      → 明确约束/启发/策略
3. runtime/quality/router.md 资源映射     → 确定可用 agent/skill/MCP
4. 按 workflow 资源表逐个加载引用文件      → 提前理解规则
```

一次性全部 Read 后再开始执行，避免执行中途频繁回头查阅。

## MCP / Skill 调用顺序

| 场景                       | 优先调用的工具                                  | 备用方案                   |
| -------------------------- | ----------------------------------------------- | -------------------------- |
| 前端性能/Lighthouse 审计   | `chrome-devtools MCP → lighthouse_audit`        | `skill/performance-expert` |
| Supabase 表结构/RLS 检查   | `supabase MCP → list_tables / execute_sql`      | `skill/compliance-checker` |
| API 端点测试               | `api-test-pro skill`                            | 手动 curl + 断言           |
| API 契约验证和负载测试     | `api-test-pro skill`                            | k6 / autocannon            |
| 安全审计 / 敏感数据检查    | `skill/compliance-checker`                      | `skill/security-auditor`   |
| 性能瓶颈定位（后端）       | `skill/performance-expert`                      | Clinic.js 命令行           |
| 性能瓶颈定位（前端运行时） | `chrome-devtools MCP → performance_start_trace` | 浏览器 DevTools 手动录制   |

先查 MCP（精确数据）→ skill（静态知识）→ 直接工具（文件级操作）。

## 执行顺序建议

### 测试（test）

```
① 确认测试范围（单元/集成/E2E）和测试框架
② 分析现有测试风格和模式
③ 编写测试用例（正常路径 → 边界 → 错误处理）
④ 运行新增测试，确保通过
⑤ 运行全量测试（pnpm test），确认不破坏现有测试
⑥ 检查覆盖率，确认是否有未覆盖的边界情况
```

### 代码审查（review）

```
① Read 目标代码全文，理解代码意图
② 加载对应业务域的 rules（前端加载 rules/frontend/*）
③ 逐项检查：代码质量 → 命名规范 → 注释规范 → 类型安全 → i18n → 样式 → 架构合规
④ 验证代码一致性（与项目现有模式比较）
⑤ 输出审查报告（表格格式，含文件/行号/严重程度/建议）
```

### 性能分析（perf）

```
① 建立可量化基线（Lighthouse FCP/LCP/TBT 或 Clinic.js 指标）
② 使用工具 profiling（chrome-devtools MCP 或 Clinic.js）
③ 定位瓶颈（渲染/网络/数据库/计算）
④ 提出优化方案并估算收益
⑤ 实施优化（最小修改原则，每次只改一个点）
⑥ 用相同工具复测，验证改进效果
⑦ 输出前后对比表格
```

### 安全审计（security）

```
① 扫描依赖漏洞（pnpm audit）
② 检查认证/鉴权流程（Supabase Auth 配置、Guard、RLS）
③ 验证输入校验（Zod schema 覆盖情况）
④ 审查敏感数据处理（密钥、Token、个人数据是否泄露）
⑤ 检查安全配置（CORS、CSRF、环境变量）
⑥ 输出安全审计报告（含 CVE 编号和严重程度）
```

### API 测试（api-test）

```
① 确认 API 端点范围和请求/响应定义
② 设计测试用例（正常路径、边界条件、错误处理、权限验证）
③ 使用 supabase MCP 查看表结构，理解数据模型
④ 使用 api-test-pro 执行综合性端点测试
⑤ 需要时执行负载测试，关注 QPS、P50/P95/P99 延迟
⑥ 输出测试报告（端点列表、测试结果、失败详情）
```

## 工具选择习惯

| 操作           | 推荐工具                   | 说明                               |
| -------------- | -------------------------- | ---------------------------------- |
| 前端性能审计   | `chrome-devtools MCP`      | Lighthouse 审计 + Performance 录制 |
| API 综合性测试 | `api-test-pro skill`       | 契约验证、状态码、响应体断言       |
| API 负载测试   | `api-test-pro skill`       | QPS、延迟分布、错误率              |
| 安全检查       | `skill/compliance-checker` | 敏感数据、合规性审查               |
| 安全深度审计   | `skill/security-auditor`   | OWASP Top 10 覆盖                  |
| 数据库结构确认 | `supabase MCP`             | 查表结构、RLS 策略                 |
| 依赖漏洞扫描   | `pnpm audit`               | 内置命令，无需额外工具             |

## 报告规范

- 问题标注严重级别：阻断性 / 主要 / 次要 / 建议
- 每个问题包含：位置（文件+行号）→ 问题描述 → 修复建议
- 安全类问题：追加 CVE 编号和受影响版本
- 性能类问题：包含优化前后的对比数据
- 测试类问题：包含通过/失败统计和失败的请求/响应详情

## 批量操作

- 同类型多个文件的审查 → 按依赖顺序逐文件审查，但共用审查模板
- 同类型多个 API 端点的测试 → 列表化，逐个测试但共用测试用例模板
- 在多个任务间切换时，每次专注一个任务类型，完成后进入下一个
