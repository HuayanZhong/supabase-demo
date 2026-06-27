import { createClient } from "@supabase/supabase-js";

/** 创建 Supabase 客户端实例 */
export function useCreateSupabase() {
  return createClient(
    useRuntimeConfig().public.supabaseUrl,
    useRuntimeConfig().public.supabasePublishableKey,
  );
}
