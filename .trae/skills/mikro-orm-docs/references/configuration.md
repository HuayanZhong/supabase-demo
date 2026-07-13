# 配置选项

## 数据库连接

```typescript
export default defineConfig({
  dbName: "postgres",
  clientUrl: process.env.DIRECT_URL || process.env.DATABASE_URL,
  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
  extensions: [Migrator, SeedManager],
  metadataProvider: TsMorphMetadataProvider,
  debug: process.env.NODE_ENV !== "production",
});
```

## Schema Generator（Supabase 专用）

```typescript
schemaGenerator: {
  ignoreSchema: [
    'auth', 'storage', 'realtime', 'vault',
    'extensions', 'graphql', 'graphql_public',
    'pgsodium', 'pgsodium_masks',
    'supabase_functions', 'supabase_migrations',
    'pgbouncer'
  ],
},
```

## 迁移配置

```typescript
migrations: {
  path: 'src/migrations',
  pathTs: 'src/migrations',
  tableName: 'mikro_orm_migrations',
  transactional: true,
  allOrNothing: true,
  dropTables: true,
  safe: false,
  snapshot: true,
  emit: 'ts',
},
```

## Seeder 配置

```typescript
seeder: {
  path: 'dist/seeders',
  pathTs: 'src/seeders',
  defaultSeeder: 'DatabaseSeeder',
},
```

## 完整配置示例

```typescript
import { defineConfig } from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";
import { SeedManager } from "@mikro-orm/seeder";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

export default defineConfig({
  dbName: "postgres",
  clientUrl: process.env.DIRECT_URL || process.env.DATABASE_URL,

  // 实体发现
  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],

  // 扩展
  extensions: [Migrator, SeedManager],

  // 元数据
  metadataProvider: TsMorphMetadataProvider,

  // 调试
  debug: process.env.NODE_ENV !== "production",

  // Schema 生成器（Supabase 专用）
  schemaGenerator: {
    ignoreSchema: [
      "auth",
      "storage",
      "realtime",
      "vault",
      "extensions",
      "graphql",
      "graphql_public",
      "pgsodium",
      "pgsodium_masks",
      "supabase_functions",
      "supabase_migrations",
      "pgbouncer",
    ],
  },

  // 迁移
  migrations: {
    path: "src/migrations",
    pathTs: "src/migrations",
    tableName: "mikro_orm_migrations",
    transactional: true,
    allOrNothing: true,
    dropTables: true,
    safe: false,
    snapshot: true,
    emit: "ts",
  },

  // Seeder
  seeder: {
    path: "dist/seeders",
    pathTs: "src/seeders",
    defaultSeeder: "DatabaseSeeder",
  },
});
```
