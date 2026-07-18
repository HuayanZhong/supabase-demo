/**
 * 和风天气集成模块
 *
 * 提供和风天气 API 调用的基础设施服务（JWT 签名、通用 HTTP 请求）。
 */
import { Module } from "@nestjs/common";
import { QWeatherJwtService } from "./qweather-jwt.service";
import { QWeatherApiService } from "./qweather-api.service";

@Module({
  providers: [QWeatherJwtService, QWeatherApiService],
  exports: [QWeatherJwtService, QWeatherApiService],
})
export class QWeatherModule {}
