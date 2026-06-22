import { createBrowserClient } from "@supabase/ssr";

// 创建supabase 浏览器客户端
export function useCreateSupabase() {
  return createBrowserClient(
    useRuntimeConfig().public.supabaseUrl,
    useRuntimeConfig().public.supabasePublishableKey,
  );
}
