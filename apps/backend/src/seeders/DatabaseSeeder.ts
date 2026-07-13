import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { LocationFactory } from "./LocationFactory";

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    new LocationFactory(em).make(10);
  }
}
