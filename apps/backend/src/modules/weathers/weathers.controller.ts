/**
 * 天气控制器
 *
 * 提供实时天气查询接口，通过和风天气 API 获取天气数据。
 * 使用 locationId（和风天气 LocationID）查询，城市名从 locations 表获取。
 */
import { Controller, Get, Query, BadRequestException } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { ApiDataResponse } from "../../common/decorators/api-data-response.decorator";
import { WeathersService } from "./weathers.service";
import { WeatherVo } from "./vo/weather.vo";

@ApiTags("天气")
@Controller("weathers")
export class WeathersController {
  constructor(private readonly weathersService: WeathersService) {}

  @Get()
  @ApiOperation({ summary: "获取实时天气" })
  @ApiQuery({
    name: "locationId",
    description: "和风天气 LocationID",
    example: "101010100",
    required: true,
  })
  @ApiDataResponse(WeatherVo, { description: "获取成功" })
  @ApiResponse({ status: 400, description: "locationId 参数缺失" })
  @ApiResponse({ status: 404, description: "位置不存在" })
  @ApiResponse({ status: 502, description: "天气服务错误" })
  getWeather(@Query("locationId") locationId?: string): Promise<WeatherVo> {
    if (!locationId) {
      throw new BadRequestException("locationId 参数不能为空");
    }
    return this.weathersService.getWeather(locationId);
  }
}
