import { Entity, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

/**
 * 位置实体 — 表名 locations
 *
 * 存储和风天气 GeoAPI 返回的地理信息，用于天气查询的位置缓存。
 * qweatherId 为和风天气全局唯一的 LocationID，查询天气时直接使用。
 */
@Entity()
export class Location {
  /** 自增主键 */
  @ApiProperty({ description: "位置 ID" })
  @PrimaryKey()
  id!: number;

  /** 和风天气 LocationID，全局唯一，用于查询天气 */
  @ApiProperty({ description: "和风天气 LocationID", example: "101010100" })
  @Property({ unique: true })
  qweatherId!: string;

  /** 位置名称（如"东城"） */
  @ApiProperty({ description: "位置名称", example: "东城" })
  @Property()
  name!: string;

  /** 纬度 */
  @ApiProperty({ description: "纬度", example: 39.9163 })
  @Property({ type: "decimal", precision: 10, scale: 6 })
  lat!: number;

  /** 经度 */
  @ApiProperty({ description: "经度", example: 116.3972 })
  @Property({ type: "decimal", precision: 10, scale: 6 })
  lon!: number;

  /** 上级行政区划名称（如"北京"） */
  @ApiPropertyOptional({ description: "上级行政区划", example: "北京" })
  @Property({ nullable: true })
  adm2?: string;

  /** 一级行政区域名称（如"北京市"） */
  @ApiPropertyOptional({ description: "一级行政区域", example: "北京市" })
  @Property({ nullable: true })
  adm1?: string;

  /** 国家名称 */
  @ApiPropertyOptional({ description: "国家", example: "中国" })
  @Property({ nullable: true })
  country?: string;

  /** 时区（如 Asia/Shanghai） */
  @ApiPropertyOptional({ description: "时区", example: "Asia/Shanghai" })
  @Property({ nullable: true })
  tz?: string;

  /** UTC 时间偏移（如 +08:00） */
  @ApiPropertyOptional({ description: "UTC 时间偏移", example: "+08:00" })
  @Property({ nullable: true })
  utcOffset?: string;

  /** 是否处于夏令时（API 返回 "0"/"1"，存储时转为 boolean） */
  @ApiPropertyOptional({ description: "是否夏令时", default: false })
  @Property({ type: "boolean", default: false })
  isDst?: boolean;

  /** 位置类型（city / district / POI 等） */
  @ApiPropertyOptional({ description: "位置类型", example: "city" })
  @Property({ nullable: true })
  type?: string;

  /** 位置评分（API 返回字符串，存储时转为数字） */
  @ApiPropertyOptional({ description: "位置评分" })
  @Property({ type: "smallint", nullable: true })
  rank?: number;

  /** 该位置的天气预报网页链接 */
  @ApiPropertyOptional({ description: "天气预报链接" })
  @Property({ nullable: true })
  fxLink?: string;

  /** 记录创建时间 */
  @ApiProperty({ description: "创建时间" })
  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  /** 记录更新时间 */
  @ApiProperty({ description: "更新时间" })
  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt!: Date;
}
