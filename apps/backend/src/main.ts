import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { parseEnv, envSchema } from "@supabase/config";
import { config } from "dotenv";

// 加载环境变量（必须放在 parseEnv 之前）
config();

async function bootstrap() {
  // 启动时校验环境变量，缺失必填项立即报错
  parseEnv(envSchema, process.env, { label: "backend" });

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
