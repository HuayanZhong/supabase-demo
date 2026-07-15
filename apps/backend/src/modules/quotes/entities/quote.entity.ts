import { Entity, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

/**
 * 名言实体 — 表名 quotes
 *
 * 存储名人名言或每日一言，可用于前端展示。
 */
@Entity()
export class Quote {
  /** 自增主键 */
  @ApiProperty({ description: "名言 ID" })
  @PrimaryKey()
  id!: number;

  /** 名言内容 */
  @ApiProperty({ description: "名言内容", example: "知识就是力量" })
  @Property()
  content!: string;

  /** 作者（可为空，表示佚名） */
  @ApiPropertyOptional({ description: "作者", example: "培根" })
  @Property({ nullable: true })
  author?: string;

  /** 记录创建时间 */
  @ApiProperty({ description: "创建时间" })
  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  /** 记录更新时间 */
  @ApiProperty({ description: "更新时间" })
  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt!: Date;
}
