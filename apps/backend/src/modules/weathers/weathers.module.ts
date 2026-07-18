import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Location } from "../locations/entities/location.entity";
import { WeathersService } from "./weathers.service";
import { WeathersController } from "./weathers.controller";
import { QWeatherModule } from "../qweather/qweather.module";

@Module({
  imports: [
    MikroOrmModule.forFeature([Location]),
    QWeatherModule,
    CacheModule.register({ ttl: 30 * 60 * 1000, max: 100 }),
  ],
  controllers: [WeathersController],
  providers: [WeathersService],
})
export class WeathersModule {}
