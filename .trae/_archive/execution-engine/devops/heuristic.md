# Heuristic — DevOps 执行阶段最佳实践

## 执行前资源加载顺序

```
1. workflows/devops/{task-type}.md       → 明确执行步骤（ci/deploy/config/deps/hooks）
2. execution-plan/devops/（3 文件）      → 明确规划约束/启发/策略
3. runtime/devops/router.md 资源映射     → 确定可用 MCP/skill/rules
4. 按 workflow 资源表逐个加载引用文件    → 提前理解规则
```

一次性全部 Read 后再开始执行，避免执行中途频繁回头查阅。

## 任务执行流程

### CI 配置变更

```
① workflows/devops/ci.md                理解 CI 配置步骤
② Read 当前 .github/workflows/*.yml     理解现有流程
③ 识别需要变更的部分（触发条件/job/step）
④ SearchReplace/Write 修改（精准替换）
⑤ 验证 YAML 语法（yamllint 或 dry-run）
⑥ git add + git commit（如需要）
```

### 依赖管理

```
① workflows/devops/deps.md              理解依赖管理步骤
② Read pnpm-workspace.yaml catalogs     确认当前版本
③ 确认新版本的 breaking changes（changelog）
④ pnpm add/remove 操作依赖              （绝不直接改 package.json）
⑤ pnpm install                          验证依赖解析
⑥ pnpm check-types && pnpm lint         验证兼容性
```

### Docker 变更

```
① workflows/devops/deploy.md            理解 Docker 部署步骤
② Read Dockerfile / docker-compose.yml  理解当前配置
③ SearchReplace/Write 修改
④ docker build --no-cache -t test .     验证构建
⑤ 检查镜像大小和层数
```

### 部署配置

```
① workflows/devops/deploy.md            理解部署步骤
② 确认当前环境（supabase MCP 查项目）
③ 确认回滚方案（git revert / supabase restore）
④ 执行部署变更
⑤ 验证部署结果
```

### Git Hooks 变更

```
① workflows/devops/hooks.md             理解 hooks 配置步骤
② Read .husky/ 下现有 hook              理解当前配置
③ 新增/修改 hook 脚本
④ 测试 hook 触发（git commit --dry-run）
```

## 工具选择习惯

| 操作                   | 推荐工具             | 说明                   |
| ---------------------- | -------------------- | ---------------------- |
| 创建新文件             | `Write`              | 一次性写入完整内容     |
| 修改少量代码（3 行内） | `SearchReplace`      | 精准替换，保留上下文   |
| 修改大量代码（跨块）   | 分段 `SearchReplace` | 多处替换，每处独立操作 |
| 查看目录结构           | `LS`                 | 确认路径               |
| 查找文件               | `Glob`               | 精确查找               |
| 搜索代码内容           | `Grep`               | 文本/正则搜索          |
| 运行命令               | `RunCommand`         | pnpm/docker/git 操作   |
| 语义搜索               | `SearchCodebase`     | 按意图/行为搜索        |

## 命令执行习惯

- pnpm 操作：始终使用 `pnpm add/remove/upgrade`，不直接编辑 `package.json`
- Docker 操作：先用 `docker build --no-cache` 测试，确认通过后再优化缓存
- CI 语法验证：优先使用 `yamllint` 或 GitHub Actions 的 dry-run 功能
- Git 操作：破坏性变更前先 `git stash` 或提交，确保可回滚
- Windows 路径：Docker volume 映射使用正斜杠 `C:/Users/...` 而非反斜杠
- 多条命令用 `&&` 串联，一条失败则停止

## 分段写入策略

超过 150 行的文件，按逻辑区块分段写入：

```
合理分段示例：一个 CI workflow 文件
第一段：name + on 触发条件
第二段：env + jobs 定义
第三段：steps 详细步骤
```

## 错误预防

- 修改前先 Read，确认当前行号范围
- 确认命令在当前操作系统（Windows）可用
- Docker 构建前先清理旧镜像避免磁盘不足
- CI 配置修改后先 lint 再提交，避免触发失败浪费 Action 额度
- 依赖升级前先确认 pnpm workspace 的 catalog 版本约束

## 输出整理

执行完成后输出结构化摘要：

```
## 执行摘要

- 修改了哪些文件（路径 + 操作类型：新建/修改/删除）
- 每项变更的简要说明
- 验证结果（YAML lint / docker build / pnpm install 是否通过）
- 遗留问题（如有）
- 影响范围（哪些 CI 流程/部署环境/依赖链会受影响）
```
