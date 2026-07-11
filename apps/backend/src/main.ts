import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { parseEnv, envSchema } from "@supabase/config";
import { config } from "dotenv";
import { Logger } from "nestjs-pino";

// 加载环境变量（必须放在 parseEnv 之前）
config();

async function bootstrap() {
  // 启动时校验环境变量，缺失必填项立即报错
  parseEnv(envSchema, process.env, { label: "backend" });

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  // 配置日志记录器
  app.useLogger(app.get(Logger));
  // 设置全局路由缀
  app.setGlobalPrefix("api");
  // 全局响应拦截器
  app.useGlobalInterceptors(new TransformInterceptor());
  // 全局异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter());
  // 启动应用
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
