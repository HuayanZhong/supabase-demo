# Git 钩子配置

## 触发条件

- 用户要求「配置 Git hooks」「设置 husky」「配置 lint-staged」「改 pre-commit」
- 涉及 `.husky/` 目录或 `package.json` 中的 `prepare` script

## 准备工作

- 加载规则：`rules/git-commit-message.md`（commit message 规范）
- 读取 `.husky/` 下已有的 hook 文件
- 读取 `.lintstagedrc.json`（lint-staged 配置）
- 读取根 `package.json`（确认 husky、lint-staged 版本和 prepare script）
- 读取各 app 的 `package.json`（确认 lint/format 命令）

## 执行步骤

### Step 1: 确认钩子需求

当前项目已有钩子：

| 钩子            | 内容                    | 来源                |
| --------------- | ----------------------- | ------------------- |
| `pre-commit`    | `pnpm exec lint-staged` | husky + lint-staged |
| `post-commit`   | graphify 图谱重建       | graphify 自动安装   |
| `post-checkout` | graphify 图谱重建       | graphify 自动安装   |

可能新增的钩子：

| 钩子         | 用途                    | 命令                                          |
| ------------ | ----------------------- | --------------------------------------------- |
| `commit-msg` | commit message 格式校验 | `pnpm exec commitlint` 或自定义 script        |
| `pre-push`   | push 前运行完整检查     | `pnpm check-types && pnpm lint && pnpm build` |

### Step 2: 配置 husky 和 lint-staged

**当前配置状态：**

- husky v9+（已安装，`package.json` 中有 `"prepare": "husky"`）
- lint-staged 配置在 `.lintstagedrc.json`：

```json
{
  "*": "oxfmt --no-error-on-unmatched-pattern",
  "*.{js,jsx,ts,tsx,mjs,cjs,vue}": "oxlint --fix"
}
```

**操作方法：**

```bash
# 创建新 hook（husky v9+）
echo "pnpm exec lint-staged" > .husky/pre-commit
# 或使用 husky CLI
pnpm exec husky add .husky/commit-msg 'pnpm exec commitlint --edit "$1"'

# 设置可执行权限（Windows Git Bash / WSL 需要）
git update-index --chmod=+x .husky/<hook-name>
```

**修改 lint-staged 配置（`.lintstagedrc.json`）：**

```json
{
  "*": "oxfmt --no-error-on-unmatched-pattern",
  "*.{js,jsx,ts,tsx,mjs,cjs,vue}": ["oxlint --fix", "oxfmt --no-error-on-unmatched-pattern"]
}
```

### Step 3: 验证

```bash
# 方式 A：直接运行 hook 脚本（模拟）
pnpm exec husky run pre-commit

# 方式 B：触发实际 Git 操作
git add .lintstagedrc.json
git commit -m "test(lint-staged): 验证钩子生效" --no-verify  # 跳过验证测试
# 然后用真实 commit 确认：
git commit -m "chore(hooks): 测试 lint-staged"

# 验证 commit-msg 钩子（如配置了）
echo "foo: 测试消息" | pnpm exec commitlint  # 应报错
echo "chore: 测试消息" | pnpm exec commitlint  # 应通过
```

验证要点：

- `pre-commit` 钩子应自动运行 `lint-staged`，对暂存文件执行 `oxlint --fix` 和 `oxfmt`
- 如果 lint/format 失败，commit 应被阻止
- hook 不要影响未暂存的代码
- 不要破坏已有的 graphify 钩子（post-commit、post-checkout）

## 完成检查

- [ ] `.husky/<hook-name>` 文件存在且内容正确
- [ ] hook 文件在 Git 中已追踪（`git ls-files .husky/`）
- [ ] hook 权限正确（`git update-index --chmod=+x`）
- [ ] `lint-staged` 配置正确匹配需要检查的文件类型
- [ ] 模拟触发验证通过
- [ ] 不干扰已有 graphify 钩子运行

## 输出

- 新增或修改的 `.husky/*` 文件
- 新增或修改的 `.lintstagedrc.json`
- 验证方式及结果

## 参考：commit message 规范

commit message 遵循 Conventional Commits 格式，详见 `.trae/rules/git-commit-message.md`。
如需 `commit-msg` 钩子，建议使用 `commitlint` 配合 `@commitlint/config-conventional`。
