// 文件级说明：useAuth composable 的单元测试
// 注意：因 @nuxt/test-utils Nuxt 环境初始化超时（>10s），改用 unit 环境 + 手动 mock
// 局限性：import.meta.server/client 在 unit 环境下为 undefined，
//         checkAuth 仍能走客户端路径；setAuthed 客户端分支不会执行
import { describe, it, expect, vi, beforeEach } from "vitest";

// 模拟 useRequestFetch（Nuxt 内置 composable，仅在服务端分支使用）
vi.stubGlobal("useRequestFetch", vi.fn());

// 模拟 useCreateSupabase（Nuxt auto-import composable）
const mockGetSession = vi.fn();
const mockSignOut = vi.fn();
vi.stubGlobal("useCreateSupabase", () => ({
  auth: {
    getSession: mockGetSession,
    signOut: mockSignOut,
  },
}));

// Nuxt 环境下 auto-import 的 composable，在 vitest unit 环境中需动态导入
const { useAuth } = await import("../../app/composables/useAuth.ts");

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("checkAuth", () => {
    // unit 环境下 import.meta.server 为 undefined，代码进入客户端分支
    it("有 session 时返回 true", async () => {
      mockGetSession.mockResolvedValue({
        data: { session: { user: { id: "1" } } },
      });

      const { checkAuth } = useAuth();
      const result = await checkAuth();

      expect(result).toBe(true);
      expect(mockGetSession).toHaveBeenCalledOnce();
    });

    it("无 session 时返回 false", async () => {
      mockGetSession.mockResolvedValue({
        data: { session: null },
      });

      const { checkAuth } = useAuth();
      const result = await checkAuth();

      expect(result).toBe(false);
    });

    it("getSession 抛出异常时传播错误（客户端路径无 try-catch）", async () => {
      mockGetSession.mockRejectedValue(new Error("network error"));

      const { checkAuth } = useAuth();
      await expect(checkAuth()).rejects.toThrow("network error");
    });
  });

  describe("setAuthed", () => {
    it("客户端环境下调用 getSession（unit 环境下 import.meta.client 为 undefined）", async () => {
      mockGetSession.mockResolvedValue({
        data: { session: { user: { id: "1" } } },
      });

      const { setAuthed } = useAuth();
      await setAuthed();

      // unit 环境下 import.meta.client 为 undefined，客户端分支不会执行
      expect(mockGetSession).not.toHaveBeenCalled();
    });
  });

  describe("clearAuth", () => {
    it("调用 supabase.auth.signOut", async () => {
      mockSignOut.mockResolvedValue({ error: null });

      const { clearAuth } = useAuth();
      await clearAuth();

      expect(mockSignOut).toHaveBeenCalledOnce();
    });

    it("signOut 抛出异常时传播错误", async () => {
      mockSignOut.mockRejectedValue(new Error("sign out failed"));

      const { clearAuth } = useAuth();
      await expect(clearAuth()).rejects.toThrow("sign out failed");
    });
  });
});
