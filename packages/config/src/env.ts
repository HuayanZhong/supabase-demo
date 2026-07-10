import { z } from "zod";

/** 环境变量解析失败错误 */
export class EnvError extends Error {
  readonly issues: Array<{ path: string; message: string }>;

  constructor(message: string, issues: Array<{ path: string; message: string }>) {
    super(message);
    this.name = "EnvError";
    this.issues = issues;
  }
}

/** 用 Zod schema 校验环境变量，失败时抛出 EnvError */
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

/** 必填字符串 */
export function envString() {
  return z.string().min(1);
}

/** 可选字符串 */
export function envOptionalString() {
  return z.string().optional();
}

/** 合法 URL */
export function envUrlString() {
  return z.url();
}

/** "host:port" 格式字符串 */
export function envHostPortString() {
  return z.string().regex(/^[a-zA-Z0-9._-]+:\d+$/);
}

/** 正整数（允许字符串输入，自动转型） */
export function envIntString() {
  return z.coerce.number().int().positive();
}

/** 非负整数（允许字符串输入，自动转型） */
export function envNonNegativeIntString() {
  return z.coerce.number().int().nonnegative();
}

/** 布尔值（允许字符串输入，自动转型） */
export function envBoolString() {
  return z.coerce.boolean();
}
