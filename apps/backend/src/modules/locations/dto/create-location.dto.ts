import { IsString, IsNumber, IsOptional, IsBoolean, Min, Max } from "class-validator";

/**
 * 创建位置 DTO
 *
 * 用于接收前端或外部 API 传入的位置信息。
 * 必填字段：qweatherId、name、lat、lon
 */
export class CreateLocationDto {
  /** 和风天气 LocationID，全局唯一 */
  @IsString()
  qweatherId!: string;

  /** 位置名称 */
  @IsString()
  name!: string;

  /** 纬度（-90 ~ 90） */
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat!: number;

  /** 经度（-180 ~ 180） */
  @IsNumber()
  @Min(-180)
  @Max(180)
  lon!: number;

  /** 上级行政区划名称 */
  @IsOptional()
  @IsString()
  adm2?: string;

  /** 一级行政区域名称 */
  @IsOptional()
  @IsString()
  adm1?: string;

  /** 国家名称 */
  @IsOptional()
  @IsString()
  country?: string;

  /** 时区 */
  @IsOptional()
  @IsString()
  tz?: string;

  /** UTC 时间偏移 */
  @IsOptional()
  @IsString()
  utcOffset?: string;

  /** 是否处于夏令时 */
  @IsOptional()
  @IsBoolean()
  isDst?: boolean;

  /** 位置类型 */
  @IsOptional()
  @IsString()
  type?: string;

  /** 位置评分 */
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  rank?: number;

  /** 天气预报网页链接 */
  @IsOptional()
  @IsString()
  fxLink?: string;
}
