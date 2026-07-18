/**
 * Swagger 统一响应包装装饰器
 *
 * 由于 TransformInterceptor 将 Controller 返回包装为 { code, data, msg } 格式，
 * 直接使用 @ApiResponse({ type: Entity }) 会导致 Swagger 生成的 schema 与实际响应不匹配。
 * 此装饰器将 schema 修正为正确的包装结构。
 *
 * @example
 * ```ts
 * @ApiDataResponse(Location, { status: 201, description: "创建成功" })
 * create() { ... }
 * ```
 */
import { Type, applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiResponse, getSchemaPath } from "@nestjs/swagger";

interface ApiDataResponseOptions {
  status?: number;
  description?: string;
  isArray?: boolean;
}

export function ApiDataResponse(model: Type<unknown>, options?: ApiDataResponseOptions) {
  const { status = 200, description, isArray = false } = options ?? {};

  const dataSchema = isArray
    ? { type: "array" as const, items: { $ref: getSchemaPath(model) } }
    : { $ref: getSchemaPath(model) };

  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      status,
      description: description ?? (status < 300 ? "成功" : undefined),
      schema: {
        type: "object",
        properties: {
          code: { type: "number", example: status },
          data: dataSchema,
          msg: { type: "string", example: "success" },
        },
        required: ["code", "data", "msg"],
      },
    }),
  );
}
