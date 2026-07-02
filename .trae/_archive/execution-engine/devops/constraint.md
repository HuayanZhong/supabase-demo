# Constraint — DevOps 执行阶段硬约束

## 执行前约束

- 开始执行前，必须先读取对应 `workflows/devops/{task-type}.md` 了解执行步骤（ci/deploy/config/deps/hooks）
- 开始执行前，必须先读取 `execution-plan/devops/` 了解规划约束/启发/策略
- 开始执行前，必须先通过 `runtime/devops/router.md` 确认分配的资源（rules、skills、MCP）
- 开始执行前，确认当前工作区已提交或 stash，无未保存的修改

## 资源调用约束

- 调用 MCP 前必须先通过 Read 读取对应的工具描述文件，确认参数后再调用
- 涉及 Supabase 部署问题时，必须通过 `supabase MCP` 确认项目状态
- 不得直接调用未在 workflow 资源表中列出的 MCP 或 skill
- 命令行工具（`RunCommand`）执行前，必须确认目标命令在当前操作系统（Windows）可用
- 涉及网络请求的命令（docker pull、pnpm install），需确认网络连通性

## 执行过程约束

- 执行必须严格按 `workflows/devops/{task-type}.md` 的步骤顺序进行，不得跳过
- 每一步完成后必须确认输出是否符合预期，确认后再进入下一步
- 执行过程中发现计划外的文件需要修改时，必须先上报再修改，不得擅自追加
- 涉及创建文件时，必须先确认目标路径是否存在，不存在则先创建目录
- 涉及修改文件时，必须先 Read 当前内容再修改，不得凭记忆重写
- 不得在单个工具调用中写入超过 200 行的文件（应分段写入）

## 领域专用约束

### CI/CD 约束

- CI 配置变更（`.github/workflows/`）必须先验证 YAML 语法再提交
- CI 配置中不得硬编码敏感信息（密钥、token、密码）
- 验证 GitHub Actions 语法使用 `dry-run` 或在线 lint，不得直接提交测试
- 修改触发条件后必须确认不会导致重复触发或漏触发

### Docker 约束

- Dockerfile 变更必须本地可测试（`docker build` 能通过）
- Docker 镜像不得使用 `latest` 标签
- Docker 构建前必须执行 `docker build --no-cache` 确保缓存不掩盖问题
- Windows 路径映射 Docker volume 时，必须使用正斜杠或正确转义

### 依赖管理约束

- 依赖变更（`package.json`）必须使用 `pnpm add/remove` 命令而非直接编辑
- 依赖变更后必须执行 `pnpm install` 并确认 lockfile 无异常变更
- 版本必须在 `pnpm-workspace.yaml` 的 `catalogs` 中统一管理，不得单独改子包
- 不得在未验证的情况下升级主版本依赖

### 部署约束

- 部署配置变更前必须先确认当前部署环境的状态（Supabase 项目/URL）
- 部署变更必须指定回滚方案（回滚命令 + 验证步骤）
- 数据库 migration 必须在部署前确认已就绪
- 环境变量变更必须在 `.env.example` 中同步更新说明

### Git Hooks 约束

- Git hooks（`.husky/`）变更后必须测试不破坏现有 git 操作（commit、push）
- 新增 hook 前确认不会与现有 hook 冲突
- hook 脚本必须在 Windows（PowerShell）和 Unix 两种环境下可运行或提供兼容方案

## 验证约束

- 所有涉及 YAML/TOML/JSON 配置文件变更的任务，必须验证格式正确性
- CI 配置变更后验证语法 → CI 可正常触发
- Docker 变更后验证 `docker build` 通过
- 依赖变更后验证 `pnpm install` 通过 + lockfile 一致
- 部署变更后验证回滚方案可用
- 验证命令以对应 workflow 中定义的为准

## 错误处理约束

- 执行中遇到错误时，必须停止当前步骤并记录错误信息，不得尝试绕过
- 错误分为两类：
  - **阻断性错误**（语法错误、依赖缺失、build 失败）— 必须修复后才能继续
  - **非阻断性错误**（deprecation warning、格式问题）— 记录但可继续，完成后统一处理
- 连续 2 次修复尝试仍失败时，必须暂停执行并上报，不得无限制重试
- 修改必须可回滚（通过 git），破坏性变更前必须执行 `git stash` 或提交当前工作区

## 跨域约束

- DevOps 任务不得修改 `apps/` 和 `packages/` 下的业务代码
- 涉及跨域依赖变更时，通过总路由分配依赖链
- 上一步输出结构化的 context JSON，下一步 subagent 先读 context 再执行
