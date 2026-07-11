import { Injectable } from "@nestjs/common";
import { WeatherVo } from "./vo/weather.vo";
import { QWeatherNow, QWeatherResponse, CacheEntry } from "./types/weather.types";
import { Logger } from "@nestjs/common";
@Injectable()
export class WeathersService {
  // 内存缓存，key 为城市名，value 为天气数据 + 过期时间
  private readonly cache = new Map<string, CacheEntry>();
  /** 缓存有效期：30 分钟 */
  private readonly CACHE_TTL_MS = 30 * 60 * 1000;

  // 日志记录器
  private readonly logger = new Logger(WeathersService.name);

  /**
   * 获取指定城市的实时天气
   * 优先返回缓存数据，缓存未命中时调用和风天气 API
   */
  async getWeather(city: string): Promise<WeatherVo> {
    const cached = this.cache.get(city);
    if (cached && Date.now() < cached.expiresAt) {
      this.logger.debug({ city }, "天气缓存命中");
      return cached.data;
    }

    this.logger.debug({ city }, "天气缓存未命中，请求和风天气 API");
    const data = await this.fetchWeather(city);
    this.cache.set(city, { data, expiresAt: Date.now() + this.CACHE_TTL_MS });
    return data;
  }

  // 调用和风天气实时天气 API，返回转换后的 WeatherVo
  private async fetchWeather(city: string): Promise<WeatherVo> {
    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
      this.logger.error("WEATHER_API_KEY 未配置");
      throw new Error("WEATHER_API_KEY 未配置");
    }

    const url = `https://devapi.qweather.com/v7/weather/now?location=${encodeURIComponent(city)}&key=${apiKey}`;

    const res = await fetch(url);

    if (!res.ok) {
      this.logger.error({ city, status: res.status }, "和风天气 API 请求失败");
      throw new Error(`和风天气 API 请求失败: ${res.status}`);
    }

    const body: QWeatherResponse = await res.json();

    if (body.code !== "200") {
      this.logger.error({ city, code: body.code }, "和风天气 API 返回错误");
      throw new Error(`和风天气 API 返回错误: code=${body.code}`);
    }

    this.logger.log({ city, temp: body.now.temp, condition: body.now.text }, "天气数据获取成功");
    return this.toVo(city, body.now);
  }

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
      uvIndex: 0,
    };
  }

  // 和风天气图标代码 → lucide 图标映射
  private mapIcon(code: string): string {
    // 参考 https://dev.qweather.com/docs/resource/icons/
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
