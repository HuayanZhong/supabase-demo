# 依赖管理

**对应 Agent：** `devops-architect`

## 触发条件

- 用户要求「升级依赖」「降级依赖」「新增依赖」「移除依赖」
- 涉及 `pnpm-workspace.yaml` 的 catalogs 修改
- 安装新 npm 包

## 准备工作

- 读取 `pnpm-workspace.yaml`（了解当前 catalog 分组和版本）
- 读取各 app 的 `package.json`（确认哪些包引用哪些 catalog）
- 加载 Skill：`turborepo`（理解构建依赖关系）
- 加载 `execution-plan/devops/`（规划指引：约束/最佳实践/决策策略）

## 执行步骤

### Step 1: 确认依赖变更需求

| 操作 | 说明                         | 示例                             |
| ---- | ---------------------------- | -------------------------------- |
| 升级 | 安全更新、新功能、兼容性要求 | `typescript: ^5.7.0 → ^6.0.3`    |
| 降级 | 兼容性问题、bug 回退         | 需说明原因                       |
| 新增 | 新功能需求                   | 评估是否真的需要，能否用现有工具 |
| 移除 | 不再使用                     | 检查是否还有引用，清理干净       |

确认变更范围：

- 是修改现有 catalog 版本号，还是新增 catalog 分组
- 是否涉及多个 app 同时使用该包（如放到 `dev` catalog 还是某个 app 专属 catalog）

### Step 2: 修改 pnpm-workspace.yaml 的 catalogs

**现有 catalog 分组：**

| 分组       | 用途            | 示例包                               |
| ---------- | --------------- | ------------------------------------ |
| `dev`      | 公共工具链      | typescript, oxlint, zod, supabase-js |
| `backend`  | NestJS 后端依赖 | @nestjs/_, @mikro-orm/_, rxjs        |
| `frontend` | Nuxt 前端依赖   | nuxt, vue, @nuxt/ui, echarts         |
| `test`     | 测试工具        | vitest, happy-dom, playwright-core   |

**规则：**

1. 只在 `pnpm-workspace.yaml` 的 catalogs 中修改版本号
2. **不改子包 `package.json`** — 子包通过 `catalog:<group>` 引用，版本由 catalogs 统一管理
3. 如果是新增包，判断它属于哪个 catalog 分组：
   - 多个 app 共享的依赖 → `dev` catalog
   - 仅 backend 使用 → `backend` catalog
   - 仅 frontend 使用 → `frontend` catalog
   - 仅测试使用 → `test` catalog

**新增一个 catalog 版本：**

```yaml
catalogs:
  dev:
    my-new-package: ^1.0.0
```

**子包引用方式（无需改动）：**

```json
{
  "dependencies": {
    "my-new-package": "catalog:dev"
  }
}
```

### Step 3: 执行 pnpm install

```bash
pnpm install
```

如果子包 `package.json` 中缺少对应的 catalog 引用声明，需先在子包中添加：

```bash
pnpm add <package> --filter <app>  # 自动更新子包 package.json 并写入 catalog: 引用
```

> pnpm workspace 会自动识别 catalog 引用格式，无需手动写版本号。

### Step 4: 验证

```bash
# 类型检查
pnpm check-types

# Lint
pnpm lint

# 构建（编译验证）
pnpm build

# 确认无依赖冲突
pnpm ls --depth=0
```

验证要点：

- 所有 app 编译通过
- `pnpm-lock.yaml` 已正确更新（留意是否有重复的包版本）
- 无 peer dependency 警告或 conflict

## 完成检查

- [ ] `pnpm-workspace.yaml` 中 catalogs 已更新
- [ ] 子包 `package.json` 中保留 `catalog:` 引用，未写入具体版本号
- [ ] `pnpm install` 执行成功，`pnpm-lock.yaml` 已更新
- [ ] `pnpm check-types` 通过
- [ ] `pnpm build` 通过
- [ ] 无 peer dependency 冲突

## 输出

- 修改的 `pnpm-workspace.yaml` 变更摘要
- 如新增包，涉及 `catalog:` 引用的子包 `package.json` 变更
- 验证结果
