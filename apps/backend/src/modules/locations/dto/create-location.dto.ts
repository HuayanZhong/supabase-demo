import { IsString, IsNumber, IsOptional, IsBoolean, Min, Max } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

/**
 * 创建位置 DTO
 *
 * 用于接收前端或外部 API 传入的位置信息。
 * 必填字段：qweatherId、name、lat、lon
 */
export class CreateLocationDto {
  /** 和风天气 LocationID，全局唯一 */
  @ApiProperty({ description: "和风天气 LocationID", example: "101010100" })
  @IsString()
  qweatherId!: string;

  /** 位置名称 */
  @ApiProperty({ description: "位置名称", example: "东城" })
  @IsString()
  name!: string;

  /** 纬度（-90 ~ 90） */
  @ApiProperty({ description: "纬度", example: 39.9163, minimum: -90, maximum: 90 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat!: number;

  /** 经度（-180 ~ 180） */
  @ApiProperty({ description: "经度", example: 116.3972, minimum: -180, maximum: 180 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  lon!: number;

  /** 上级行政区划名称 */
  @ApiPropertyOptional({ description: "上级行政区划", example: "北京" })
  @IsOptional()
  @IsString()
  adm2?: string;

  /** 一级行政区域名称 */
  @ApiPropertyOptional({ description: "一级行政区域", example: "北京市" })
  @IsOptional()
  @IsString()
  adm1?: string;

  /** 国家名称 */
  @ApiPropertyOptional({ description: "国家", example: "中国" })
  @IsOptional()
  @IsString()
  country?: string;

  /** 时区 */
  @ApiPropertyOptional({ description: "时区", example: "Asia/Shanghai" })
  @IsOptional()
  @IsString()
  tz?: string;

  /** UTC 时间偏移 */
  @ApiPropertyOptional({ description: "UTC 时间偏移", example: "+08:00" })
  @IsOptional()
  @IsString()
  utcOffset?: string;

  /** 是否处于夏令时 */
  @ApiPropertyOptional({ description: "是否夏令时", default: false })
  @IsOptional()
  @IsBoolean()
  isDst?: boolean;

  /** 位置类型 */
  @ApiPropertyOptional({ description: "位置类型", example: "city" })
  @IsOptional()
  @IsString()
  type?: string;

  /** 位置评分 */
  @ApiPropertyOptional({ description: "位置评分", minimum: 0, maximum: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  rank?: number;

  /** 天气预报网页链接 */
  @ApiPropertyOptional({ description: "天气预报链接" })
  @IsOptional()
  @IsString()
  fxLink?: string;
}
