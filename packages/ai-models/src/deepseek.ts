import { ChatDeepSeek } from "@langchain/deepseek";
import type { DeepSeekConfig } from "@supabase/types/ai-models";

/**
 * 创建 DeepSeek ChatModel 实例
 *
 * @param config - DeepSeek 模型配置
 * @returns DeepSeek ChatModel 实例
 */
export function createDeepSeek(config: DeepSeekConfig) {
  return new ChatDeepSeek({
    model: config.model ?? "deepseek-v4-flash",
    temperature: config.temperature ?? 0.7,
    apiKey: config.apiKey,
  });
}
