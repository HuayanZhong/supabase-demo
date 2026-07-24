import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";

/**
 * 认证模块
 *
 * 提供当前登录用户信息查询接口。
 */
@Module({
  controllers: [AuthController],
})
export class AuthModule {}
