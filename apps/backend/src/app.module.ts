import { Module } from "@nestjs/common";
import { WeathersModule } from "./modules/weathers/weathers.module";
import { QuotesModule } from "./modules/quotes/quotes.module";

@Module({
  imports: [WeathersModule, QuotesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
