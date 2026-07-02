# Heuristic — DevOps 规划最佳实践

## Agent 映射

| 任务类型 | 执行 Agent       | 关注重点                           |
| -------- | ---------------- | ---------------------------------- |
| ci       | devops-architect | CI/CD pipeline、GitHub Actions     |
| deploy   | devops-architect | 部署策略、回滚方案、环境配置       |
| config   | devops-architect | 环境变量、项目配置、一致性         |
| deps     | devops-architect | pnpm workspace、版本兼容、lockfile |
| hooks    | devops-architect | Husky、lint-staged、git 工作流     |

## 扫描先手

1. 修改 CI 前先读当前 workflow 文件，理解现有流程
2. 升级依赖前先检查 `pnpm-workspace.yaml` 的 catalogs 列表
3. 部署配置变更前先确认当前使用的托管平台和部署方式

## 变更原则

- **单一变更**：每次只改一个方面（CI / 依赖 / 配置），不混在一起
- **可逆优先**：优先选容易回滚的方案
- **验证闭环**：每次基础设施变更后，验证变更效果

## 文件定位

| 配置类型  | 文件                              |
| --------- | --------------------------------- |
| CI 流程   | `.github/workflows/`              |
| 依赖管理  | `pnpm-workspace.yaml`（catalogs） |
| 环境变量  | `.env.example` + 各 app 的 `.env` |
| 构建配置  | `turbo.json`                      |
| Git hooks | `.husky/`                         |

## 升级策略

1. 先检查 catalogs 中当前版本
2. 确认新版本的 breaking changes
3. 更新 catalogs 中的版本号
4. 执行 `pnpm install` 验证依赖解析
5. 跑 `pnpm check-types && pnpm lint` 验证兼容性

## 环境配置

- 开发 / 预览 / 生产环境变量分开管理
- 不提交真实密钥到代码仓库
- 不同环境的差异在文档中说明
