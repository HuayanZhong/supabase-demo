# AI Service 骨架

适用：新建 AI 相关的 NestJS Service

## 输出文件

`apps/backend/src/{domain}/{domain}.service.ts`

## 骨架内容

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class {ServiceName} {
  constructor(
    // private readonly httpService: HttpService,
  ) {}

  // --- AI 业务方法写在这里 ---
}
```

## 常用方法模式

```typescript
// 标准 Chat API 调用
async chat(messages: { role: string; content: string }[]): Promise<string> {
  const response = await fetch('{api_url}', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.{API_KEY_ENV}}`,
    },
    body: JSON.stringify({ model: '{model_name}', messages }),
  });
  const data = await response.json();
  return data.choices[0].message.content;
}

// 嵌入向量
async embed(text: string): Promise<number[]> {
  // 调用 embedding API 返回向量
}

// 带超时控制
async chatWithTimeout(messages: any[], timeoutMs = 30000): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    // fetch with signal: controller.signal
  } finally {
    clearTimeout(timer);
  }
}
```

## 填充规则

| 占位            | 替换为                          |
| --------------- | ------------------------------- |
| `{ServiceName}` | PascalCase，如 `AIChatService`  |
| `{domain}`      | 所属领域目录名，如 `ai`         |
| `{api_url}`     | 模型 API URL                    |
| `{API_KEY_ENV}` | 环境变量名，如 `OPENAI_API_KEY` |
| `{model_name}`  | 模型名，如 `gpt-4o-mini`        |
