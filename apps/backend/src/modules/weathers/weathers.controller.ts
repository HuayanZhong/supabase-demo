import { Controller, Get, Query } from "@nestjs/common";
import { WeathersService } from "./weathers.service";
import { WeatherVo } from "./vo/weather.vo";

@Controller("weathers")
export class WeathersController {
  constructor(private readonly weathersService: WeathersService) {}

  @Get()
  getWeather(@Query("city") city: string): Promise<WeatherVo> {
    return this.weathersService.getWeather(city);
  }
}
