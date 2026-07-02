# 降级方案库

## 用途

登记每个 MCP 的降级方案，确保 MCP 不可用时治理框架能继续执行（执行引擎 constraint.md L86 要求"所有 MCP 调用必须定义降级路径"）。

## 降级方案表

| MCP             | 降级方案                                    | 触发条件          | 数据一致性影响   |
| --------------- | ------------------------------------------- | ----------------- | ---------------- |
| supabase        | 本地 PostgreSQL 直连（读 `.env` 连接串）    | MCP 不可用 / 超时 | 无（同一数据库） |
| nuxt-ui         | 查询本地组件文档 `.trae/resources/nuxt-ui/` | MCP 不可用        | 可能缺最新组件   |
| tavily_search   | WebSearch 工具替代                          | MCP 不可用 / 超时 | 结果质量略低     |
| chrome-devtools | 跳过浏览器验证，标记"未验证"                | MCP 不可用        | 评估阶段降级     |
| windows-cli     | Shell 工具替代（部分命令兼容）              | MCP 不可用        | 部分命令不可用   |

## 维护规则

- **新增 MCP 时**：sync.md 必须同时登记降级方案，未登记的 MCP 不允许投入使用
- **降级方案不可用**：标记"无降级方案"并上报人工（违反 constraint.md L86）
- **降级方案执行后**：日志必须标注 `degraded=true`，评估阶段记录"降级执行"
- **定期审查**：每 10 次任务后，evolution 聚合时检查降级方案是否仍有效

## 降级触发日志

```
[ENGINE:tool]    FAIL   | MCP 不可用 | mcp=xxx;status=offline
[ENGINE:degrade] WARN   | 降级方案 | mcp=xxx;fallback=本地直连;degraded=true
[ENGINE:step]    OK     | 降级执行 | tool=xxx;via=fallback;degraded=true
```

## 与 sync.md 协同

资源同步流程（sync.md）步骤 3 传播表增加第 3h 项：

| 资源类型     | 需要更新的降级方案库范围            | 更新位置               |
| ------------ | ----------------------------------- | ---------------------- |
| 新增 MCP     | `resources/degradation-registry.md` | 降级方案表             |
| 删除 MCP     | `resources/degradation-registry.md` | 移除对应行             |
| MCP 能力变化 | `resources/degradation-registry.md` | 评估降级方案是否仍有效 |
