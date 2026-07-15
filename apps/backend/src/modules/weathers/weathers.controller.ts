import { Controller, Get, Query, BadRequestException } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { WeathersService } from "./weathers.service";
import { WeatherVo } from "./vo/weather.vo";

@ApiTags("天气")
@Controller("weathers")
export class WeathersController {
  constructor(private readonly weathersService: WeathersService) {}

  @Get()
  @ApiOperation({ summary: "获取天气" })
  @ApiQuery({ name: "city", description: "城市名", example: "北京", required: true })
  @ApiResponse({ status: 200, description: "获取成功", type: WeatherVo })
  @ApiResponse({ status: 400, description: "城市参数缺失" })
  @ApiResponse({ status: 502, description: "天气服务错误" })
  getWeather(@Query("city") city?: string): Promise<WeatherVo> {
    if (!city) {
      throw new BadRequestException("城市参数不能为空");
    }
    return this.weathersService.getWeather(city);
  }
}
