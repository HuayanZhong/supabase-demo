/**
 * 城市搜索接口
 *
 * 转发城市搜索请求到后端 locations 模块，由后端调用和风天气 GeoAPI 搜索城市。
 * 前端天气卡片选择城市时使用。
 *
 * @query keyword - 搜索关键词（城市名或拼音，必填）
 * @returns 匹配的城市列表（含 qweatherId、名称、经纬度等信息）
 */
export default defineEventHandler(async (event): Promise<Record<string, unknown>[]> => {
  const config = useRuntimeConfig(event);
  const apiBase = config.public.apiBase || "http://localhost:4000/api";
  const { keyword } = getQuery(event) as { keyword?: string };

  return $fetch(`${apiBase}/locations/search`, {
    params: { keyword },
  });
});
