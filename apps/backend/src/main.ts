import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { parseEnv, envSchema } from "@supabase/config";
import { Logger } from "nestjs-pino";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";

async function bootstrap() {
  // 启动时校验环境变量，缺失必填项立即报错
  parseEnv(envSchema, process.env, { label: "backend" });

  // 创建 Nest 应用实例
  const app = await NestFactory.create(AppModule, {
    // 开启日志缓冲，避免在生产环境中直接打印日志
    bufferLogs: true,
  });
  // 配置日志记录器
  app.useLogger(app.get(Logger));

  // Helmet：设置安全相关 HTTP 头
  app.use(helmet());

  // 设置全局路由前缀
  app.setGlobalPrefix("api");
  // 开启 URI 版本控制，所有接口必须显式标注版本号
  // 访问方式统一为 api/v1/xxx，不标版本返回 404
  app.enableVersioning({
    type: VersioningType.URI,
  });
  // 配置 CORS，允许前端跨域请求
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  });
  // 全局响应拦截器
  app.useGlobalInterceptors(new TransformInterceptor());
  // 全局异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter(app.get(Logger)));
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

  // Swagger 不感知 NestJS URI 版本控制中间件，生成的路径缺少版本前缀（如 `/v1`）。
  // 以下映射表为每个 Controller 的路径手动指定版本前缀：
  //   - key:   Controller 的 @Controller() 路径（即 Swagger 原始路径）
  //   - value: 版本前缀
  // 新增 v2 Controller 时，在此添加对应的映射即可。
  const PATH_VERSION_MAP: Record<string, string> = {
    "/locations": "v1",
    "/weathers": "v1",
    "/quotes": "v1",
    "/auth": "v1",
  };
  const originalPaths = { ...document.paths };
  for (const [path, methods] of Object.entries(originalPaths)) {
    const version = PATH_VERSION_MAP[path];
    if (version) {
      document.paths[`/${version}${path}`] = methods;
      delete document.paths[path];
    }
  }

  SwaggerModule.setup("api/docs", app, document);

  // 启动应用
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
