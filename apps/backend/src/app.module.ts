import { Module } from "@nestjs/common";
import { WeathersModule } from "./modules/weathers/weathers.module";
import { QuotesModule } from "./modules/quotes/quotes.module";
import { LoggerModule } from "nestjs-pino";
import { pinoConfig } from "./config/pino";
import { LocationsModule } from "./modules/locations/locations.module";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import config from "../mikro-orm.config";

@Module({
  imports: [
    WeathersModule,
    QuotesModule,
    LoggerModule.forRoot(pinoConfig),
    LocationsModule,
    MikroOrmModule.forRoot(config),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
