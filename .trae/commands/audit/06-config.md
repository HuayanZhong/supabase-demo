# Step 6: 配置审计

> **Skill 注入**：开始本步骤前，先调用 `Skill("TRAE-code-review")` 获取审计方法论框架（范围确定+上下文收集），然后按以下逻辑执行。

检查环境变量声明与模板一致性。

## 执行

- 如果前置准备中 `packages/config/src/env.ts` 或 `.env.example` 标记为"跳过"，此步骤直接跳过
- 读取 `packages/config/src/env.ts`，用正则 `export\s+const\s+(\w+)\s*=` 提取导出的环境变量名列表 `$declared`
- 读取 `.env.example`，用正则 `^#?\s*(\w+)=` 提取变量名列表 `$example`
- 对比：
  - `$declared` 有但 `$example` 没有的 → 追加到 `.env.example`（附 `# TODO: 补充默认值`）
  - `$example` 有但 `$declared` 没有的 → 报告冗余（不自动删除）

## 输出摘要

```
[{步骤6 配置}] 新增 {N} 项 | 冗余 {N} 项
```
