import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { WeathersService } from "./weathers.service";
import { WeathersController } from "./weathers.controller";
import { QWeatherModule } from "../../infra/api-clients/qweather/qweather.module";
import { LocationsModule } from "../locations/locations.module";

@Module({
  imports: [
    QWeatherModule,
    LocationsModule,
    // TTL 30 分钟，Service 中 set() 不再重复传入
    CacheModule.register({ ttl: 30 * 60 * 1000, max: 100 }),
  ],
  controllers: [WeathersController],
  providers: [WeathersService],
})
export class WeathersModule {}
