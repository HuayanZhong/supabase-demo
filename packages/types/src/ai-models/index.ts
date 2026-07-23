/**
 * AI 模型配置类型
 *
 * 定义模型创建所需的公共契约类型，供 ai-models 和 ai-runtime 共享。
 */

/** DeepSeek 模型配置 */
export interface DeepSeekConfig {
  /** API 密钥 */
  apiKey: string;
  /** 模型名称（默认 deepseek-v4-flash） */
  model?: string;
  /** 温度参数（默认 0.7） */
  temperature?: number;
}

/** 智谱模型配置 */
export interface ZhipuConfig {
  /** API 密钥 */
  apiKey: string;
  /** 模型名称（默认 glm-4.7-flash） */
  model?: string;
  /** 温度参数（默认 0.7） */
  temperature?: number;
  /** API 基础地址 */
  baseURL?: string;
}

/** AI Runtime 配置 */
export interface AiRuntimeConfig {
  /** DeepSeek 模型配置 */
  deepseek?: DeepSeekConfig;
  /** 智谱模型配置 */
  zhipu?: ZhipuConfig;
}

/** 注册的模型名称 */
export type ModelName = keyof Required<AiRuntimeConfig>;

/** 注册的 Agent 名称 */
export type AgentName = "daily-quote";
