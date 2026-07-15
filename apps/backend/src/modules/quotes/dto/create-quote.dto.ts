import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

/**
 * 创建名言 DTO
 */
export class CreateQuoteDto {
  /** 名言内容（必填，最长 500 字符） */
  @ApiProperty({ description: "名言内容", example: "知识就是力量", maxLength: 500 })
  @IsNotEmpty({ message: "名言内容不能为空" })
  @IsString()
  @MaxLength(500, { message: "名言内容不能超过 500 字符" })
  content!: string;

  /** 作者（可选，最长 100 字符） */
  @ApiPropertyOptional({ description: "作者", example: "培根", maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: "作者名不能超过 100 字符" })
  author?: string;
}
