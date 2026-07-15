import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { HealthService } from "./health.service";

/**
 * 健康检查控制器
 * 提供 /health 端点，用于负载均衡器和 Kubernetes 探针
 */
@ApiTags("健康检查")
@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: "健康检查" })
  @ApiResponse({ status: 200, description: "服务健康" })
  @ApiResponse({ status: 503, description: "服务异常" })
  check() {
    return this.healthService.check();
  }
}
