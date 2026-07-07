import { z } from "zod";

// 项目环境变量统一 Schema 定义
// 新增环境变量时：1) 在此文件添加定义  2) 在 .env.example 添加占位符
export const envSchema = z.object({
  // PostgreSQL
  DATABASE_URL: z.string().url(),

  // Supabase
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // Auth
  JWT_SECRET: z.string().min(32),

  // LLM / AI（可选）
  OPENAI_API_KEY: z.string().optional(),
});

export type EnvVars = z.infer<typeof envSchema>;
