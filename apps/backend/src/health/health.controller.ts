import { Controller, Get, HttpStatus, VERSION_NEUTRAL } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ApiErrorResponse } from "../common/decorators/api-data-response.decorator";
import { Public } from "../common/decorators/public.decorator";
import { SkipThrottle } from "@nestjs/throttler";
import { HealthService } from "./health.service";

/**
 * 健康检查控制器
 *
 * 使用 VERSION_NEUTRAL，无论请求走 v1/v2/无版本均可访问 /api/health。
 * 负载均衡器和 K8s 探针不需要关心版本。
 * 标记 @Public() 无需认证即可访问，@SkipThrottle() 跳过限流。
 */
@SkipThrottle()
@ApiTags("健康检查")
@Controller({ path: "health", version: VERSION_NEUTRAL })
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
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
