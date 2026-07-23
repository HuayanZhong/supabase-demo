import { createDeepSeek, createZhipu } from "@supabase/ai-models";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { createDailyQuoteAgent, generateDailyQuote } from "@supabase/ai-core";
import type { AiRuntimeConfig, ModelName, AgentName } from "@supabase/types/ai-models";

/**
 * AI Runtime — 模型与 Agent 的集中管理器
 *
 * 负责根据配置创建模型实例，并通过模型组装 Agent。
 * 应用层通过此 Runtime 访问所有 AI 能力。
 */
export class AiRuntime {
  private models = new Map<ModelName, BaseChatModel>();
  private agents = new Map<AgentName, ReturnType<typeof createDailyQuoteAgent>>();

  constructor(config: AiRuntimeConfig) {
    this.initModels(config);
    this.initAgents();
  }

  /** 初始化模型实例 */
  private initModels(config: AiRuntimeConfig): void {
    const { deepseek, zhipu } = config;

    if (deepseek) {
      this.models.set("deepseek", createDeepSeek(deepseek));
    }
    if (zhipu) {
      this.models.set("zhipu", createZhipu(zhipu));
    }
  }

  /** 初始化 Agent */
  private initAgents(): void {
    // 默认用 zhipu 模型创建每日一句 agent；如果 zhipu 不可用则回退到 deepseek
    const model = this.models.get("zhipu") ?? this.models.get("deepseek");
    if (model) {
      this.agents.set("daily-quote", createDailyQuoteAgent(model));
    }
  }

  /** 获取模型实例 */
  getModel(name: ModelName): BaseChatModel | undefined {
    return this.models.get(name);
  }

  /** 获取 Agent 实例 */
  getAgent(name: AgentName): ReturnType<typeof createDailyQuoteAgent> | undefined {
    return this.agents.get(name);
  }

  /** 生成每日一句 */
  async generateDailyQuote(): Promise<Awaited<ReturnType<typeof generateDailyQuote>>> {
    const agent = this.agents.get("daily-quote");
    if (!agent) {
      throw new Error("AI Runtime 未初始化：缺少 daily-quote Agent");
    }
    return generateDailyQuote(agent);
  }
}
