# RAG Pipeline 骨架

适用：基于 Supabase + pgvector 构建 RAG 检索增强生成

## 涉及文件

| 文件                                             | 说明                     |
| ------------------------------------------------ | ------------------------ |
| `apps/backend/src/{domain}/{domain}.service.ts`  | RAG 核心逻辑             |
| `apps/backend/src/{domain}/{document}.entity.ts` | 文档向量实体             |
| 迁移文件                                         | pgvector 扩展 + 向量索引 |

## Entity 定义

```typescript
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: '{table_name}' })
export class {EntityName} {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'text' })
  content!: string;

  @Property({ type: 'json' })
  metadata!: Record<string, any>;

  // vector 字段通过 SQL migration 添加（MikroORM 不原生支持 pgvector）
}
```

## Migration SQL

```sql
CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE {table_name} ADD COLUMN embedding vector(1536);

CREATE INDEX ON {table_name} USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
```

## RAG 流程

1. 用户输入 → 调用 embedding API 转为向量
2. 在 Supabase 中执行 `SELECT * FROM {table_name} ORDER BY embedding <=> $1 LIMIT 5`
3. 将检索结果作为上下文拼入 prompt
4. 调用 Chat API 生成回答

## 后处理

- 确认 Supabase 项目已启用 pgvector 扩展
- embedding 维度与使用的模型对齐（OpenAI text-embedding-3-small=1536）
