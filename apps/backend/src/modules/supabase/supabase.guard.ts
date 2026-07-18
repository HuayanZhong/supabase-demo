/**
 * Supabase Guard — 验证请求中的 Bearer token
 *
 * 从 Authorization header 提取 access_token，调用 supabase.auth.getUser()
 * 验证 token 有效性。验证通过后将用户信息挂载到 request.user。
 * 使用 @Public() 装饰器可跳过认证（如 health check）。
 *
 * 认证失败时会记录 warn 级别日志，便于安全审计。
 */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Logger } from "nestjs-pino";
import { SUPABASE_CLIENT } from "./constants";
import { IS_PUBLIC_KEY } from "../../common/decorators/public.decorator";
import type { SupabaseClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseGuard implements CanActivate {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
    private readonly reflector: Reflector,
    private readonly logger: Logger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 检查是否标记为公开路由
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      this.logger.warn({ ip: request.ip, path: request.url }, "缺少 Authorization 头");
      throw new UnauthorizedException("缺少 Authorization 头");
    }

    // 兼容 "Bearer xxx" 和 "bearer xxx" 写法
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

    const { data, error } = await this.supabase.auth.getUser(token);

    if (error || !data.user) {
      this.logger.warn(
        { ip: request.ip, path: request.url, error: error?.message },
        "Token 验证失败",
      );
      throw new UnauthorizedException("Token 无效或已过期");
    }

    // 挂载用户信息到请求
    request.user = data.user;
    return true;
  }
}
