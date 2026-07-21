import { ChatOpenAI } from "@langchain/openai";
import { parseEnv, envSchema } from "@supabase/config";

const env = parseEnv(envSchema, process.env, { label: "ai-models" });

// 智谱 Chat Model（OpenAI 兼容方式）
// https://open.bigmodel.cn/dev/api
export const llm = new ChatOpenAI({
  model: "glm-4.7-flash",
  temperature: 0.7,
  apiKey: env.ZHIPUAI_API_KEY,
  configuration: {
    baseURL: "https://open.bigmodel.cn/api/paas/v4/",
  },
});
