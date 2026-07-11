import { z } from "zod";

/** 后端所需环境变量 schema（新增变量时同步更新 .env.example） */
export const envSchema = z.object({
  // PostgreSQL 连接串
  DATABASE_URL: z.url(),

  // 服务监听端口（默认 4000）
  PORT: z.coerce.number().int().positive().default(4000),

  // Supabase 项目地址
  SUPABASE_URL: z.url(),

  // 天气 API Key（和风天气）
  WEATHER_API_KEY: z.string().min(1),

  // SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),   // 等功能需要时启用
  // JWT_SECRET: z.string().min(32),                  // 等功能需要时启用
});

export type EnvVars = z.infer<typeof envSchema>;
