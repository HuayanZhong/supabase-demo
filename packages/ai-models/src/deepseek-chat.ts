import { ChatDeepSeek } from "@langchain/deepseek";
import { parseEnv, envSchema } from "@supabase/config";

const env = parseEnv(envSchema, process.env, { label: "ai-models" });

// Deepseek Chat Model
// https://deepseek.cn/chat
export const llm = new ChatDeepSeek({
  model: "deepseek-v4-flash",
  temperature: 0.7,
  apiKey: env.DEEPSEEK_API_KEY,
});
