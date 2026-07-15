/**
 * 位置服务
 *
 * 提供位置信息的增删改查功能，对接和风天气 GeoAPI。
 * 位置数据用于天气查询的地理位置缓存。
 */
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Location } from "./entities/location.entity";
import { Logger } from "nestjs-pino";

/**
 * 位置服务类
 * 封装位置的 CRUD 操作，使用 MikroORM 进行数据持久化
 */
@Injectable()
export class LocationsService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Location)
    private readonly locationRepository: EntityRepository<Location>,
    private readonly logger: Logger,
  ) {}

  /**
   * 创建位置
   *
   * @param createLocationDto - 创建位置的数据传输对象
   * @returns 创建的位置实体
   */
  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    const location = this.locationRepository.create(createLocationDto);
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
