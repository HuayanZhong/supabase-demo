import { Module } from "@nestjs/common";
import { WeathersModule } from "./modules/weathers/weathers.module";
import { QuotesModule } from "./modules/quotes/quotes.module";
import { LoggerModule } from "nestjs-pino";
import { pinoConfig } from "./config/pino";

@Module({
  imports: [WeathersModule, QuotesModule, LoggerModule.forRoot(pinoConfig)],
  controllers: [],
  providers: [],
})
export class AppModule {}
