import { zhipuChat } from "@supabase/ai-models";
import { createAgent } from "langchain";

const agent = createAgent({
  model: zhipuChat,
  systemPrompt: "你是一个专业的每日报价助手",
});
