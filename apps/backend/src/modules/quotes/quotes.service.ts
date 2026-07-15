import { Injectable, NotFoundException } from "@nestjs/common";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { InjectRepository } from "@mikro-orm/nestjs";
import { CreateQuoteDto } from "./dto/create-quote.dto";
import { UpdateQuoteDto } from "./dto/update-quote.dto";
import { Quote } from "./entities/quote.entity";
import { Logger } from "nestjs-pino";

/**
 * 名言服务
 * 提供名言的增删改查功能
 */
@Injectable()
export class QuotesService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Quote) private readonly quoteRepo: EntityRepository<Quote>,
    private readonly logger: Logger,
  ) {}

  /**
   * 创建名言
   */
  async create(createQuoteDto: CreateQuoteDto): Promise<Quote> {
    this.logger.debug({ content: createQuoteDto.content }, "创建名言");
    const quote = new Quote();
    this.em.assign(quote, createQuoteDto);
    await this.em.persist(quote).flush();
    this.logger.debug({ id: quote.id }, "名言创建成功");
    return quote;
  }

  /**
   * 查询所有名言
   */
  async findAll(): Promise<Quote[]> {
    this.logger.debug("查询所有名言");
    try {
      const quotes = await this.quoteRepo.findAll({ orderBy: { createdAt: "DESC" } });
      this.logger.debug({ count: quotes.length }, "查询成功");
      return quotes;
    } catch (error) {
      this.logger.error({ error: String(error) }, "查询名言失败");
      throw error;
    }
  }

  /**
   * 根据 ID 查询单条名言
   */
  async findOne(id: number): Promise<Quote> {
    this.logger.debug({ id }, "查询名言");
    try {
      const quote = await this.quoteRepo.findOne(id);
      if (!quote) {
        this.logger.warn({ id }, "名言不存在");
        throw new NotFoundException(`名言 #${id} 不存在`);
      }
      return quote;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error({ id, error: String(error) }, "查询名言失败");
      throw error;
    }
  }

  /**
   * 更新名言
   */
  async update(id: number, updateQuoteDto: UpdateQuoteDto): Promise<Quote> {
    this.logger.debug({ id }, "更新名言");
    const quote = await this.findOne(id);
    this.em.assign(quote, updateQuoteDto);
    try {
      await this.em.flush();
      this.logger.debug({ id }, "名言更新成功");
    } catch (error) {
      this.logger.error({ id, error: String(error) }, "更新名言失败");
      throw error;
    }
    return quote;
  }

  /**
   * 删除名言
   */
  async remove(id: number): Promise<void> {
    this.logger.debug({ id }, "删除名言");
    const quote = await this.findOne(id);
    try {
      await this.em.remove(quote).flush();
      this.logger.debug({ id }, "名言删除成功");
    } catch (error) {
      this.logger.error({ id, error: String(error) }, "删除名言失败");
      throw error;
    }
  }
}
