import { createAgent } from "langchain";
import { DailyQuoteSchema } from "@supabase/types/daily-quote";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import type { DailyQuote } from "@supabase/types/daily-quote";

/**
 * 创建每日一句生成 agent
 *
 * @param model - 语言模型实例
 * @returns agent 实例
 */
export function createDailyQuoteAgent(model: BaseChatModel) {
  return createAgent({
    model,
    systemPrompt: `你是一个金句生成器。每次生成一句简短的话，要求字数少、有温度。

生成示例如下：
- { "content": "千里之行，始于足下", "author": "老子" }
- { "content": "hi tomorrow", "author": "AI" }

要求：
1）单句，控制在 15 字以内
2）附带合理的作者/出处
3）不自创作者——除非标注 AI 或佚名
4）风格偏积极温暖，少用忧郁风格`,
    responseFormat: DailyQuoteSchema,
  });
}

/** Agent 工厂类型 */
export type DailyQuoteAgent = ReturnType<typeof createDailyQuoteAgent>;

/**
 * 生成每日一句
 *
 * @param agent - 每日一句 agent 实例
 * @returns 每日一句结果
 */
export async function generateDailyQuote(agent: DailyQuoteAgent): Promise<DailyQuote> {
  const result = await agent.invoke({
    messages: [
      {
        role: "user",
        content: "说句简单的话吧。",
      },
    ],
  });

  return result.structuredResponse as DailyQuote;
}
