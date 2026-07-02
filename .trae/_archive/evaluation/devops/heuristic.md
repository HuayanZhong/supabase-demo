# Heuristic — DevOps 评估阶段最佳实践

## 评估前加载顺序

```
1. workflows/devops/{task-type}.md 完成检查清单  → 评估基准
2. execution-plan/devops/（3 文件）              → 规划承诺
3. execution-engine/devops/（3 文件）            → 执行记录
```

## 评估流程

### CI/CD（ci）

```
① 配置文件语法校验     → YAML 语法正确性
② 脚本路径验证        → dist/scripts/node_modules 路径存在
③ 构建验证            → pnpm build 通过
④ 依赖审计            → pnpm audit 无 high/critical CVE
⑤ 多余文件检查        → 无未列入计划的配置文件
```

### 部署（deploy）

```
① 部署配置验证        → 部署脚本中的环境/路径正确
② 构建产物检查        → dist/ 等构建产物在 .gitignore 中
③ 回滚方案确认        → 有明确的回滚步骤
④ 多余文件检查        → 无未列入计划的部署文件
```

### 配置（config）

```
① 配置项完整性        → 所有新增配置项存在于对应文件
② 环境变量检查        → 无硬编码敏感信息
③ 格式检查            → TOML/YAML 格式正确
④ 多余文件检查        → 无未列入计划的配置文件
```

### 依赖管理（deps）

```
① 版本号确认          → 所有新增依赖有明确版本号
② CVE 检查            → pnpm audit 无 high/critical
③ 重复依赖检查        → package.json 无同一包的多版本声明
④ lockfile 检查       → pnpm-lock.yaml 已更新
```

### Git Hooks（hooks）

```
① hook 脚本语法检查   → 脚本无语法错误
② hook 注册验证       → husky/.husky 配置正确
③ 执行路径验证        → hook 中引用的路径存在
④ 多余文件检查        → 无未列入计划的 hook 文件
```

## 验证命令执行顺序

```
pnpm audit           → 无 high/critical CVE（阻断性）
pnpm build           → 编译通过（如适用）
YAML 语法检查        → 手动或工具验证
docker build         → 构建通过（涉及 Dockerfile 时）
```
