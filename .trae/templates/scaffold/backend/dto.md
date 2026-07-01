# DTO 骨架

适用：基于 Zod v4 定义 NestJS Controller 的请求 DTO（Create / Update 变体）

## 输出文件

| 内容        | 路径                                            |
| ----------- | ----------------------------------------------- |
| Schema 定义 | `packages/types/src/{domain}/index.ts`          |
| 类型汇总    | `apps/backend/src/types/request.ts`（按需引用） |

> 按项目约定，Zod schema 统一放在 `packages/types`，前后端共享。详见 `shared/types.md`。

## 骨架内容（Schema 定义）

```typescript
import { z } from 'zod';

// --- 创建 Schema ---
export const create{EntityName}Schema = z.object({
  // name: z.string().min(1, '名称不能为空'),
  // description: z.string().optional(),
});

export type Create{EntityName}Dto = z.infer<typeof create{EntityName}Schema>;

// --- 更新 Schema（所有字段可选）---
export const update{EntityName}Schema = create{EntityName}Schema.partial();

export type Update{EntityName}Dto = z.infer<typeof update{EntityName}Schema>;
```

## 填充规则

| 占位           | 替换为                     |
| -------------- | -------------------------- |
| `{domain}`     | 所属领域目录名，如 `goals` |
| `{EntityName}` | PascalCase，如 `Goal`      |

## 在 Controller 中使用

```typescript
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { create{EntityName}Schema, Create{EntityName}Dto } from '@supabase/types/{domain}';

@Post()
create(@Body(new ZodValidationPipe(create{EntityName}Schema)) dto: Create{EntityName}Dto) {
  return this.{serviceInstance}.create(dto);
}

@Patch(':id')
update(
  @Param('id', ParseIntPipe) id: number,
  @Body(new ZodValidationPipe(update{EntityName}Schema)) dto: Update{EntityName}Dto,
) {
  return this.{serviceInstance}.update(id, dto);
}
```

## 必填项标注

| 项                         | 必填 | 说明                                  |
| -------------------------- | ---- | ------------------------------------- |
| `create{EntityName}Schema` | 是   | 创建请求的字段与校验规则              |
| `Create{EntityName}Dto`    | 是   | 由 `z.infer` 派生，禁止手写 interface |
| `update{EntityName}Schema` | 是   | 默认用 `.partial()` 派生自 create     |
| `Update{EntityName}Dto`    | 是   | 同样由 `z.infer` 派生                 |

## 常用 Zod 字段

| 写法                          | 用途               |
| ----------------------------- | ------------------ |
| `z.string().min(1)`           | 非空字符串         |
| `z.email()`                   | 邮箱格式（Zod v4） |
| `z.number().int().positive()` | 正整数             |
| `z.enum(['a','b'])`           | 枚举               |
| `z.array(z.string())`         | 字符串数组         |
| `.optional()`                 | 可选字段           |
| `.nullable()`                 | 可空字段           |

## 后处理

- 在 `packages/types/package.json` 的 `exports` 中注册子路径 `./{domain}`
- 在 `packages/types/src/index.ts` 中 `export * from './{domain}/index.ts'`
- 校验逻辑通过 Zod Pipe 统一处理，Controller 内不得重复手写校验
- 复杂业务校验（如唯一性、跨表约束）放在 Service 层，不放 DTO
- DTO 类型用 `z.infer` 派生，禁止手写重复的 interface
