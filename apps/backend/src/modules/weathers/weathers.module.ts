import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { WeathersService } from "./weathers.service";
import { WeathersController } from "./weathers.controller";
import { QWeatherModule } from "../qweather/qweather.module";
import { LocationsModule } from "../locations/locations.module";

@Module({
  imports: [
    QWeatherModule,
    LocationsModule,
    CacheModule.register({ ttl: 30 * 60 * 1000, max: 100 }),
  ],
  controllers: [WeathersController],
  providers: [WeathersService],
})
export class WeathersModule {}
