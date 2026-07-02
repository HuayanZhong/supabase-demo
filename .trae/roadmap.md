# 演进路线图（Upgrade Ideas）

记录未来迭代方向和技术债。不做即时修复，只做"等资源/时机成熟时再动手"的备忘。

## 格式

```
[提案-{YYMMDD}-{seq}] 标题
- 动机：当前痛点
- 方案：粗略构想
- 前置条件：需要先完成什么
- 状态：pending / in-design / blocked
```

---

[提案-240702-001] 记忆系统迁移到向量数据库

- 动机：当前 memory/ 全量 Markdown + JSON 存储，项目后期膨胀后检索困难、召回率差，无法语义搜索
- 方案：三阶段迁移（详见下方专题）
- 前置条件：治理框架稳定运行、经验数据积累到一定量级
- 状态：in-design

[提案-240702-002] Checkpoint 的恢复断点对接 sessions/ 日志

- 动机：当前 checkpoint 写到 loop-state/，session 日志写到 sessions/，两者互不关联，恢复时需读两份数据
- 方案：checkpoint 元信息嵌入 session 日志头部
- 前置条件：checkpoint 系统稳定
- 状态：pending

---

## 专题讨论：记忆系统迁移到向量数据库

### 现状（Phase 0）

```
.trae/memory/
├── sessions/      → 100+ JSON 文件，按日期命名
├── experience/    → 60+ JSON 文件，evolution 聚合产生
├── patterns/      → 10-50 Markdown 文件，模式描述
├── profile/       → 若干 Markdown/JSON
├── aggregation/   → 聚合报告
```

**问题：**

- 文件数线性增长 → sessions 每周 7 个，experience 每迭代 1 个
- 检索只靠 Grep + 文件名 → 无语义理解，召回率完全依赖关键词匹配
- 跨文件关联靠手动标注 source 字段 → 无法自动发现关联
- 无排序/权重 → "最近 10 条" 粗暴截断可能丢弃高价值经验

### 建议升级路径

#### Phase 1：本地 SQLite + FTS5（近期，不引入外部依赖）

```
优势：
- Node.js 内置（better-sqlite3 零配置）
- FTS5 全表索引，10 万条记录检索 < 10ms
- 写入仍是 append-only，兼容当前 JSONL 格式
- 无需网络，不依赖 Supabase

缺点：
- 无语义搜索（FTS5 仍是关键词匹配）
- 不支持 embedding / RAG
```

**迁移方式**：写入时同时写 JSONL（兼容） + SQLite（查询用）。查询优先走 SQLite，JSONL 作为备份。

#### Phase 2：pgvector on Supabase（远期，语义搜索）

```
优势：
- 支持 embedding 向量搜索
- 可做 RAG：记忆命中作为对话上下文注入
- 跨会话推理："这个 bug 和 3 个月前那次是不是同一个原因？"

缺点：
- 需要 Supabase 连接
- 需要 embedding 模型（需要 LLM 调用开销）
- 离线不可用（降级到 Phase 1）
```

**迁移方式**：Phase 1 写 SQLite 的同时，同步到 Supabase pgvector。Supabase 不可用时降级到 SQLite。

### 决策思考

| 维度       | 保持现状 | 迁到 SQLite    | 迁到 pgvector                |
| ---------- | -------- | -------------- | ---------------------------- |
| 实现复杂度 | 0        | 低（半天）     | 中（需要 schema 设计）       |
| 检索速度   | 线性下降 | 恒定 < 10ms    | 恒定 < 100ms（含 embedding） |
| 语义搜索   | 无       | 无             | 有                           |
| 离线可用   | 是       | 是             | 降级到 SQLite                |
| 外部依赖   | 无       | better-sqlite3 | Supabase + pgvector          |

**建议**：等治理框架稳定后先走 Phase 1（SQLite），作为"记忆技术债"的统一入口。Phase 2 等经验数据积累到 500+ 条后再评估收益。

### 需要解决的问题

1. **数据同步**：写入时双写 JSONL + SQLite，如何保证一致性？
2. **Schema 设计**：sessions / experience / patterns 结构不同，需统一 schema 还是分表？
3. **备份策略**：SQLite 文件单点故障风险，JSONL 保留为原始数据源
4. **embeddding 成本**：Phase 2 每写入一次调一次 embedding API，费用需评估
