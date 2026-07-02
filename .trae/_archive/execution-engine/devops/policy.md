# Policy — DevOps 执行阶段决策策略

## MCP vs Skill vs 直接工具决策

| 需要的信息            | 首选                             | 何时降级                        |
| --------------------- | -------------------------------- | ------------------------------- |
| Supabase 项目状态/URL | `supabase MCP → get_project_url` | MCP 不可用时 → `skill/supabase` |
| Supabase 迁移历史     | `supabase MCP → list_migrations` | MCP 不可用时 → `skill/supabase` |
| 数据库表结构诊断      | `supabase MCP → execute_sql`     | MCP 不可用时 → `skill/supabase` |
| 项目配置语法（YAML）  | `RunCommand → yamllint`          | 无 yamllint → 在线检查器        |
| Monorepo 构建配置     | `skill/turborepo`                | 无对应 MCP                      |
| 项目代码搜索          | `Grep` 或 `SearchCodebase`       | 语义搜索优先于正则              |
| 项目文件查找          | `Glob`                           | 路径已知时直接用 `Read`         |

**原则**：MCP 最精确（活的 API 数据）→ skill 次之（静态知识库）→ 直接工具兜底（文件/命令操作）。三者覆盖不同粒度，不存在完全替代关系。

## 修改 CI 配置 vs 新建 Workflow 决策

| 场景                              | 策略                                |
| --------------------------------- | ----------------------------------- |
| 修改现有 workflow 的触发条件/step | 直接修改现有文件 → `SearchReplace`  |
| 新增一类 CI 流程（如新增 lint）   | 在现有 workflow 中追加 job          |
| 新增不相关流程（如独立部署任务）  | 新建 `.github/workflows/{name}.yml` |
| 现有 workflow 已有 5+ job         | 考虑拆分到独立文件                  |
| workflow 逻辑完全错误需要重写     | `Write` 覆写，备份原内容到 git      |

**原则**：优先修改现有文件，只有在职责明显不同时才新建。

## 执行中断与恢复决策

| 场景                      | 策略                                   |
| ------------------------- | -------------------------------------- |
| YAML 语法检查失败         | 阻断性错误 → 修复后再继续              |
| docker build 失败         | 阻断性错误 → 修复 Dockerfile           |
| pnpm install 依赖解析失败 | 阻断性错误 → 检查版本兼容性            |
| deprecation warning       | 非阻断性错误 → 记录，完成后评估        |
| MCP 调用失败              | 降级到对应 skill，记录降级原因         |
| 文件已存在（创建时）      | 先 Read 现有内容，确认是追加/覆写/跳过 |
| 目标路径不存在            | 先创建目录，再写入文件                 |
| Supabase MCP 不可用       | 手动检查 Supabase Dashboard            |

## Write vs SearchReplace 决策

| 场景                              | 推荐方式        | 理由                 |
| --------------------------------- | --------------- | -------------------- |
| 全新 workflow 文件                | `Write`         | 没有已有内容可参考   |
| 修改 workflow 中单个 step         | `SearchReplace` | 保留周围上下文       |
| 修改 workflow 触发条件            | `SearchReplace` | 精准替换 `on:` 块    |
| 修改 Dockerfile 中单行            | `SearchReplace` | 不影响其他指令       |
| 重写整个 workflow                 | `Write` 覆写    | 比多次替换更清晰     |
| 修改 pnpm-workspace.yaml catalogs | `SearchReplace` | 只改版本号，保留结构 |

**原则**：能局部改就不要全量写，减少意外变更的风险。

## 错误分级与处理

```
阻断性错误（必须立即处理）：
├── YAML/TOML/JSON 语法错误
├── docker build 失败
├── pnpm install 依赖解析失败
├── 锁文件异常变更（非预期修改 lockfile）
├── CI dry-run 失败
└── 文件写入失败（权限/磁盘）

非阻断性错误（记录，完成后处理）：
├── deprecation warning
├── 镜像层数过多警告
├── npm 审计的 moderate 以下级别警告
├── CI 触发频率建议
└── 格式问题（缩进/空格）
```

遇到非阻断性错误堆积过多（超过 5 条）时，升格为优先处理。

## 依赖升级决策

| 场景                            | 策略                                     |
| ------------------------------- | ---------------------------------------- |
| 补丁版本升级（x.y.z → x.y.z+1） | 直接升级，`pnpm install` 验证            |
| 次版本升级（x.y → x.y+1）       | 先读 changelog，确认无 breaking change   |
| 主版本升级（x → x+1）           | 标注高风险，建议单独安排验证周期         |
| 新增依赖                        | 先确认已有同类依赖避免重复，确认许可协议 |
| 锁定版本（不升级）              | 有兼容性风险的场景，明确记录原因         |

## Docker 重建策略

| 场景                       | 策略                                  |
| -------------------------- | ------------------------------------- |
| Dockerfile 指令变更        | `docker build --no-cache` 完整重建    |
| 基础镜像升级               | 更新 FROM 标签，完整重建              |
| 仅多阶段构建中非关键层变更 | 可复用缓存 `docker build`             |
| 生产镜像                   | 必须用 `--no-cache`，使用确切版本标签 |
| 开发镜像                   | 可复用缓存加速，但定期全量重建        |

## 资源冲突决策

| 冲突场景                        | 策略                                          |
| ------------------------------- | --------------------------------------------- |
| 多个 MCP 都可满足需求           | 选最专精的（supabase MCP 用于 Supabase 操作） |
| skill 和 MCP 信息矛盾           | MCP 优先（实时数据 > 静态知识）               |
| workflow 和 execution-plan 矛盾 | execution-plan 优先（约束 > 流程建议）        |
| 规划层和执行层规则矛盾          | 执行层约束优先（执行层更贴近实际操作）        |
| 用户直接指令与规则矛盾          | 用户指令优先，但标注风险                      |

## 安全更新优先级

| 严重程度                     | 响应策略                 |
| ---------------------------- | ------------------------ |
| Critical（CVE 等级 >= 9.0）  | 立即升级，不等待常规周期 |
| High（CVE 等级 7.0–8.9）     | 当天处理，优先于其他任务 |
| Moderate（CVE 等级 4.0–6.9） | 纳入下次迭代             |
| Low（CVE 等级 < 4.0）        | 记录，随常规依赖升级     |
| 依赖已 EOL                   | 升级到支持版本或替换依赖 |

安全更新不遵循常规依赖变更流程，直接走紧急通道。
