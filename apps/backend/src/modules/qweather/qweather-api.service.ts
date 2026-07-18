/**
 * 和风天气 API 通用请求服务
 *
 * 封装 JWT 认证和 HTTP 请求逻辑，供 locations / weathers 等业务模块调用。
 * 统一处理：JWT 签名 → fetch → 网络/状态/业务错误 → JSON 响应。
 */
import { Injectable, InternalServerErrorException, BadGatewayException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Logger } from "nestjs-pino";
import { QWeatherJwtService } from "./qweather-jwt.service";

@Injectable()
export class QWeatherApiService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: QWeatherJwtService,
    private readonly logger: Logger,
  ) {}

  /**
   * 发起和风天气 API GET 请求
   *
   * @param path - API 路径（如 "/v2/city/lookup"）
   * @param params - URL 查询参数
   * @returns 解析后的 JSON 响应体
   */
  async get<T extends { code: string }>(path: string, params: Record<string, string>): Promise<T> {
    const apiHost = this.configService.get<string>("WEATHER_API_HOST");
    if (!apiHost) {
      this.logger.error("WEATHER_API_HOST 未配置");
      throw new InternalServerErrorException("天气服务配置错误");
    }

    const token = this.jwtService.generate();
    const query = new URLSearchParams(params).toString();
    const url = `https://${apiHost}${path}?${query}`;

    this.logger.debug({ path, params }, "和风天气 API 请求");

    let res: Response;
    try {
      res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
      this.logger.error({ path, err: e }, "和风天气 API 请求网络错误");
      throw new BadGatewayException(`天气服务请求网络错误`);
    }

    if (!res.ok) {
      this.logger.error({ path, status: res.status }, "和风天气 API 请求失败");
      throw new BadGatewayException(`天气服务请求失败: ${res.status}`);
    }

    const body: T = await res.json();
    if (body.code !== "200") {
      this.logger.error({ path, code: body.code }, "和风天气 API 返回错误");
      throw new BadGatewayException(`天气服务返回错误: ${body.code}`);
    }

    return body;
  }
}
