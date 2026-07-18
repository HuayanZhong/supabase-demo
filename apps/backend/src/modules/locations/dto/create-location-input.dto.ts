import { IsNumber, Min, Max } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

/**
 * 创建位置的接口入参
 *
 * 用户仅需传递经纬度，后端自动通过逆地理编码补全城市信息。
 */
export class CreateLocationInputDto {
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
}
