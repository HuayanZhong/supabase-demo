import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

/**
 * 更新位置 DTO
 *
 * 仅暴露可修改的显示字段，核心标识（qweatherId, lat, lon）不可改。
 * 使用 PartialType 时会暴露 CreateLocationDto 所有字段（含 qweatherId），
 * 因此独立定义。
 */
export class UpdateLocationDto {
  /** 位置名称 */
  @ApiPropertyOptional({ description: "位置名称", example: "东城" })
  @IsOptional()
  @IsString()
  name?: string;

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
}
