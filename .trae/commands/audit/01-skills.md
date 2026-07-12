# Step 1: Skills 审计

检查 Skills junction 完整性及 README 同步情况。

## 执行

> hooks-mute 已由编排器 `audit.md` 在步骤 0 创建，此处不再重复创建。

- 如果前置准备中 `.agents/skills/` 或 `.trae/skills/` 标记为"跳过"，此步骤直接跳过
- 读取 `.agents/skills/` 下所有子目录（每个子目录为一个技能包），记录技能包名称列表 `$installed`
- 读取 `.trae/skills/` 下所有 junction，记录 junction 名称列表 `$junction_list`
- 对比 `$installed` 与 `$junction_list`：
  - `$installed` 有但 `$junction_list` 无的 → **缺失 junction**，使用 `New-Item -ItemType Junction -Force -Target (Resolve-Path ".agents/skills/{name}").Path -Path ".trae/skills/{name}"` 创建
  - `$junction_list` 有但 `$installed` 无的 → **孤立 junction**，输出待删除列表并等待用户确认后删除
  - `-Force` 确保已存在时不会报错
- 检查每个 junction 的 `(Get-Item ".trae/skills/{name}").Target` 是否指向有效路径，无效则重建
- **交叉检查**：读取 `.trae/skills/README.md` 中的技能包清单表，对比与实际 junction 列表是否一致，不一致则更新

## 输出摘要

```
[{步骤1 Skills}] 已安装 {N} 个 | 新建 junction {N} 个 | 孤立清理 {N} 个 | README更新 {N} 处
```
