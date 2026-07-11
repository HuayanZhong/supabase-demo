/** 天气响应结构，对应前端 CalendarWeatherCard 的 weather 字段 */
export class WeatherVo {
  /** 城市名 */
  city!: string;
  /** 当前温度（摄氏度） */
  temp!: number;
  /** 最低温度（摄氏度） */
  tempLow!: number;
  /** 最高温度（摄氏度） */
  tempHigh!: number;
  /** 天气状况描述（如"多云"） */
  condition!: string;
  /** 图标名（如 i-lucide-sun） */
  icon!: string;
  /** 相对湿度（百分比） */
  humidity!: number;
  /** 风速描述（如"东南风 12km/h"） */
  wind!: string;
  /** 紫外线指数 */
  uvIndex!: number;
}
