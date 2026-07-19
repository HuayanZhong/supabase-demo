import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CurrentUser } from "../../../common/decorators/current-user.decorator";
import type { User } from "@supabase/supabase-js";

/**
 * 认证信息控制器
 *
 * 提供当前登录用户信息查询接口，用于验证 token 是否有效。
 */
@ApiTags("认证")
@Controller({ path: "auth", version: "1" })
export class AuthController {
  @Get("me")
  @ApiOperation({ summary: "获取当前登录用户信息" })
  @ApiResponse({
    status: 200,
    description: "当前用户信息",
    schema: {
      type: "object",
      properties: {
        id: { type: "string", example: "uuid" },
        email: { type: "string", example: "user@example.com" },
        created_at: { type: "string" },
      },
    },
  })
  getProfile(@CurrentUser() user: User) {
    return {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    };
  }
}
