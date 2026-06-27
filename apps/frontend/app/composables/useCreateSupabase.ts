import { createBrowserClient } from "@supabase/ssr";

/** Supabase 客户端单例（浏览器端，使用 cookie 存储 session，与服务端一致） */
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null;

export function useCreateSupabase() {
  if (!supabaseInstance) {
    const config = useRuntimeConfig();
    supabaseInstance = createBrowserClient(
      config.public.supabaseUrl,
      config.public.supabasePublishableKey,
    );
  }
  return supabaseInstance;
}
