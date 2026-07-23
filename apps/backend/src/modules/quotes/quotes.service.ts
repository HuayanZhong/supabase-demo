import { Injectable, NotFoundException } from "@nestjs/common";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { InjectRepository } from "@mikro-orm/nestjs";
import { AiRuntimeService } from "../../infra/ai-runtime/ai-runtime.service.ts";
import { UpdateQuoteDto } from "./dto/update-quote.dto";
import { Logger } from "nestjs-pino";
import { Quote } from "./entities/quote.entity";

/**
 * 名言服务
 * 提供名言的 AI 自动生成与 CRUD 功能
 */
@Injectable()
export class QuotesService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Quote) private readonly quoteRepo: EntityRepository<Quote>,
    private readonly aiRuntime: AiRuntimeService,
    private readonly logger: Logger,
  ) {}

  /**
   * AI 自动生成每日一句并落库
   */
  async generate(): Promise<Quote> {
    const { content, author } = await this.aiRuntime.generateDailyQuote();
    this.logger.debug({ content, author }, "AI 生成每日一句");
    const quote = this.quoteRepo.create({ content, author: author ?? undefined });
    await this.em.persist(quote).flush();
    this.logger.debug({ id: quote.id }, "每日一句落库成功");
    return quote;
  }

  /**
   * 查询所有名言
   */
  async findAll(): Promise<Quote[]> {
    this.logger.debug("查询所有名言");
    const quotes = await this.quoteRepo.findAll({ orderBy: { createdAt: "DESC" } });
    this.logger.debug({ count: quotes.length }, "查询成功");
    return quotes;
  }

  /**
   * 根据 ID 查询单条名言
   *
   * 全局异常过滤器（AllExceptionsFilter）已兜底处理 500+ 异常，
   * 此处无需额外 try-catch。
   */
  async findOne(id: number): Promise<Quote> {
    const quote = await this.quoteRepo.findOne(id);
    if (!quote) {
      throw new NotFoundException(`名言 #${id} 不存在`);
    }
    return quote;
  }

  /**
   * 更新名言
   */
  async update(id: number, updateQuoteDto: UpdateQuoteDto): Promise<Quote> {
    const quote = await this.findOne(id);
    this.em.assign(quote, updateQuoteDto);
    await this.em.flush();
    return quote;
  }

  /**
   * 删除名言
   */
  async remove(id: number): Promise<void> {
    const quote = await this.findOne(id);
    await this.em.remove(quote).flush();
    this.logger.debug({ id }, "删除名言");
  }
}
