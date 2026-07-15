import { Module } from "@nestjs/common";
import { WeathersModule } from "./modules/weathers/weathers.module";
import { QuotesModule } from "./modules/quotes/quotes.module";
import { LoggerModule } from "nestjs-pino";
import { pinoConfig } from "./config/pino";
import { LocationsModule } from "./modules/locations/locations.module";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import config from "../mikro-orm.config";
import { HealthModule } from "./health/health.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WeathersModule,
    QuotesModule,
    LoggerModule.forRoot(pinoConfig),
    LocationsModule,
    MikroOrmModule.forRoot(config),
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
