import { SetMetadata } from "@nestjs/common";

/** 标记路由为公开（跳过 SupabaseGuard 认证） */
export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
