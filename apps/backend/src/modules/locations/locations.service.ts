/**
 * 位置服务
 *
 * 提供位置信息的增删改查和城市搜索功能。
 * search() 调用和风天气 GeoAPI 搜索城市并将结果缓存到数据库。
 * createFromLatLon() 调用逆地理编码补全城市信息。
 */
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateLocationDto } from "./dto/create-location.dto";
import { CreateLocationInputDto } from "./dto/create-location-input.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { RequiredEntityData } from "@mikro-orm/core";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Location } from "./entities/location.entity";
import { Logger } from "nestjs-pino";
import { QWeatherApiService } from "../../infra/api-clients/qweather/qweather-api.service";
import type { GeoCityResponse } from "./types/locations.types";

@Injectable()
export class LocationsService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Location)
    private readonly locationRepository: EntityRepository<Location>,
    private readonly logger: Logger,
    private readonly qweatherApi: QWeatherApiService,
  ) {}

  /**
   * 搜索城市
   *
   * 调用和风天气 GeoAPI 搜索城市，返回结果并将每条记录 upsert 到本地缓存。
   */
  async search(keyword: string): Promise<Location[]> {
    const body = await this.qweatherApi.get<GeoCityResponse>("/geo/v2/city/lookup", {
      location: keyword,
      range: "cn",
    });

    if (!body.location?.length) {
      this.logger.debug({ keyword }, "GeoAPI 无结果");
      return [];
    }

    // 批量查询已有记录，避免逐条 await
    const qweatherIds = body.location.map((item) => item.id);
    const existingLocations = await this.locationRepository.find({
      qweatherId: { $in: qweatherIds },
    });
    const existingMap = new Map(existingLocations.map((loc) => [loc.qweatherId, loc]));

    const locations: Location[] = [];

    for (const item of body.location) {
      const data = this.toLocationData(item);
      let location = existingMap.get(item.id);
      if (location) {
        this.em.assign(location, data);
      } else {
        location = this.locationRepository.create(data as RequiredEntityData<Location>);
      }
      this.em.persist(location);
      locations.push(location);
    }

    await this.em.flush();
    this.logger.debug({ keyword, count: locations.length }, "城市搜索完成");
    return locations;
  }

  /**
   * 通过经纬度创建位置
   *
   * 调用和风天气 GeoAPI 进行逆地理编码，自动补全城市信息后保存。
   */
  async createFromLatLon(input: CreateLocationInputDto): Promise<Location> {
    const { lat, lon } = input;

    // 逆地理编码：用 "lon,lat" 查询和风天气 GeoAPI
    const body = await this.qweatherApi.get<GeoCityResponse>("/geo/v2/city/lookup", {
      location: `${lon},${lat}`,
      range: "cn",
    });

    if (!body.location?.length) {
      this.logger.warn({ lat, lon }, "逆地理编码无匹配结果");
      throw new NotFoundException(`经纬度 (${lat}, ${lon}) 未找到对应城市`);
    }

    // 取第一个匹配结果（最精确的城市）
    const item = body.location[0];
    const locationData = {
      ...this.toLocationData(item),
      lat,
      lon,
    };

    const location = this.locationRepository.create(locationData as RequiredEntityData<Location>);
    await this.em.persist(location).flush();
    this.logger.debug(
      { qweatherId: location.qweatherId, name: location.name },
      "通过经纬度创建位置",
    );
    return location;
  }

  /** 将 GeoAPI 返回的原始城市项转为实体数据 */
  private toLocationData(item: GeoCityResponse["location"][number]) {
    return {
      qweatherId: item.id,
      name: item.name,
      lat: Number.parseFloat(item.lat),
      lon: Number.parseFloat(item.lon),
      adm2: item.adm2 || undefined,
      adm1: item.adm1 || undefined,
      country: item.country || undefined,
      tz: item.tz || undefined,
      utcOffset: item.utcOffset || undefined,
      isDst: item.isDst === "1",
      type: item.type || undefined,
      rank: item.rank ? Number.parseInt(item.rank, 10) || undefined : undefined,
      fxLink: item.fxLink || undefined,
    };
  }

  /**
   * 根据和风天气 LocationID 查询位置
   */
  async findOneByQweatherId(qweatherId: string): Promise<Location> {
    const location = await this.locationRepository.findOne({ qweatherId });
    if (!location) {
      throw new NotFoundException(`位置 ${qweatherId} 不存在`);
    }
    return location;
  }

  /**
   * 创建位置
   */
  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    const location = this.locationRepository.create(
      createLocationDto as RequiredEntityData<Location>,
    );
    await this.em.persist(location).flush();
    this.logger.debug({ qweatherId: location.qweatherId }, "创建位置");
    return location;
  }

  /**
   * 查询所有位置
   */
  async findAll(): Promise<Location[]> {
    return this.locationRepository.findAll();
  }

  /**
   * 根据 ID 查询单个位置
   */
  async findOne(id: number): Promise<Location> {
    const location = await this.locationRepository.findOne(id);
    if (!location) {
      throw new NotFoundException(`位置 #${id} 不存在`);
    }
    return location;
  }

  /**
   * 更新位置
   */
  async update(id: number, updateLocationDto: UpdateLocationDto): Promise<Location> {
    const location = await this.findOne(id);
    this.em.assign(location, updateLocationDto);
    await this.em.flush();
    this.logger.debug({ id }, "更新位置");
    return location;
  }

  /**
   * 删除位置
   */
  async remove(id: number): Promise<void> {
    const location = await this.findOne(id);
    await this.em.remove(location).flush();
    this.logger.debug({ id }, "删除位置");
  }
}
