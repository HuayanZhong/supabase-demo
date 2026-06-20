import { createClient } from "@supabase/supabase-js";

// 创建supabase客户端
export function useCreateSupabase() {
  return createClient(
    useRuntimeConfig().public.supabaseUrl,
    useRuntimeConfig().public.supabasePublishableKey,
  );
}
