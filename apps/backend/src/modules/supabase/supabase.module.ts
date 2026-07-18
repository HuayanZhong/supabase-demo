/**
 * Supabase 模块 — 提供 Supabase 管理客户端及认证相关注入
 *
 * 使用 service_role key 初始化客户端，用于在 Guard 中验证用户 JWT token。
 * 全局注册，导出 SUPABASE_CLIENT 供其他模块使用。
 */
import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { EnvVars } from "@supabase/config";
import { SUPABASE_CLIENT } from "../../common/constants";
import { SupabaseGuard } from "../../common/guards/supabase.guard";
import { AuthController } from "./auth.controller";

@Global()
@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: SUPABASE_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvVars, true>): SupabaseClient => {
        const url = config.get("SUPABASE_URL");
        const key = config.get("SUPABASE_SERVICE_ROLE_KEY");
        if (!url || !key) {
          throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
        }
        return createClient(url, key);
      },
    },
    {
      provide: APP_GUARD,
      useClass: SupabaseGuard,
    },
  ],
  exports: [SUPABASE_CLIENT],
})
export class SupabaseModule {}
