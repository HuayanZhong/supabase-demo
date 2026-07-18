import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ApiErrorResponse } from "../common/decorators/api-data-response.decorator";
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: "服务健康",
    schema: {
      type: "object",
      properties: {
        code: { type: "number", example: 200 },
        data: {
          type: "object",
          properties: {
            status: { type: "string", example: "healthy" },
            timestamp: { type: "string", example: "2026-07-18T09:00:00.000Z" },
            checks: {
              type: "object",
              properties: { database: { type: "string", example: "up" } },
            },
          },
        },
        msg: { type: "string", example: "success" },
      },
    },
  })
  @ApiErrorResponse(HttpStatus.SERVICE_UNAVAILABLE, "服务异常")
  check() {
    return this.healthService.check();
  }
}
