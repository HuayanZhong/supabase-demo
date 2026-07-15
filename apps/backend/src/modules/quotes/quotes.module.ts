import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { QuotesService } from "./quotes.service";
import { QuotesController } from "./quotes.controller";
import { Quote } from "./entities/quote.entity";

@Module({
  imports: [MikroOrmModule.forFeature([Quote])],
  controllers: [QuotesController],
  providers: [QuotesService],
})
export class QuotesModule {}
