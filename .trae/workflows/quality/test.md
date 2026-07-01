# 编写/运行测试

**对应 Agent**：api-test-pro（`agents/api-test-pro.md`）

## 触发条件

- 任务类型匹配：quality → test
- 关键词：测试、单元测试、E2E、集成测试、Jest、Vitest、测试用例

## 准备工作

| 资源                            | 说明                             |
| ------------------------------- | -------------------------------- |
| `rules/project-architecture.md` | 项目架构概览                     |
| `skill/turborepo`               | 构建配置和测试命令               |
| `agents/api-test-pro.md`        | api-test-pro 完整约束和项目背景  |
| `execution-plan/quality/`       | 规划指引：约束/最佳实践/决策策略 |

## 执行步骤

### Step 1: 确认测试范围

- **单元测试** — 测试独立模块/Service/Util 函数，不依赖外部服务
- **集成测试** — 测试模块间交互，如 Controller + Service + Repository
- **E2E 测试** — 测试完整用户流程，通常涉及外部依赖（数据库、API）

### Step 2: 分析现有测试

- 查找项目中的测试文件（`*.spec.ts`、`*.test.ts`、`*.e2e-spec.ts`）
- 阅读已有测试用例，了解测试框架（Jest / Vitest）、全局配置、mock 模式
- 查看 `package.json` 中的测试命令和配置

### Step 3: 编写测试

- 覆盖主要逻辑路径：正常路径、边界情况、错误处理
- 遵循项目已有的测试风格和命名约定
- 使用项目已有的 mock/fixture 工具
- 不引入新的测试依赖

### Step 4: 运行验证

```bash
# 运行相关测试，确认通过
pnpm test --filter <affected-package>

# 全量测试，确认不破坏现有测试
pnpm test
```

- 所有新建测试必须通过
- 不破坏已有测试

## 完成检查

- [ ] 测试范围确认（单元 / 集成 / E2E）
- [ ] 测试用例覆盖正常路径和边界情况
- [ ] 测试通过（`pnpm test`）
- [ ] 没有破坏现有测试
- [ ] 未引入新的测试依赖

## 输出

- 新增的测试文件
- 测试运行结果报告（通过/失败统计）
