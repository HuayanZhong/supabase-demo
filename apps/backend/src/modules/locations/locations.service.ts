import { Injectable } from "@nestjs/common";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Location } from "./entities/location.entity";

@Injectable()
export class LocationsService {
  // 从 MikroORM 中注入 EntityManager
  constructor(
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
