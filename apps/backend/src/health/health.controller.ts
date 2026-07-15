import { Controller, Get } from "@nestjs/common";
import { HealthService } from "./health.service";

/**
 * 健康检查控制器
 * 提供 /health 端点，用于负载均衡器和 Kubernetes 探针
 */
@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  check() {
    return this.healthService.check();
  }
}
