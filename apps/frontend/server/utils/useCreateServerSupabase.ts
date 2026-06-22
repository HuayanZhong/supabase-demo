import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import { appendHeader, getHeader } from "h3";

// 创建 Supabase 服务端客户端（用于 server/api/ 和 server/middleware/）
export function useCreateServerSupabase(event: any) {
  const config = useRuntimeConfig();
  const isProduction = process.env.NODE_ENV === "production";

  return createServerClient(config.public.supabaseUrl, config.public.supabasePublishableKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(getHeader(event, "Cookie") ?? "").map((c) => ({
          name: c.name,
          value: c.value ?? "",
        }));
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          // 生产环境强制安全选项
          const secureOptions = isProduction
            ? { ...options, httpOnly: true, secure: true, sameSite: "strict" as const }
            : options;
          appendHeader(event, "Set-Cookie", serializeCookieHeader(name, value, secureOptions));
        });
      },
    },
  });
}
