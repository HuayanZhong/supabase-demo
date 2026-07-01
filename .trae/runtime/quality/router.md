# Quality 路由

## 领域范围

- **入站条件**：总路由 `router.md` 判定为 `quality`
- **覆盖路径**：测试、代码审查、性能审计、安全合规检查
- **不处理**：直接的业务开发任务（应转回总路由重新分发）

## 子任务分类

| 任务类型     | 关键词                        | 对应 Agent         | 说明           |
| ------------ | ----------------------------- | ------------------ | -------------- |
| **test**     | 测试、单元测试、E2E、集成测试 | api-test-pro       | 编写或运行测试 |
| **review**   | 审查、Review、审计、检查      | compliance-checker | 代码/合规审查  |
| **perf**     | 性能、优化、慢、瓶颈          | performance-expert | 性能分析和优化 |
| **security** | 安全、漏洞、风险              | compliance-checker | 安全审计       |
| **api-test** | API 测试、接口测试、负载      | api-test-pro       | 后端 API 测试  |

## 资源映射

### 通用加载

| 资源                            | 说明     |
| ------------------------------- | -------- |
| `rules/project-architecture.md` | 项目架构 |
| `skill/turborepo`               | 构建配置 |

### 按任务类型额外加载

| 任务类型 | 额外资源                                                 |
| -------- | -------------------------------------------------------- |
| api-test | supabase MCP（查表结构理解 API 背后数据）                |
| perf     | `pnpm-workspace.yaml`（查看依赖版本）                    |
| review   | 加载对应业务域的 rules（如审查前端则加载 frontend 规则） |

## 注意事项

- **测试**：不破坏现有测试，新增测试需保证可通过
- **性能**：优先用 Lighthouse 或 Clinic.js 等工具产数据，不凭感觉
- **安全**：不引入新的依赖，除非必要性验证过
- **api-test-pro**：只测试不修改代码，不做 `Edit/Write` 操作

## 调用 Workflow

质量任务走对应 workflow：

```
workflows/quality/{task-type}.md
```
