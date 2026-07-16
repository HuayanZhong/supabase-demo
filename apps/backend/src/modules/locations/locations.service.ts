/**
 * 位置服务
 *
 * 提供位置信息的增删改查和城市搜索功能。
 * search() 调用和风天气 GeoAPI 搜索城市并将结果缓存到数据库。
 */
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadGatewayException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { RequiredEntityData } from "@mikro-orm/core";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Location } from "./entities/location.entity";
import { Logger } from "nestjs-pino";
import type { GeoCityResponse } from "./types/locations.types";

/**
 * 位置服务类
 * 封装位置的 CRUD 和城市搜索操作
 */
@Injectable()
export class LocationsService {
  constructor(
    private readonly em: EntityManager,
    private readonly configService: ConfigService,
    @InjectRepository(Location)
    private readonly locationRepository: EntityRepository<Location>,
    private readonly logger: Logger,
  ) {}

  /**
   * 搜索城市
   *
   * 调用和风天气 GeoAPI 搜索城市，返回结果并将每条记录 upsert 到本地缓存。
   *
   * @param keyword - 城市名/关键词
   * @returns 位置实体数组
   * @throws InternalServerErrorException API Key 未配置
   * @throws BadGatewayException GeoAPI 请求失败或返回错误
   */
  async search(keyword: string): Promise<Location[]> {
    const apiKey = this.configService.get<string>("WEATHER_API_KEY");
    if (!apiKey) {
      this.logger.error("WEATHER_API_KEY 未配置");
      throw new InternalServerErrorException("天气服务配置错误");
    }

    const url = `https://geoapi.qweather.com/v2/city/lookup?location=${encodeURIComponent(keyword)}&key=${apiKey}&range=cn`;

    let res: Response;
    try {
      res = await fetch(url);
    } catch (e) {
      this.logger.error({ keyword, err: e }, "GeoAPI 请求网络错误");
      throw new BadGatewayException("城市搜索请求网络错误");
    }

    if (!res.ok) {
      this.logger.error({ keyword, status: res.status }, "GeoAPI 请求失败");
      throw new BadGatewayException(`城市搜索请求失败: ${res.status}`);
    }

    const body: GeoCityResponse = await res.json();
    if (body.code !== "200" || !body.location?.length) {
      this.logger.debug({ keyword, code: body.code }, "GeoAPI 无结果");
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
      const data = {
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
   * 创建位置
   *
   * @param createLocationDto - 创建位置的数据传输对象
   * @returns 创建的位置实体
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
   *
   * @returns 位置实体数组
   */
  async findAll(): Promise<Location[]> {
    return this.locationRepository.findAll();
  }

  /**
   * 根据 ID 查询单个位置
   *
   * @param id - 位置 ID
   * @returns 位置实体
   * @throws NotFoundException 当位置不存在时抛出
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
   *
   * @param id - 位置 ID
   * @param updateLocationDto - 更新位置的数据传输对象
   * @returns 更新后的位置实体
   * @throws NotFoundException 当位置不存在时抛出
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
   *
   * @param id - 位置 ID
   * @returns 删除结果标记
   * @throws NotFoundException 当位置不存在时抛出
   */
  async remove(id: number): Promise<{ deleted: true }> {
    const location = await this.findOne(id);
    await this.em.remove(location).flush();
    this.logger.debug({ id }, "删除位置");
    return { deleted: true };
  }
}
