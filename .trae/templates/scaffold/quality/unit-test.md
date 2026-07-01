# Unit Test 骨架

适用：为 service / composable / util 函数编写单元测试

## 输出文件

| 类型                 | 路径                                                   |
| -------------------- | ------------------------------------------------------ |
| 后端 Service 测试    | `apps/backend/src/{domain}/{domain}.service.spec.ts`   |
| 前端 Composable 测试 | `apps/frontend/app/composables/use{CamelName}.spec.ts` |
| 工具函数测试         | 与被测文件同目录，同名 `.spec.ts`                      |

## 骨架内容（后端 Service）

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { {ServiceName} } from './{domain}.service';

describe('{ServiceName}', () => {
  let service: {ServiceName};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ServiceName}],
    }).compile();

    service = module.get<{ServiceName}>({ServiceName});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- 业务测试写在这里 ---
});
```

## 骨架内容（前端 Composable）

```typescript
import { describe, it, expect } from "vitest";

describe("use{CamelName}", () => {
  it("should return initial state", () => {
    // const { data, loading } = use{CamelName}();
    // expect(data.value).toBeNull();
    // expect(loading.value).toBe(false);
  });
});
```

## 覆盖标准

| 类型         | 最低覆盖                |
| ------------ | ----------------------- |
| 工具函数     | 正常/边界/异常 3 类输入 |
| Service 方法 | 成功路径 + 主要错误路径 |
| Composable   | 初始状态 + 主要交互路径 |

## 后处理

- 确认测试文件可独立运行：`pnpm --filter {app} test`
- NestJS 测试需要导入被测试的 Module，非独立 provider
