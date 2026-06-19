import { defineConfig } from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";

export default defineConfig({
  // 数据库名称
  dbName: "postgres",
  // 从环境变量中获取数据库连接字符串
  clientUrl: process.env.DATABASE_URL,

  // 显式列出实体
  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],

  // 启用的扩展
  extensions: [Migrator],

  // 开启调试模式，记录SQL查询和发现信息
  debug: true,
});
