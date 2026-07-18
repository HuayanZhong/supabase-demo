/**
 * Swagger 统一响应包装装饰器
 *
 * 由于 TransformInterceptor 将 Controller 返回包装为 { code, data, msg } 格式，
 * AllExceptionsFilter 将错误包装为 { code, data: null, msg } 格式，
 * 直接使用 @ApiResponse({ type: Entity }) 会导致 Swagger 生成的 schema 与实际响应不匹配。
 *
 * @example
 * ```ts
 * // 成功响应（data 包含实体）
 * @ApiDataResponse(Location, { status: 201, description: "创建成功" })
 * create() { ... }
 *
 * // 错误响应（data 为 null）
 * @ApiErrorResponse(HttpStatus.NOT_FOUND, "位置不存在")
 * findOne() { ... }
 * ```
 */
import { Type, applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiResponse, getSchemaPath } from "@nestjs/swagger";

interface ApiDataResponseOptions {
  status?: number;
  description?: string;
  isArray?: boolean;
}

/**
 * 成功响应 Swagger 装饰器
 *
 * 声明响应 body 为 { code, data: T, msg: "success" }，data 字段引用模型类的 schema。
 */
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

/**
 * 错误响应 Swagger 装饰器
 *
 * 声明响应 body 为 { code, data: null, msg: "错误描述" }，与 AllExceptionsFilter 的格式一致。
 */
export function ApiErrorResponse(status: number, description: string) {
  return ApiResponse({
    status,
    description,
    schema: {
      type: "object",
      properties: {
        code: { type: "number", example: status },
        data: { type: "null", example: null },
        msg: { type: "string", example: description },
      },
      required: ["code", "data", "msg"],
    },
  });
}
