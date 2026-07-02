# Heuristic — 后端执行阶段最佳实践

## 执行前资源加载顺序

```
1. workflows/backend/{task-type}.md         → 明确执行步骤
2. execution-plan/backend/（3 文件）        → 明确规划阶段的约束/启发/策略
3. runtime/backend/router.md 资源映射       → 确定可用 MCP/skill/rules
4. 按 workflow 资源表逐个加载引用文件        → 提前理解规则
```

一次性全部 Read 后再开始执行，避免执行中途频繁回头查阅。

## MCP 调用顺序

| 场景                | 优先调用的 MCP                                             | 备用方案                     |
| ------------------- | ---------------------------------------------------------- | ---------------------------- |
| 查询数据库表结构    | `supabase MCP → list_tables`                               | `supabase MCP → execute_sql` |
| 查询列/索引详细信息 | `supabase MCP → execute_sql（information_schema.columns）` | 无                           |
| 查看迁移历史        | `supabase MCP → list_migrations`                           | 无                           |
| 获取项目配置信息    | `supabase MCP → get_project_url / get_publishable_keys`    | 无                           |
| 获取安全/性能建议   | `supabase MCP → get_advisors`                              | 无                           |
| 搜索项目代码        | `SearchCodebase`                                           | `Grep`（精确文本匹配）       |
| 查找项目文件        | `Glob`                                                     | 路径已知时直接用 `Read`      |

先查 MCP（实时数据库信息） → 再读本地代码（现有实体/服务模式） → 最后执行变更。

## 构建顺序建议

### 新建 API（create）

```
① 定义 DTO / 请求参数类型
② 如涉及 Zod 校验 → 确认 packages/types 中已有对应 schema
③ 创建 Entity（字段、关系、索引）
④ 注册 Module（entity、imports、exports）
⑤ 创建 Service（业务逻辑）
⑥ 创建 Controller（暴露 REST 端点）
⑦ pnpm check-types                             立即验证类型
```

### 修改功能（modify）

```
① Read 目标 entity/service/controller 文件       先读再改
② 如涉及数据库变更 → supabase MCP 查询当前表结构
③ SearchReplace 修改逻辑（精准替换）
④ pnpm check-types
```

### 修复 Bug（fix）

```
① 复现：确认错误信息和上下文
② 排查：检查日志 → 检查 DTO 校验 → 检查数据库数据
③ 修复：最小修改原则，SearchReplace 优先
④ 验证：pnpm check-types + 确认问题不再出现
```

### 数据库变更（data）

```
① supabase MCP → list_tables / execute_sql     读取当前表结构
② 规划迁移方案（新增/修改字段、索引变更等）
③ 修改 Entity 文件
④ 通过 MikroORM 生成迁移文件
⑤ 应用迁移并验证
⑥ pnpm check-types
```

### 重构（refactor）

```
① Read 全部受影响文件                            理解完整上下文
② 规划重构后结构（模块拆分/服务提取）
③ 创建新文件 → 迁移逻辑 → 删除旧文件（标注风险）
④ pnpm check-types + lint
```

## 工具选择习惯

| 操作                   | 推荐工具             | 说明                     |
| ---------------------- | -------------------- | ------------------------ |
| 查询数据库结构         | `supabase MCP`       | 实时、准确，优于记忆推测 |
| 创建新文件             | `Write`              | 一次性写入完整内容       |
| 修改少量代码（3 行内） | `SearchReplace`      | 精准替换，保留上下文     |
| 修改大量代码（跨块）   | 分段 `SearchReplace` | 多处替换，每处独立操作   |
| 搜索现有实体/服务代码  | `SearchCodebase`     | 语义搜索优于正则         |
| 查看目录结构           | `LS`                 | 确认路径                 |
| 运行命令               | `RunCommand`         | 构建/类型检查/格式化     |

## 实体文件优先原则

修改 Service 或 Controller 前，优先 Read 相关 Entity 文件以确认字段名和关系。避免因对实体结构理解不准确导致错误的查询或返回值。

## 依赖处理顺序

```
① 新增 Entity 前 → 检查依赖的关联实体是否已存在
② 新增 Module 前 → 检查依赖的模块是否已 exports 所需 Entity
③ 新增 Service 前 → 检查 Repository 注入是否正确
④ 新增 Controller 前 → 检查路由路径是否与现有路由冲突
```

## 分段写入策略

超过 150 行的文件，按逻辑区块分段写入：

```
合理分段示例：一个 NestJS 模块
第一段：Entity 定义（字段、装饰器、关系）
第二段：Module 注册（imports、providers、exports）
第三段：Service 逻辑（方法实现）
第四段：Controller 定义（路由、参数、响应）
```

每段写入后检查语法基本正确，避免一次写入大量内容导致的难以排查的问题。

## 批量操作

- 同类型多个文件的创建 → 列表化，逐个创建但共用模板
- 同类型多个文件的修改 → 确认模式一致后逐个修改
- 在多个文件间跳转时，每次专注一个文件，完成后进入下一个
