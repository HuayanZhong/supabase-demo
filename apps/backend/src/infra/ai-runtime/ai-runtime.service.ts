import { Injectable, OnModuleInit } from "@nestjs/common";
import { AiRuntime } from "@supabase/ai-runtime";
import type { AiRuntimeConfig } from "@supabase/ai-runtime";
import { ConfigService } from "@nestjs/config";

/**
 * AI Runtime 服务 — 运行时初始化和访问入口
 *
 * OnModuleInit 阶段创建 Runtime 实例，避免在模块构造阶段读取环境变量。
 * 业务模块注入此服务来获取模型和 Agent 能力。
 */
@Injectable()
export class AiRuntimeService implements OnModuleInit {
  private runtime!: AiRuntime;

  constructor(private configService: ConfigService) {}

  onModuleInit(): void {
    const runtimeConfig: AiRuntimeConfig = {
      deepseek: {
        apiKey: this.configService.getOrThrow("DEEPSEEK_API_KEY"),
      },
      zhipu: {
        apiKey: this.configService.getOrThrow("ZHIPUAI_API_KEY"),
      },
    };

    this.runtime = new AiRuntime(runtimeConfig);
  }

  /** 生成每日一句 */
  generateDailyQuote() {
    return this.runtime.generateDailyQuote();
  }
}
