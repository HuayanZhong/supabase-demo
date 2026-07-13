import { Factory } from "@mikro-orm/seeder";
import { faker } from "@faker-js/faker";
import { Location } from "../modules/locations/entities/location.entity";

/**
 * 位置数据工厂
 *
 * 使用 faker 生成随机位置数据，用于测试和开发
 */
export class LocationFactory extends Factory<Location> {
  model = Location;

  definition(): Partial<Location> {
    return {
      qweatherId: faker.string.numeric(9),
      name: faker.location.city(),
      lat: faker.number.float({ min: -90, max: 90, fractionDigits: 6 }),
      lon: faker.number.float({ min: -180, max: 180, fractionDigits: 6 }),
      adm2: faker.location.county(),
      adm1: faker.location.state(),
      country: faker.location.country(),
      tz: faker.location.timeZone(),
      utcOffset: "+08:00",
      isDst: false,
      type: faker.helpers.arrayElement(["city", "district", "county"]),
      rank: faker.number.int({ min: 0, max: 100 }),
      fxLink: faker.internet.url(),
    };
  }
}
