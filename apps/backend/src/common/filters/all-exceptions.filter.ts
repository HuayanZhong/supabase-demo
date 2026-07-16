import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException ? exception.message : "Internal server error";

    // 未预期的服务器错误记录日志
    if (status >= 500) {
      this.logger.error(
        { status, exception: exception instanceof Error ? exception.stack : exception },
        `未捕获异常: ${message}`,
      );
    }

    response.status(status).json({
      code: status,
      data: null,
      msg: message,
    });
  }
}
