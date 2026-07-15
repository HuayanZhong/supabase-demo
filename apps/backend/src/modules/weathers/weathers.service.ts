import { Injectable, InternalServerErrorException, BadGatewayException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LRUCache } from "lru-cache";
import { WeatherVo } from "./vo/weather.vo";
import { QWeatherNow, QWeatherResponse, CacheEntry } from "./types/weather.types";
import { Logger } from "@nestjs/common";

/**
 * 天气服务
 * 负责天气数据的缓存与实时获取，对接和风天气 API
 */
@Injectable()
export class WeathersService {
  /** LRU 缓存，最多存储 100 个城市，自动淘汰最久未使用的缓存 */
  private readonly cache: LRUCache<string, CacheEntry>;

  /** 缓存有效期：30 分钟（毫秒） */
  private readonly CACHE_TTL_MS = 30 * 60 * 1000;

  /** 日志记录器 */
  private readonly logger = new Logger(WeathersService.name);

  constructor(private readonly configService: ConfigService) {
    this.cache = new LRUCache<string, CacheEntry>({
      max: 100, // 最多缓存 100 个城市
      ttl: this.CACHE_TTL_MS, // 30 分钟过期
    });
  }

  /**
   * 获取指定城市的实时天气
   *
   * 优先返回缓存数据。缓存未命中或已过期时，调用和风天气 API 获取，
   * 并将结果写入缓存后返回。LRUCache 自动处理过期和淘汰。
   *
   * @param city - 城市名称（如 "武汉"）
   * @returns 天气视图对象
   */
  async getWeather(city: string): Promise<WeatherVo> {
    const cached = this.cache.get(city);
    if (cached) {
      this.logger.debug({ city }, "天气缓存命中");
      return cached.data;
    }

    this.logger.debug({ city }, "天气缓存未命中，请求和风天气 API");
    const data = await this.fetchWeather(city);
    this.cache.set(city, { data });
    return data;
  }

  /**
   * 调用和风天气实时天气 API
   *
   * 使用 devapi 接口（免费订阅），GET 方式请求当前天气数据。
   * API Key 从环境变量 WEATHER_API_KEY 读取。
   *
   * @param city - 城市名称
   * @returns 转换后的天气视图对象
   * @throws 当 API Key 未配置、HTTP 请求失败或 API 返回错误码时抛出
   */
  private async fetchWeather(city: string): Promise<WeatherVo> {
    const apiKey = this.configService.get<string>("WEATHER_API_KEY");
    if (!apiKey) {
      this.logger.error("WEATHER_API_KEY 未配置");
      throw new InternalServerErrorException("天气服务配置错误");
    }

    const url = `https://devapi.qweather.com/v7/weather/now?location=${encodeURIComponent(city)}&key=${apiKey}`;

    const res = await fetch(url);

    if (!res.ok) {
      this.logger.error({ city, status: res.status }, "和风天气 API 请求失败");
      throw new BadGatewayException(`天气服务请求失败: ${res.status}`);
    }

    const body: QWeatherResponse = await res.json();

    if (body.code !== "200") {
      this.logger.error({ city, code: body.code }, "和风天气 API 返回错误");
      throw new BadGatewayException(`天气服务返回错误: ${body.code}`);
    }

    this.logger.log({ city, temp: body.now.temp, condition: body.now.text }, "天气数据获取成功");
    return this.toVo(city, body.now);
  }

  /**
   * 将和风天气 API 返回的原始数据转换为业务视图对象
   *
   * 当前为简化处理：tempLow/tempHigh 基于当前温度估算，uvIndex 暂为 0。
   * 后续对接逐日预报 API 后可替换为真实数值。
   *
   * @param city - 城市名称
   * @param now  - 和风天气实时数据
   * @returns 天气视图对象
   */
  private toVo(city: string, now: QWeatherNow): WeatherVo {
    const temp = Number.parseInt(now.temp, 10);
    const humidity = Number.parseInt(now.humidity, 10);

    return {
      city,
      temp,
      // 当前无逐日预报接口，暂按固定偏移估算
      tempLow: temp - 5,
      tempHigh: temp + 3,
      condition: now.text,
      icon: this.mapIcon(now.icon),
      humidity,
      wind: `${now.windDir} ${now.windSpeed}km/h`,
      uvIndex: 0,
    };
  }

