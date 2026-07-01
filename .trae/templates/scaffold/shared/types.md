# Types 骨架

适用：在共享包中新增类型定义

## 输出文件

`packages/types/src/{domain}/index.ts`

## 骨架内容

```typescript
import { z } from 'zod';

// --- Schema 定义 ---
export const {schemaName}Schema = z.object({{
  // 字段定义
  // name: z.string().min(1),
  // email: z.string().email(),
}});

// --- 类型导出 ---
export type {TypeName} = z.infer<typeof {schemaName}Schema>;
```

## 填充规则

| 占位           | 替换为                            |
| -------------- | --------------------------------- |
| `{domain}`     | 所属领域目录，如 `goals`          |
| `{schemaName}` | PascalCase，如 `Goal`             |
| `{TypeName}`   | 通常与 SchemaName 同名，如 `Goal` |

## 在 package.json 注册子路径

在 `packages/types/package.json` 的 `exports` 字段中添加：

```json
"./{domain}": {
  "types": "./src/{domain}/index.ts",
  "import": "./src/{domain}/index.ts"
}
```

## 在入口文件导出

在 `packages/types/src/index.ts` 中：

```typescript
export * from "./{domain}/index.js";
```

## 常用 Zod 方法

| 方法                    | 用途     |
| ----------------------- | -------- |
| `z.string()`            | 字符串   |
| `z.number()`            | 数字     |
| `z.boolean()`           | 布尔值   |
| `z.enum(['a', 'b'])`    | 枚举     |
| `z.array(z.string())`   | 数组     |
| `z.string().nullable()` | 可空     |
| `.optional()`           | 可选字段 |
| `.describe('说明')`     | 字段说明 |
