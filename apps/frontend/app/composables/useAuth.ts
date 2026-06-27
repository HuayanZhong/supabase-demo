/** 认证状态管理（基于 Supabase 客户端 session） */
export function useAuth() {
  const supabase = useCreateSupabase();

  /** 检查认证状态（客户端本地读取 cookie 中的 session，不走后端） */
  async function checkAuth(): Promise<boolean> {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  }

  /** 登录成功后标记（刷新 session 缓存） */
  async function setAuthed() {
    await supabase.auth.getSession();
  }

  /** 退出登录 */
  async function clearAuth() {
    await supabase.auth.signOut();
  }

  return { checkAuth, setAuthed, clearAuth };
}
