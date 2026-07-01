# DevOps 路由

## 领域范围

- **入站条件**：总路由 `router.md` 判定为 `devops`
- **覆盖路径**：CI/CD、部署、项目基础设施配置
- **不处理**：业务代码变更（应转回总路由重新分发）

## 子任务分类

| 任务类型   | 关键词                          | 对应 Agent       | 说明         |
| ---------- | ------------------------------- | ---------------- | ------------ |
| **ci**     | CI/CD、GitHub Actions、workflow | devops-architect | CI 流程配置  |
| **deploy** | 部署、发布、上线、Docker        | devops-architect | 部署相关     |
| **config** | 配置、环境变量、设置            | devops-architect | 项目配置变更 |
| **deps**   | 依赖、升级、版本、pnpm          | devops-architect | 依赖管理     |
| **hooks**  | Husky、lint-staged、Git hooks   | devops-architect | Git 钩子配置 |

## 资源映射

### 通用加载

| 资源                            | 说明          |
| ------------------------------- | ------------- |
| `rules/project-architecture.md` | 项目架构      |
| `skill/turborepo`               | Monorepo 构建 |
| `rules/git-commit-message.md`   | Commit 规范   |

### 按任务类型额外加载

| 任务类型 | 额外资源                                   |
| -------- | ------------------------------------------ |
| ci       | `pnpm-workspace.yaml`（查看实际版本号）    |
| deps     | `pnpm-workspace.yaml`（catalogs 版本管理） |
| hooks    | `rules/git-commit-message.md`              |
| deploy   | 无（按需查 Supabase 文档）                 |

## 调用 Workflow

DevOps 任务走对应 workflow：

```
workflows/devops/{task-type}.md
```

## 注意事项

- 依赖升级必须在 `pnpm-workspace.yaml` 的 catalogs 中统一管理，不单独改子包的 package.json
- 不修改 Git 全局配置
- CI 配置变更后需验证 GitHub Actions 能正常触发
