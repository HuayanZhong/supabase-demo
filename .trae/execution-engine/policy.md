# Policy — 执行阶段通用决策策略

## MCP vs Skill vs 直接工具决策

| 需要的信息    | 首选                | 降级             |
| ------------- | ------------------- | ---------------- |
| 组件/框架 API | 对应领域 MCP        | Skill 知识库     |
| 数据库/表结构 | `supabase MCP`      | `skill/supabase` |
| 运行时诊断    | 浏览器 DevTools MCP | 无               |
| 项目已有代码  | `SearchCodebase`    | `Grep`           |
| 当前系统文件  | `LS` / `Glob`       | `RunCommand dir` |

**原则**：MCP 提供实时精确数据 → Skill 提供静态知识 → 直接工具提供文件级操作。三者互补而非替代。

## 执行中断与恢复决策

| 场景           | 策略                                    |
| -------------- | --------------------------------------- |
| 类型检查失败   | 阻断性 → 修复后再继续                   |
| lint 失败      | 非阻断性 → 记录，完成后统一修复         |
| 语法/编译错误  | 阻断性 → 立即修复                       |
| MCP 调用失败   | 降级到对应 Skill                        |
| 文件已存在     | Read 现有内容，判断追加/覆写/跳过       |
| 目标路径不存在 | 先创建目录再写入                        |
| 验证命令找不到 | 确认项目使用的包管理器（pnpm/npm/yarn） |

## 任务到 subagent 的执行分配

- `frontend` 任务 → `frontend-architect` / `ui-designer`
- `backend` 任务 → `backend-architect`
- `devops` 任务 → `devops-architect`
- `shared` 任务 → 子类型对应（types→shared, i18n→shared, lint→shared）
- `ai` 任务 → `ai-integration-engineer`
- `quality` 任务 → 子类型对应（test→api-test-pro, security→security-auditor）

## 错误分级

```
阻断性（必须立即处理）：
├── 类型/语法错误
├── 编译失败
├── 依赖缺失
├── 文件写入失败
└── MCP 不可用（标记降级后继续）

非阻断性（记录，完成后再处理）：
├── lint 警告
├── 格式问题
├── 未使用变量/import
└── 非关键路径的验证跳过
```

非阻断性错误超过 5 条时升格为优先处理。

## 资源冲突决策

| 冲突                            | 裁决                                   |
| ------------------------------- | -------------------------------------- |
| MCP vs Skill 信息矛盾           | MCP 优先（实时数据 > 静态知识）        |
| Workflow vs Execution Plan 矛盾 | Execution Plan 优先（约束 > 流程建议） |
| 通用 vs 领域规则矛盾            | 领域规则优先（专精 > 通用）            |
| 用户直接指令 vs 规则矛盾        | 用户指令优先，但标注风险               |
