import { z } from "zod";

/** 后端所需环境变量 schema（新增变量时同步更新 .env.example） */
export const envSchema = z.object({
  // PostgreSQL 连接串
  DATABASE_URL: z.url(),

  // 服务监听端口（默认 4000）
  PORT: z.coerce.number().int().positive().default(4000),

  // Supabase 项目地址
  SUPABASE_URL: z.url(),

  // 前端地址（CORS 白名单）
  FRONTEND_URL: z.string().default("http://localhost:3000"),

  // PostgreSQL 直连串（Session-mode pooler，用于迁移/DDL 操作，可选）
  DIRECT_URL: z.string().optional(),

  // 和风天气 API Host（控制台 → 设置 → API Host）
  WEATHER_API_HOST: z.string().min(1),

  // 和风天气 JWT 私钥（Ed25519 PEM，控制台生成）
  WEATHER_JWT_PRIVATE_KEY: z.string().min(1),

  // 和风天气 JWT 凭据 ID
  WEATHER_JWT_KID: z.string().min(1),

  // 和风天气 JWT 项目 ID
  WEATHER_JWT_SUB: z.string().min(1),

  // 运行环境（development / production / test）
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Supabase 服务角色密钥（用于后端验证 JWT、管理操作）
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  // JWT_SECRET: z.string().min(32),                  // 等功能需要时启用
});

export type EnvVars = z.infer<typeof envSchema>;
