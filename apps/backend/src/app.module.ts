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
import { QWeatherModule } from "./modules/qweather/qweather.module";
import { SupabaseModule } from "./modules/supabase/supabase.module";

@Module({
  imports: [
    // 全局模块
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot(pinoConfig),
    // 数据层
    MikroOrmModule.forRoot(config),
    // 基础设施模块
    QWeatherModule,
    // 业务模块
    LocationsModule,
    WeathersModule,
    QuotesModule,
    // 运维
    HealthModule,
    SupabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
