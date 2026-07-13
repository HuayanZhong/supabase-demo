import { Module } from "@nestjs/common";
import { WeathersModule } from "./modules/weathers/weathers.module";
import { QuotesModule } from "./modules/quotes/quotes.module";
import { LoggerModule } from "nestjs-pino";
import { pinoConfig } from "./config/pino";
import { LocationsModule } from "./modules/locations/locations.module";

@Module({
  imports: [WeathersModule, QuotesModule, LoggerModule.forRoot(pinoConfig), LocationsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
