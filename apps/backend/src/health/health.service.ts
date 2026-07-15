import { Injectable } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/postgresql";

/**
 * 健康检查服务
 * 检查应用和数据库连接状态
 */
@Injectable()
export class HealthService {
  constructor(private readonly em: EntityManager) {}

  /**
   * 执行健康检查
   * 返回应用状态和数据库连接状态
   */
  async check() {
    const dbStatus = await this.checkDatabase();

    return {
      status: dbStatus ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      checks: {
        database: dbStatus ? "up" : "down",
      },
    };
  }

  /**
   * 检查数据库连接
   * 执行简单查询验证连接是否正常
   */
  private async checkDatabase(): Promise<boolean> {
    try {
      await this.em.execute("SELECT 1");
      return true;
    } catch {
      return false;
    }
  }
}
