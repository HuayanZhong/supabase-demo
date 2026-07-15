import { ApiProperty } from "@nestjs/swagger";

/** 天气响应结构，对应前端 CalendarWeatherCard 的 weather 字段 */
export class WeatherVo {
  /** 城市名 */
  @ApiProperty({ description: "城市名", example: "北京" })
  city!: string;
  /** 当前温度（摄氏度） */
  @ApiProperty({ description: "当前温度（摄氏度）", example: 25 })
  temp!: number;
  /** 最低温度（摄氏度） */
  @ApiProperty({ description: "最低温度（摄氏度）", example: 20 })
  tempLow!: number;
  /** 最高温度（摄氏度） */
  @ApiProperty({ description: "最高温度（摄氏度）", example: 28 })
  tempHigh!: number;
  /** 天气状况描述（如"多云"） */
  @ApiProperty({ description: "天气状况描述", example: "多云" })
  condition!: string;
  /** 图标名（如 i-lucide-sun） */
  @ApiProperty({ description: "图标名", example: "i-lucide-cloud-sun" })
  icon!: string;
  /** 相对湿度（百分比） */
  @ApiProperty({ description: "相对湿度（百分比）", example: 65 })
  humidity!: number;
  /** 风速描述（如"东南风 12km/h"） */
  @ApiProperty({ description: "风速描述", example: "东南风 12km/h" })
  wind!: string;
  /** 紫外线指数 */
  @ApiProperty({ description: "紫外线指数", example: 3 })
  uvIndex!: number;
}
