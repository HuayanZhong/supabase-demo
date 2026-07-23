import { z } from "zod";

// 每日一句输出结构
export const DailyQuoteSchema = z.object({
  /** 名言内容 */
  content: z.string(),
  /** 作者/出处 */
  author: z.string(),
});

/** 每日一句 */
export type DailyQuote = z.infer<typeof DailyQuoteSchema>;
