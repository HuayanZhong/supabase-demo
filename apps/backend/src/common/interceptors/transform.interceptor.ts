import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { Response } from "../../shared/types/response";

/**
 * 统一响应拦截器
 *
 * 将 Controller 返回的数据包装为 { code, data, msg } 格式。
 * code 取 HTTP 响应状态码，与 @HttpCode() / 异常状态码保持一致。
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => ({
        code: response.statusCode,
        data,
        msg: "success",
      })),
    );
  }
}
