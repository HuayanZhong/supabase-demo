import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { parseEnv, envSchema } from "@supabase/config";
import { config } from "dotenv";
import { Logger } from "nestjs-pino";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

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
  // 配置 CORS，允许前端跨域请求
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  });
  // 全局响应拦截器
  app.useGlobalInterceptors(new TransformInterceptor());
  // 全局异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter());
  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 配置 Swagger 文档
  const swaggerConfig = new DocumentBuilder()
    .setTitle("Supabase Demo API")
    .setDescription("后端 API 文档")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api/docs", app, document);

  // 启动应用
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
