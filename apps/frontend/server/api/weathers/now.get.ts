/**
 * 实时天气接口
 *
 * 转发天气查询请求到后端 weathers 模块，由后端调用和风天气 API 获取实时天气数据。
 * 天气卡片组件通过此接口获取指定城市的当前天气。
 *
 * @query locationId - 城市位置 ID（和风天气 LocationID，必填）
 * @returns WeatherData 实时天气数据（温度、天气状况、湿度、风速等）
 */
import type { WeatherData } from "@supabase/types/weather";

export default defineEventHandler(async (event): Promise<WeatherData> => {
  const config = useRuntimeConfig(event);
  const apiBase = config.public.apiBase || "http://localhost:4000/api";
  const { locationId } = getQuery(event) as { locationId?: string };

  return $fetch<WeatherData>(`${apiBase}/weathers/now`, {
    params: { locationId },
  });
});
