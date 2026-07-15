import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { QuotesService } from "./quotes.service";
import { CreateQuoteDto } from "./dto/create-quote.dto";
import { UpdateQuoteDto } from "./dto/update-quote.dto";
import { Quote } from "./entities/quote.entity";

@ApiTags("名言")
@Controller("quotes")
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  @ApiOperation({ summary: "创建名言" })
  @ApiResponse({ status: 201, description: "创建成功", type: Quote })
  create(@Body() createQuoteDto: CreateQuoteDto) {
    return this.quotesService.create(createQuoteDto);
  }

  @Get()
  @ApiOperation({ summary: "获取所有名言" })
  @ApiResponse({ status: 200, description: "获取成功", type: [Quote] })
  findAll() {
    return this.quotesService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "获取单条名言" })
  @ApiResponse({ status: 200, description: "获取成功", type: Quote })
  @ApiResponse({ status: 404, description: "名言不存在" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.quotesService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "更新名言" })
  @ApiResponse({ status: 200, description: "更新成功", type: Quote })
  @ApiResponse({ status: 404, description: "名言不存在" })
  update(@Param("id", ParseIntPipe) id: number, @Body() updateQuoteDto: UpdateQuoteDto) {
    return this.quotesService.update(id, updateQuoteDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "删除名言" })
  @ApiResponse({ status: 200, description: "删除成功" })
  @ApiResponse({ status: 404, description: "名言不存在" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.quotesService.remove(id);
  }
}
