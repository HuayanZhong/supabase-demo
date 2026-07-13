import { defineConfig } from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";
import { config } from "dotenv";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

config({ path: ".env" });

export default defineConfig({
  // 数据库名称
  dbName: "postgres",
  // 从环境变量中获取数据库连接字符串
  // 使用 DIRECT_URL (session-mode pooler) 用于迁移，DATABASE_URL (transaction-mode pooler) 用于运行时
  clientUrl: process.env.DIRECT_URL || process.env.DATABASE_URL,

  // 显式列出实体
  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],

  // 启用的扩展
  extensions: [Migrator],

  // 启用反射元数据提供程序
  metadataProvider: TsMorphMetadataProvider,

  // 开启调试模式，记录SQL查询和发现信息
  debug: true,

  // Schema Generator 配置
  schemaGenerator: {
    // 只管理 public schema，忽略 Supabase 系统 schema
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

  // 迁移配置
  migrations: {
    path: "src/migrations",
    pathTs: "src/migrations",
  },
});
