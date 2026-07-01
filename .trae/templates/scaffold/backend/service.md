# Service 骨架

适用：新建或扩展 NestJS Service

## 输出文件

`apps/backend/src/{domain}/{domain}.service.ts`

## 骨架内容

```typescript
import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@mikro-orm/nestjs';
// import { EntityRepository } from '@mikro-orm/core';
// import { {EntityName} } from './{entity_file}';

@Injectable()
export class {ServiceName} {
  constructor(
    // @InjectRepository({EntityName})
    // private readonly {repoInstance}: EntityRepository<{EntityName}>,
  ) {}

  // --- 业务方法写在这里 ---
}
```

## 填充规则

| 占位             | 替换为                         |
| ---------------- | ------------------------------ |
| `{domain}`       | 所属领域目录名，如 `goals`     |
| `{ServiceName}`  | PascalCase，如 `GoalsService`  |
| `{EntityName}`   | 关联的 Entity 类名             |
| `{entity_file}`  | 关联 Entity 文件名（不含后缀） |
| `{repoInstance}` | camelCase，如 `goalRepository` |

## 常用方法模式

```typescript
async findAll(): Promise<{EntityName}[]> {
  return this.{repoInstance}.findAll();
}

async findOne(id: number): Promise<{EntityName} | null> {
  return this.{repoInstance}.findOne({ id });
}

async create(data: EntityDto): Promise<{EntityName}> {
  const entity = this.{repoInstance}.create(data);
  await this.{repoInstance}.getEntityManager().flush();
  return entity;
}
```

## 后处理

- 在对应 Module 的 `providers` 数组中注册
