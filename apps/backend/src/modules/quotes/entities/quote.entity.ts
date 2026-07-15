import { Entity, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";

/**
 * 名言实体 — 表名 quotes
 *
 * 存储名人名言或每日一言，可用于前端展示。
 */
@Entity()
export class Quote {
  /** 自增主键 */
  @PrimaryKey()
  id!: number;

  /** 名言内容 */
  @Property()
  content!: string;

  /** 作者（可为空，表示佚名） */
  @Property({ nullable: true })
  author?: string;

  /** 记录创建时间 */
  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  /** 记录更新时间 */
  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt!: Date;
}
