/** 认证状态管理 */
export function useAuth() {
  const supabase = useCreateSupabase();

  /**
   * 检查认证状态
   * - SSR（首次访问）：走后端接口，服务端可正确读取 cookie
   * - 客户端（路由切换）：本地读取浏览器 cookie，无网络延迟
   */
  async function checkAuth(): Promise<boolean> {
    if (import.meta.server) {
      // SSR：createBrowserClient 无法读取服务端请求的 cookie，走后端接口
      try {
        const { user } = await $fetch("/api/auth/session");
        return !!user;
      } catch {
        return false;
      }
    }

    // 客户端：直接读取浏览器 cookie 中的 session
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  }

  /** 登录成功后刷新客户端 session 缓存 */
  async function setAuthed() {
    if (import.meta.client) {
      await supabase.auth.getSession();
    }
  }

  /** 退出登录 */
  async function clearAuth() {
    await supabase.auth.signOut();
  }

  return { checkAuth, setAuthed, clearAuth };
}
