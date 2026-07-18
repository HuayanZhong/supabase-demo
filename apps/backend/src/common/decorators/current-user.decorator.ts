import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { User } from "@supabase/supabase-js";

/**
 * 获取当前认证用户
 *
 * 用法：
 *   @Get()
 *   list(@CurrentUser() user: User)           // 获取完整用户
 *   list(@CurrentUser("id") uid: string)      // 仅获取用户 ID
 */
export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as User;
    return data ? user?.[data] : user;
  },
);