  /**
   * 将和风天气图标代码映射为 lucide 图标名
   *
   * 编码规则（参考 https://dev.qweather.com/docs/resource/icons/）：
   *   - 100-199：晴/多云
   *   - 300-399：雨
   *   - 400-499：雪
   *   - 500-515：雾/霾
   * 未识别的 code 默认返回 `i-lucide-cloud`。
   *
   * @param code - 和风天气图标代码
   * @returns lucide 图标名称（含 `i-lucide-` 前缀）
   */
  private mapIcon(code: string): string {
    // 参考 https://dev.qweather.com/docs/resource/icons/
    const map: Record<string, string> = {
      // --- 晴 / 多云 (100-153) ---
      "100": "i-lucide-sun",
      "101": "i-lucide-cloud-sun",
      "102": "i-lucide-cloud-sun",
      "103": "i-lucide-cloud-sun",
      "104": "i-lucide-cloud",
      "150": "i-lucide-sun",
      "151": "i-lucide-cloud-sun",
      "152": "i-lucide-cloud-sun",
      "153": "i-lucide-cloud-sun",

      // --- 雨 (300-399) ---
      "300": "i-lucide-cloud-rain",
      "301": "i-lucide-cloud-drizzle",
      "302": "i-lucide-cloud-rain",
      "303": "i-lucide-cloud-rain",
      "304": "i-lucide-cloud-rain",
      "305": "i-lucide-cloud-rain",
      "306": "i-lucide-cloud-rain",
      "307": "i-lucide-cloud-rain",
      "308": "i-lucide-cloud-rain",
      "309": "i-lucide-cloud-drizzle",
      "310": "i-lucide-cloud-rain",
      "311": "i-lucide-cloud-rain",
      "312": "i-lucide-cloud-rain",
      "313": "i-lucide-cloud-rain",
      "314": "i-lucide-cloud-rain",
      "315": "i-lucide-cloud-rain",
      "316": "i-lucide-cloud-rain",
      "317": "i-lucide-cloud-rain",
      "318": "i-lucide-cloud-rain",
      "399": "i-lucide-cloud-rain",

      // --- 雪 (400-499) ---
      "400": "i-lucide-cloud-snow",
      "401": "i-lucide-cloud-snow",
      "402": "i-lucide-cloud-snow",
      "403": "i-lucide-cloud-snow",
      "404": "i-lucide-cloud-snow",
      "405": "i-lucide-cloud-snow",
      "406": "i-lucide-cloud-snow",
      "407": "i-lucide-cloud-snow",
      "408": "i-lucide-cloud-snow",
      "409": "i-lucide-cloud-snow",
      "410": "i-lucide-cloud-snow",
      "499": "i-lucide-cloud-snow",

      // --- 雾 / 霾 (500-515) ---
      "500": "i-lucide-haze",
      "501": "i-lucide-haze",
      "502": "i-lucide-haze",
      "503": "i-lucide-haze",
      "504": "i-lucide-haze",
      "507": "i-lucide-cloud-fog",
      "508": "i-lucide-cloud-fog",
      "509": "i-lucide-cloud-fog",
      "510": "i-lucide-cloud-fog",
      "511": "i-lucide-cloud-fog",
      "512": "i-lucide-cloud-fog",
      "513": "i-lucide-haze",
      "514": "i-lucide-haze",
      "515": "i-lucide-haze",
    };
    return map[code] ?? "i-lucide-cloud";
  }
}
