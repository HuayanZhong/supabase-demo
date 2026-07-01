# API Test 骨架

适用：为 API 端点编写端到端或集成测试

## 输出文件

`apps/backend/test/{domain}.e2e-spec.ts`

## 骨架内容

```typescript
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";

describe("{Domain} (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe("GET /{route}", () => {
    it("should return 200", () => {
      return request(app.getHttpServer()).get("/{route}").expect(200);
    });

    it("should return correct response structure", () => {
      return request(app.getHttpServer())
        .get("/{route}")
        .expect((res) => {
          expect(res.body).toHaveProperty("code");
          expect(res.body).toHaveProperty("data");
          expect(res.body).toHaveProperty("msg");
        });
    });
  });

  // --- 更多端点测试写在这里 ---
});
```

## 填充规则

| 占位       | 替换为                        |
| ---------- | ----------------------------- |
| `{Domain}` | PascalCase 领域名，如 `Goals` |
| `{route}`  | API 路径，如 `goals`          |

## 覆盖标准

| 测试点   | 要求                                           |
| -------- | ---------------------------------------------- |
| 状态码   | 成功=200，参数错误=400，未授权=401，不存在=404 |
| 响应结构 | 检查 `{ code, data, msg }` 格式                |
| 鉴权     | 未登录访问受保护端点返回 401                   |
| 边界输入 | 空参数、超长参数、非法类型                     |
