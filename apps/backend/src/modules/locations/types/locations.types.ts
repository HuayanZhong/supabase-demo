/** 和风天气 GeoAPI 城市搜索响应中的单个城市 */
export interface GeoCityItem {
  name: string;
  id: string;
  lat: string;
  lon: string;
  adm2: string;
  adm1: string;
  country: string;
  tz: string;
  utcOffset: string;
  isDst: string;
  type: string;
  rank: string;
  fxLink: string;
}

/** 和风天气 GeoAPI 城市搜索完整响应 */
export interface GeoCityResponse {
  code: string;
  location: GeoCityItem[];
}
