import { Module } from "@nestjs/common";
import { WeathersModule } from "./modules/weathers/weathers.module";
import { QuotesModule } from "./modules/quotes/quotes.module";
import { LoggerModule } from "nestjs-pino";
import { pinoConfig } from "./config/pino";
import { LocationsModule } from "./modules/locations/locations.module";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import config from "../mikro-orm.config";
import { HealthModule } from "./modules/health/health.module";
import { ConfigModule } from "@nestjs/config";
import { QWeatherModule } from "./modules/qweather/qweather.module";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { SupabaseModule } from "./modules/supabase/supabase.module";
import { SupabaseGuard } from "./modules/supabase/supabase.guard";

@Module({
  imports: [
    // 全局模块
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot(pinoConfig),
    // 安全：全局限流（默认每 60 秒最多 60 次请求）
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 60 }],
    }),
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
  providers: [
    // 注册全局 Guard，按数组顺序执行：
    // 1. ThrottlerGuard（限流，先于认证执行，避免无效 token 消耗资源）
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    // 2. SupabaseGuard（JWT 认证）
    { provide: APP_GUARD, useClass: SupabaseGuard },
  ],
})
export class AppModule {}
