/**
 * 和风天气 JWT 签名服务
 *
 * 使用 Ed25519 私钥签发 JWT，用于和风天气 API 身份认证。
 * JWT 过期时间为 10 分钟，带 30 秒的 iat 偏移避免时钟误差。
 */
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createPrivateKey, sign } from "node:crypto";

/**
 * JWT 缓存条目
 */
interface JwtCacheEntry {
  token: string;
  expiresAt: number;
}

@Injectable()
export class QWeatherJwtService {
  private cache: JwtCacheEntry | null = null;

  constructor(private readonly configService: ConfigService) {
    // 启动时校验必填环境变量，避免运行时才暴露缺失
    const missing: string[] = [];
    for (const key of ["WEATHER_JWT_PRIVATE_KEY", "WEATHER_JWT_KID", "WEATHER_JWT_SUB"]) {
      if (!this.configService.get<string>(key)) {
        missing.push(key);
      }
    }
    if (missing.length > 0) {
      throw new InternalServerErrorException(`和风天气 JWT 配置缺失: ${missing.join(", ")}`);
    }
  }

  /**
   * 生成 JWT token（带缓存）
   *
   * @returns Bearer token
   */
  generate(): string {
    const now = Math.floor(Date.now() / 1000);

    if (this.cache && now < this.cache.expiresAt) {
      return this.cache.token;
    }

    // 构造函数已校验这些配置不为空，此处使用非空断言是安全的
    const privateKeyPem = this.configService.get<string>("WEATHER_JWT_PRIVATE_KEY")!;
    const kid = this.configService.get<string>("WEATHER_JWT_KID")!;
    const sub = this.configService.get<string>("WEATHER_JWT_SUB")!;

    const iat = now - 30;
    const exp = now + 600;

    const header = { alg: "EdDSA", kid };
    const payload = { sub, iat, exp };

    const headerB64 = this.base64url(JSON.stringify(header));
    const payloadB64 = this.base64url(JSON.stringify(payload));
    const message = `${headerB64}.${payloadB64}`;

    const pem = privateKeyPem.replace(/\\n/g, "\n");
    const key = createPrivateKey(pem);
    const sig = sign(null, Buffer.from(message, "utf-8"), key);
    const sigB64 = this.base64url(sig);

    const token = `${message}.${sigB64}`;

    // 在过期前 60 秒刷新
    this.cache = { token, expiresAt: exp - 60 };

    return token;
  }

  /** Base64URL 编码 */
  private base64url(input: string | Buffer): string {
    const buf = typeof input === "string" ? Buffer.from(input, "utf-8") : input;
    return buf.toString("base64url");
  }
}
