# Seeder 配置

## 基本配置

在 `mikro-orm.config.ts` 中：

```typescript
import { SeedManager } from "@mikro-orm/seeder";

export default defineConfig({
  extensions: [Migrator, SeedManager],
  seeder: {
    path: "dist/seeders", // 编译后的 JS 文件目录（生产环境）
    pathTs: "src/seeders", // TypeScript 源文件目录（开发环境）
    defaultSeeder: "DatabaseSeeder",
    glob: "!(*.d).{js,ts}", // 匹配 seeder 文件
    emit: "ts", // 生成文件的格式
    fileName: (className: string) => className, // 文件命名规则
  },
});
```

## 配置选项说明

| 选项            | 默认值                     | 说明                                    |
| --------------- | -------------------------- | --------------------------------------- |
| `path`          | `'./seeders'`              | 编译后 JS 文件路径（生产用）            |
| `pathTs`        | `undefined`                | TS 源文件路径（开发用，CLI 自动使用）   |
| `defaultSeeder` | `'DatabaseSeeder'`         | 默认 seeder 类名                        |
| `glob`          | `'!(*.d).{js,ts}'`         | 文件匹配模式                            |
| `emit`          | `'ts'`                     | 生成文件格式：`'ts'` / `'js'` / `'cjs'` |
| `fileName`      | `(className) => className` | 文件名生成函数                          |

## 环境变量覆盖

- `MIKRO_ORM_SEEDER_PATH`
- `MIKRO_ORM_SEEDER_PATH_TS`
- `MIKRO_ORM_SEEDER_EMIT`
- `MIKRO_ORM_SEEDER_GLOB`
- `MIKRO_ORM_SEEDER_DEFAULT_SEEDER`

## 前置条件

安装 `@mikro-orm/seeder` 并在配置中注册 `SeedManager` 扩展：

```typescript
import { SeedManager } from "@mikro-orm/seeder";

export default defineConfig({
  extensions: [Migrator, SeedManager],
  // ...
});
```

## 生产环境配置

生产环境使用编译后的 JS 文件，配置 `path` 指向 `dist`：

```typescript
seeder: {
  path: 'dist/seeders',      // 生产用（编译后 JS）
  pathTs: 'src/seeders',     // 开发用（TS 源码）
},
```

或使用自动检测：

```typescript
import { Utils } from '@mikro-orm/core';

seeder: {
  path: Utils.detectTypeScriptSupport() ? 'src/seeders' : 'dist/seeders',
},
```
