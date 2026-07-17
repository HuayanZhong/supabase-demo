// 文件级说明：authSchema Zod 校验规则的单元测试
import { describe, it, expect } from "vitest";
import { authSchema } from "@supabase/types";

describe("authSchema", () => {
  // 合法输入
  it("应通过合法的邮箱和密码", () => {
    const result = authSchema.safeParse({
      email: "user@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  // 邮箱校验
  it("应拒绝无效的邮箱格式", () => {
    const result = authSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain("email");
    }
  });

  it("应拒绝空邮箱", () => {
    const result = authSchema.safeParse({
      email: "",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  // 密码校验
  it("应拒绝长度不足 8 位的密码", () => {
    const result = authSchema.safeParse({
      email: "user@example.com",
      password: "1234567",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain("password");
    }
  });

  it("应拒绝空密码", () => {
    const result = authSchema.safeParse({
      email: "user@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain("password");
    }
  });

  // 必填字段
  it("应拒绝缺失邮箱字段", () => {
    const result = authSchema.safeParse({
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("应拒绝缺失密码字段", () => {
    const result = authSchema.safeParse({
      email: "user@example.com",
    });
    expect(result.success).toBe(false);
  });
});
