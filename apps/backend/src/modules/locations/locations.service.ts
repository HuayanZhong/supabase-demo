import { Injectable } from "@nestjs/common";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { MikroORM } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";

@Injectable()
export class LocationsService {
  // 从 MikroORM 中注入 EntityManager
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    @InjectRepository(Location)
    private readonly locationRepository: EntityRepository<Location>,
  ) {}

  // 创建位置
  create(createLocationDto: CreateLocationDto) {
    return "This action adds a new location";
  }

  findAll() {
    return `This action returns all locations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} location`;
  }

  update(id: number, updateLocationDto: UpdateLocationDto) {
    return `This action updates a #${id} location`;
  }

  remove(id: number) {
    return `This action removes a #${id} location`;
  }
}
