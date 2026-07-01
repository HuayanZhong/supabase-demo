# Constraint — DevOps 评估阶段硬约束

## 评估前约束

- 开始评估前，必须先读取 `execution-engine/devops/` 了解执行约束
- 开始评估前，必须先读取 `workflows/devops/{task-type}.md` 的完成检查清单
- 开始评估前，必须先读取 `execution-plan/devops/` 确认规划承诺

## 验证门禁

1. **语法验证** — YAML/TOML/Dockerfile 语法正确
2. **CI 模拟运行** — 如果是 CI 流程变更，需确认 `pnpm build` 通过
3. **依赖完整性** — 新增依赖无已知 CVE（`pnpm audit` 检查）
4. **Docker 构建验证** — 涉及 Dockerfile 变更时 `docker build` 通过

## 完整性检查

- CI 流程中引用的脚本路径必须真实存在
- 新增的 npm 包必须声明版本号（不得用 `*` 或 `latest`）
- 涉及 secrets/环境变量的变更必须确认未硬编码敏感信息
- 计划中列出的配置项必须存在于对应配置文件中

## 范围约束

- 不评估监控/告警规则的有效性（运行时验证）
- 发现 CVE 时，记录并标注严重等级
- 发现硬编码密钥或凭证时，阻断并上报路由

## 输出约束

- 评估报告包含：配置变更清单、依赖审计结果、CVE 列表
- 涉及 CI 流程变更的评估必须包含模拟运行结果
