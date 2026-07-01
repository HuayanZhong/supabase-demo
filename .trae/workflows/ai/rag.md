# 工作流：知识库/向量检索开发

对应 agent：`ai-integration-engineer`

---

## 1. 触发条件

- 请求包含：RAG、知识库、向量检索、Embedding、语义搜索、pgvector 等关键词
- 需要为 AI 对话添加文档知识库支持

## 2. 准备工作

| 资源                             | 用途                               |
| -------------------------------- | ---------------------------------- |
| `rules/project-architecture.md`  | 了解项目结构                       |
| `workflows/ai/integrate.md`      | 确认 AI Service（嵌入模型）已就绪  |
| `workflows/ai/chat.md`           | 确认对话功能已就绪（RAG 增强对话） |
| supabase MCP — `list_extensions` | 检查 pgvector 是否已启用           |
| supabase MCP — `execute_sql`     | 执行 DDL 创建向量表/索引           |
| supabase MCP — `get_advisors`    | 获取性能建议                       |
| `execution-plan/ai/`             | 规划指引：约束/最佳实践/决策策略   |
| `execution-engine/ai/`           | 执行指引：约束/最佳实践/决策策略   |

## 3. 执行步骤

### Step 1：检查并启用 pgvector

- 使用 supabase MCP 的 `list_extensions` 检查 `vector` 扩展是否已启用
- 如未启用，使用 `execute_sql` 执行 `CREATE EXTENSION IF NOT EXISTS vector;`
- 使用 supabase MCP 的 `get_advisors` 确认无安全/性能风险

### Step 2：设计向量库结构

在后端定义向量相关类型和实体：

```
apps/backend/src/
└── modules/rag/
    ├── rag.module.ts                  — 模块定义
    ├── rag.service.ts                 — 嵌入/检索服务
    ├── rag.service.spec.ts            — 单元测试
    └── interfaces/
        ├── document.interface.ts      — 文档类型定义
        └── embedding.interface.ts     — 向量类型定义
```

数据库表结构设计：

```sql
-- 文档表
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 向量表（使用 pgvector）
CREATE TABLE embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  embedding VECTOR(1536),            -- 维度根据嵌入模型调整
  chunk_index INT,                    -- 文档分块序号
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 向量索引（IVFFlat 或 HNSW）
CREATE INDEX ON embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

> 注意：索引类型和参数需根据数据量和查询性能调优，`lists` 值建议为 `sqrt(row_count)`。

### Step 3：实现嵌入和检索流程

- 文档处理流程：分块（chunking）→ 生成嵌入 → 存储
  - 分块策略：根据文档类型选择按段落/按固定 token 数分割
  - 嵌入模型复用 `integrate.md` 中集成的 AI Service
- 检索流程：查询文本 → 生成查询嵌入 → 向量相似度检索 → 返回 Top-K 结果
  - 相似度度量：余弦相似度（`<=>` 操作符）
  - 可使用 Supabase RPC 封装检索逻辑为数据库函数
- 可选：结合对话上下文进行检索（Hybrid Search，结合关键词 + 向量）

### Step 4：前端展示

- 在对话界面中添加引用来源展示
- 检索结果显示匹配文档的标题、摘要片段和相似度分数
- 复用 `workflows/ai/chat.md` 中的对话组件扩展

### Step 5：验证

- 使用 supabase MCP 的 `execute_sql` 确认表结构和索引创建成功
- 插入测试文档和嵌入向量，执行检索查询验证召回率
- 端到端测试：上传文档 → 对话中引用 → 返回来源
- 性能测试：大量文档下检索延迟，确认索引生效

## 4. 完成检查

- [ ] pgvector 扩展已启用
- [ ] `documents` 和 `embeddings` 表已创建，索引已建立
- [ ] 文档分块 + 嵌入生成流程正常工作
- [ ] 向量检索返回 Top-K 结果，准确率可接受
- [ ] 对话中引用来源展示正确
- [ ] 检索延迟在可接受范围内（< 500ms）

## 5. 输出

- `rag.module.ts` + `rag.service.ts` — RAG 模块
- `document.interface.ts` + `embedding.interface.ts` — 类型定义
- 数据库迁移文件（启用 pgvector + 建表 + 建索引）
- 前端引用来源展示组件
