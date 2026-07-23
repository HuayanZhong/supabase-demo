import { Module, Global } from "@nestjs/common";
import { AiRuntimeService } from "./ai-runtime.service";

/**
 * AI Runtime 模块 — 全局单例
 *
 * 提供 AiRuntime 实例，业务模块通过依赖注入获取。
 */
@Global()
@Module({
  providers: [AiRuntimeService],
  exports: [AiRuntimeService],
})
export class AiRuntimeModule {}
