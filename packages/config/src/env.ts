import { z } from "zod";

// 环境变量解析错误，包含具体的路径和错误信息
export class EnvError extends Error {
  readonly issues: Array<{ path: string; message: string }>;

  constructor(message: string, issues: Array<{ path: string; message: string }>) {
    super(message);
    this.name = "EnvError";
    this.issues = issues;
  }
}

// 用 Zod schema 解析环境变量，失败时抛出 EnvError
export function parseEnv<TSchema extends z.ZodType>(
  schema: TSchema,
  env: Record<string, unknown>,
  opts?: { label?: string },
): z.infer<TSchema> {
  const parsed = schema.safeParse(env);
  if (parsed.success) return parsed.data;
  const issues = parsed.error.issues.map((i) => ({
    path: i.path.join("."),
    message: i.message,
  }));
  const label = opts?.label ? ` (${opts.label})` : "";
  throw new EnvError(`Invalid environment${label}`, issues);
}

// 环境变量解析器：必填字符串
export function envString() {
  return z.string().min(1);
}

// 环境变量解析器：可选字符串
export function envOptionalString() {
  return z.string().optional();
}

// 环境变量解析器：URL 字符串
export function envUrlString() {
  return z.string().url();
}

// 环境变量解析器：host:port 格式（如 "localhost:4000"）
export function envHostPortString() {
  return z.string().regex(/^[a-zA-Z0-9._-]+:\d+$/);
}

// 环境变量解析器：正整数
export function envIntString() {
  return z.coerce.number().int().positive();
}

// 环境变量解析器：非负整数
export function envNonNegativeIntString() {
  return z.coerce.number().int().nonnegative();
}

// 环境变量解析器：布尔值
export function envBoolString() {
  return z.coerce.boolean();
}
