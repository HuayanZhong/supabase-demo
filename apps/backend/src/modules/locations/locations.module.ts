import { Module } from "@nestjs/common";
import { LocationsService } from "./locations.service";
import { LocationsController } from "./locations.controller";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Location } from "./entities/location.entity";
import { QWeatherModule } from "../qweather/qweather.module";

@Module({
  imports: [MikroOrmModule.forFeature([Location]), QWeatherModule],
  controllers: [LocationsController],
  providers: [LocationsService],
})
export class LocationsModule {}
