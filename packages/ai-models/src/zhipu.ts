import { ChatOpenAI } from "@langchain/openai";
import type { ZhipuConfig } from "@supabase/types/ai-models";

/**
 * 创建智谱 ChatModel 实例（OpenAI 兼容方式）
 *
 * @param config - 智谱模型配置
 * @returns 智谱 ChatModel 实例
 */
export function createZhipu(config: ZhipuConfig) {
  return new ChatOpenAI({
    model: config.model ?? "glm-4.7-flash",
    temperature: config.temperature ?? 0.7,
    apiKey: config.apiKey,
    configuration: {
      baseURL: config.baseURL ?? "https://open.bigmodel.cn/api/paas/v4/",
    },
  });
}
