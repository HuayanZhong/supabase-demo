import { WeatherVo } from "../vo/weather.vo";

/** 和风天气实时天气 API 响应中的 now 字段 */
export interface QWeatherNow {
  /** 观测时间 */
  obsTime: string;
  /** 温度，默认单位：摄氏度 */
  temp: string;
  /** 体感温度，默认单位：摄氏度 */
  feelsLike: string;
  /** 天气状况图标代码，参考 https://dev.qweather.com/docs/resource/icons/ */
  icon: string;
  /** 天气状况的文字描述，包括阴晴雨雪等 */
  text: string;
  /** 风向 360 角度 */
  wind360: string;
  /** 风向描述 */
  windDir: string;
  /** 风力等级 */
  windScale: string;
  /** 风速，公里/小时 */
  windSpeed: string;
  /** 相对湿度，百分比数值 */
  humidity: string;
  /** 降水量，默认单位：毫米 */
  precip: string;
  /** 站点气压，默认单位：百帕 */
  pressure: string;
  /** 能见度，默认单位：公里 */
  vis: string;
  /** 云量，百分比数值 */
  cloud: string;
  /** 露点温度 */
  dew: string;
  /** 紫外线指数 */
  uvIndex: string;
}

/** 和风天气实时天气 API 完整响应 */
export interface QWeatherResponse {
  /** 状态码，"200" 表示成功 */
  code: string;
  /** API 的最近更新时间 */
  updateTime: string;
  /** 当前天气实况 */
  now: QWeatherNow;
}

/** 缓存条目（LRUCache 自动管理过期） */
export interface CacheEntry {
  /** 缓存的天气数据 */
  data: WeatherVo;
}
