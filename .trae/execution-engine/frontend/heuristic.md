# Heuristic — 前端执行阶段最佳实践

## 执行前资源加载顺序

```
1. workflows/frontend/{task-type}.md       → 明确执行步骤
2. execution-plan/frontend/（3 文件）      → 明确约束/启发/策略
3. runtime/frontend/router.md 资源映射     → 确定可用 MCP/skill/rules
4. 按 workflow 资源表逐个加载引用文件      → 提前理解规则
```

一次性全部 Read 后再开始执行，避免执行中途频繁回头查阅。

## MCP 调用顺序

| 场景                | 优先调用的 MCP                    | 备用方案                     |
| ------------------- | --------------------------------- | ---------------------------- |
| 需要 Nuxt UI 组件   | `nuxt-ui MCP → search-components` | `skill/nuxt-ui`              |
| 确认组件 API        | `nuxt-ui MCP → get-component`     | `skill/nuxt-ui`              |
| 查找图标            | `nuxt-ui MCP → search-icons`      | 无                           |
| 查看示例            | `nuxt-ui MCP → get-example`       | 无                           |
| Supabase 数据库诊断 | `supabase MCP → list_tables`      | `supabase MCP → execute_sql` |
| Supabase Auth 问题  | `supabase MCP`                    | `skill/supabase`             |

先查 MCP（精确），再从 skill 获取补充知识（上下文），不使用 MCP 时直接查阅 skill。

## 执行顺序建议

### 新建组件/页面（create）

```
① nuxt-ui MCP → search-components            检查能否用现成组件
② 如无现成 → get-component / get-example     参考组件 API 和示例
③ Write 创建目录（如不存在）
④ Write 文件内容（模板 → script → style）
⑤ pnpm check-types                           立即验证类型
```

### 修改功能（modify）

```
① Read 目标文件                               先读再改
② 如涉及新组件 → nuxt-ui MCP 查询
③ SearchReplace 修改逻辑（精准替换）
④ pnpm check-types
```

### 修复 Bug（fix）

```
① 复现：按复现步骤操作，确认问题
② 排查：按 fix workflow 的 5 步排查路径
③ 修复：最小修改原则，SearchReplace 优先
④ 验证：确认不再复现 + check-types
⑤ 回归：检查关联功能
```

### 重构（refactor）

```
① Read 全部受影响文件                          理解完整上下文
② 规划重构后结构（组件拆分/逻辑提取）
③ 创建新文件 → 迁移逻辑 → 删除旧文件（标注风险）
④ check-types + lint
```

### 样式调整（style）

```
① Read 目标文件                               理解当前结构
② 确认语义色而不是硬编码色值
③ 只用 Tailwind utility classes，不写自定义 CSS
```

### 国际化（i18n）

```
① 确认翻译 key 的命名模式（已有翻译文件）
② 在代码中使用 useI18n().t('key')
③ 记录新增 key 清单，不直接修改翻译文件
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
| 运行命令               | `RunCommand`         | 构建/类型检查/格式化   |

## 分段写入策略

超过 150 行的文件，按逻辑区块分段写入：

```
# 合理分段示例：一个页面组件
第一段：<template> 结构和 UI 组件
第二段：<script setup> 逻辑
第三段：<style> 样式（如需）
```

每段写入后检查语法基本正确，避免一次写入大量内容导致的难以排查的问题。

## 批量操作

- 同类型多个文件的创建 → 列表化，逐个创建但共用模板
- 同类型多个文件的修改 → 确认模式一致后逐个修改
- 在多个文件间跳转时，每次专注一个文件，完成后进入下一个
