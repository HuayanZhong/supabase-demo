import { zhipuChat } from "@supabase/ai-models";
import { createAgent } from "langchain";
import { DailyQuoteSchema } from "@supabase/types/daily-quote";
import type { DailyQuote } from "@supabase/types/daily-quote";

/**
 * 每日一句生成 agent
 *
 * 基于智谱 GLM 模型，配置结构化输出（DailyQuoteSchema），
 * 由 system prompt 控制生成风格和示例。
 */
const agent = createAgent({
  model: zhipuChat,
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

/**
 * 生成每日一句
 *
 * 不指定主题，由模型自由发挥。返回符合 DailyQuoteSchema 的结构化结果。
 */
export async function generateDailyQuote(): Promise<DailyQuote> {
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
