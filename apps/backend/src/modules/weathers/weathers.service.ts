/**
 * 天气服务
 *
 * 负责天气数据的缓存与实时获取，对接和风天气 API。
 * 通过 locationId（和风天气 LocationID）查询天气，城市名从 locations 表获取。
 */
import {
  Injectable,
  InternalServerErrorException,
  BadGatewayException,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LRUCache } from "lru-cache";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Location } from "../locations/entities/location.entity";
import { WeatherVo } from "./vo/weather.vo";
import { QWeatherNow, QWeatherResponse, CacheEntry } from "./types/weather.types";
import { Logger } from "nestjs-pino";

/**
 * 天气服务
 */
@Injectable()
export class WeathersService {
  /** LRU 缓存，最多存储 100 个城市，自动淘汰最久未使用的缓存 */
  private readonly cache: LRUCache<string, CacheEntry>;

  /** 缓存有效期：30 分钟（毫秒） */
  private readonly CACHE_TTL_MS = 30 * 60 * 1000;

  constructor(
    private readonly configService: ConfigService,
    private readonly em: EntityManager,
    @InjectRepository(Location)
    private readonly locationRepository: EntityRepository<Location>,
    private readonly logger: Logger,
  ) {
    this.cache = new LRUCache<string, CacheEntry>({
      max: 100,
      ttl: this.CACHE_TTL_MS,
    });
  }

  /**
   * 获取指定位置的实时天气
   *
   * 通过和风天气 LocationID 查询天气，城市名从 locations 表获取。
   * 优先返回缓存数据，缓存未命中时调用和风天气 API 获取并写入缓存。
   *
   * @param locationId - 和风天气 LocationID（如 "101010100"）
   * @returns 天气视图对象
   */
  async getWeather(locationId: string): Promise<WeatherVo> {
    // 从 DB 获取城市名
    const location = await this.locationRepository.findOne({ qweatherId: locationId });
    if (!location) {
      throw new NotFoundException(`位置 ${locationId} 不存在，请先搜索城市`);
    }

    const cacheKey = locationId;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      this.logger.debug({ locationId }, "天气缓存命中");
      return cached.data;
    }

    this.logger.debug({ locationId }, "天气缓存未命中，请求和风天气 API");
    const data = await this.fetchWeather(locationId, location.name);
    this.cache.set(cacheKey, { data });
    return data;
  }

  /**
   * 调用和风天气实时天气 API
   *
   * @param locationId - 和风天气 LocationID
   * @param cityName - 城市名（用于返回 VO）
   * @returns 转换后的天气视图对象
   */
  private async fetchWeather(locationId: string, cityName: string): Promise<WeatherVo> {
    const apiKey = this.configService.get<string>("WEATHER_API_KEY");
    const apiHost = this.configService.get<string>("WEATHER_API_HOST");
    if (!apiKey || !apiHost) {
      this.logger.error(!apiKey ? "WEATHER_API_KEY 未配置" : "WEATHER_API_HOST 未配置");
      throw new InternalServerErrorException("天气服务配置错误");
    }

    const url = `https://${apiHost}/v7/weather/now?location=${locationId}`;

    let res: Response;
    try {
      res = await fetch(url, { headers: { "X-QW-Api-Key": apiKey } });
    } catch (e) {
      this.logger.error({ locationId, err: e }, "和风天气 API 请求网络错误");
      throw new BadGatewayException("天气服务请求网络错误");
    }

    if (!res.ok) {
      this.logger.error({ locationId, status: res.status }, "和风天气 API 请求失败");
      throw new BadGatewayException(`天气服务请求失败: ${res.status}`);
    }

    const body: QWeatherResponse = await res.json();
    if (body.code !== "200") {
      this.logger.error({ locationId, code: body.code }, "和风天气 API 返回错误");
      throw new BadGatewayException(`天气服务返回错误: ${body.code}`);
    }

    this.logger.log(
      { locationId, city: cityName, temp: body.now.temp, condition: body.now.text },
      "天气数据获取成功",
    );
    return this.toVo(cityName, body.now);
  }

  /**
   * 将和风天气 API 返回的原始数据转换为业务视图对象
   */
  private toVo(city: string, now: QWeatherNow): WeatherVo {
    const temp = Number.parseInt(now.temp, 10);
    const humidity = Number.parseInt(now.humidity, 10);

    return {
      city,
      temp,
      tempLow: temp - 5,
      tempHigh: temp + 3,
      condition: now.text,
      icon: this.mapIcon(now.icon),
      humidity,
      wind: `${now.windDir} ${now.windSpeed}km/h`,
      uvIndex: now.uvIndex ? Number.parseInt(now.uvIndex, 10) : 0,
    };
  }

  /**
   * 将和风天气图标代码映射为 lucide 图标名
   */
  private mapIcon(code: string): string {
    const map: Record<string, string> = {
      "100": "i-lucide-sun",
      "101": "i-lucide-cloud-sun",
      "102": "i-lucide-cloud-sun",
      "103": "i-lucide-cloud-sun",
      "104": "i-lucide-cloud",
      "150": "i-lucide-sun",
      "151": "i-lucide-cloud-sun",
      "152": "i-lucide-cloud-sun",
      "153": "i-lucide-cloud-sun",
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
