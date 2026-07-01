# Policy — 后端执行阶段决策策略

## MCP vs Skill vs 直接工具决策

| 需要的信息      | 首选                                                       | 何时降级                                 |
| --------------- | ---------------------------------------------------------- | ---------------------------------------- |
| 数据库表结构    | `supabase MCP → list_tables`                               | MCP 不可用时 → `skill/supabase` 查询文档 |
| 列信息/索引     | `supabase MCP → execute_sql（information_schema.columns）` | 无降级方案，不得猜测                     |
| 迁移历史        | `supabase MCP → list_migrations`                           | 无降级方案                               |
| 项目配置/密钥   | `supabase MCP → get_project_url / get_publishable_keys`    | MCP 不可用时 → 自查环境变量              |
| 安全建议        | `supabase MCP → get_advisors`                              | 无降级方案                               |
| 项目代码搜索    | `SearchCodebase`                                           | `Grep`（精确文本匹配）                   |
| 项目文件查找    | `Glob`                                                     | 路径已知时直接用 `Read`                  |
| MikroORM 包信息 | `Read package.json`                                        | 无降级方案                               |
| NestJS 模块结构 | `Read` 同领域已有模块                                      | 无降级方案                               |

**原则**：MCP 最精确（实时数据库状态）→ skill 次之（静态知识库）→ 直接工具兜底（代码级操作）。三者覆盖不同粒度，不存在完全替代关系。

## supabase MCP vs 直接 SQL 决策

| 场景          | 方式                                                           | 理由                                   |
| ------------- | -------------------------------------------------------------- | -------------------------------------- |
| 查表结构      | `supabase MCP → list_tables`                                   | 返回结构化表列表，可直接确认表是否存在 |
| 查列类型/约束 | `supabase MCP → execute_sql` 查询 `information_schema.columns` | 标准化查询，不依赖 psql                |
| 验证迁移结果  | `supabase MCP → execute_sql`                                   | 快速验证，无需切换工具                 |
| 复杂数据分析  | `supabase MCP → execute_sql`                                   | 支持原生 SQL 查询                      |
| 生产环境操作  | 均需通过迁移文件，不得直接 SQL 操作                            | 可回滚、可审计                         |

**原则**：能通过 MCP 完成的 DB 查询绝不使用 psql，所有生产环境变更必须走迁移文件。

## 错误分类与处理决策

```
阻断性错误（必须立即处理）：
├── 编译错误（tsc 编译失败）
├── 类型错误（check-types 失败）
├── 语法错误（编辑器诊断报红）
├── 依赖缺失（import 找不到模块）
├── MikroORM 装饰器使用错误
└── 文件写入失败（权限/磁盘）

非阻断性错误（记录，完成后处理）：
├── lint 警告（非 error 级别）
├── 格式问题（prettier 不一致）
├── 未使用的 import/变量
└── 命名风格不一致（不影响编译）
```

遇到非阻断性错误堆积过多（超过 5 条）时，升格为优先处理。

## Write vs SearchReplace 决策

| 场景                                  | 推荐方式             | 理由               |
| ------------------------------------- | -------------------- | ------------------ |
| 全新文件（Entity/Service/Controller） | `Write`              | 没有已有内容可参考 |
| 修改文件中的连续代码块                | `SearchReplace`      | 保留周围上下文     |
| 修改文件中的多处分散代码              | 多次 `SearchReplace` | 每次只改一个逻辑点 |
| 文件大部分内容需要重写                | 分段 `SearchReplace` | 避免误删未改部分   |
| 文件内容少且全改                      | `Write` 覆写         | 比多次替换更清晰   |

**原则**：能局部改就不要全量写，减少意外变更的风险。

## 依赖与执行顺序决策

| 情形                        | 策略                                                     |
| --------------------------- | -------------------------------------------------------- |
| 多个文件要修改              | 按依赖顺序：Entity → Module → Service → Controller       |
| 同时有新建和修改            | 先新建（不依赖已有代码），再修改（可能需要引用新建内容） |
| Entity 依赖其他 Entity      | 先确保被依赖的 Entity 已存在且 Module 已 exports         |
| 新增 Module 依赖其他 Module | 先确认目标 Module 的 exports 中包含了所需 Provider       |
| 同一个文件多次修改          | 每次修改后确认正确，再进入下一次修改                     |

## NestJS 模块注册决策

| 场景                             | 策略                                                   |
| -------------------------------- | ------------------------------------------------------ |
| 新增独立模块（不依赖其他模块）   | 标准 `@Module({})`，注册 Entity + Controller + Service |
| 新增模块依赖另一个模块的 Entity  | imports 目标模块，使用其 exports 的 Entity             |
| 为现有模块新增功能               | 扩展现有 Service，新增 Controller 方法                 |
| 跨模块共享 Service               | 在 Module 的 exports 中声明 Service                    |
| 全局 Service（如过滤器、拦截器） | 在 root Module 注册为 `@Global()` + `providers`        |

## 资源冲突决策

| 冲突场景                        | 策略                                                           |
| ------------------------------- | -------------------------------------------------------------- |
| 多个 MCP 都可满足需求           | 选最专精的（supabase MCP 用于数据库，SearchCodebase 用于代码） |
| skill 和 MCP 信息矛盾           | MCP 优先（实时数据 > 静态知识）                                |
| workflow 和 execution-plan 矛盾 | execution-plan 优先（约束 > 流程建议）                         |
| 用户直接指令与规则矛盾          | 用户指令优先，但标注风险                                       |
| 后端 Entity 与数据库表矛盾      | 以数据库实际表结构为准（通过 MCP 确认）                        |
