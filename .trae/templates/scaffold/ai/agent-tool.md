# Agent Tool 骨架

适用：为 AI Agent 实现可被调用的工具（工具定义 + 参数校验 + 执行 + 结果格式化）

## 输出文件

`apps/backend/src/{domain}/tools/{tool-name}.tool.ts`

## 骨架内容

```typescript
import { z } from 'zod';

// --- 1. 工具参数 Schema ---
export const {toolName}ParamsSchema = z.object({
  // query: z.string().min(1, '查询内容不能为空'),
  // limit: z.number().int().positive().max(50).optional(),
});

export type {ToolName}Params = z.infer<typeof {toolName}ParamsSchema>;

// --- 2. 工具定义（供 Agent / LLM 识别）---
export const {toolName}Tool = {
  name: '{tool_name}',
  description: '{工具用途的简短说明，供 LLM 决策是否调用}',
  parameters: {toolName}ParamsSchema,
};

// --- 3. 执行逻辑 ---
export async function execute{ToolName}(
  params: {ToolName}Params,
): Promise<{ result: unknown }> {
  // 参数已通过 schema 校验，此处直接使用
  // const { query, limit } = params;

  // --- 业务执行写在这里 ---

  return {
    result: {
      // 结构化结果
    },
  };
}

// --- 4. 结果格式化（返回给 LLM 的文本）---
export function format{ToolName}Result(raw: { result: unknown }): string {
  // 将结构化结果转为 LLM 易于理解的文本
  return JSON.stringify(raw.result);
}
```

## 填充规则

| 占位          | 替换为                                |
| ------------- | ------------------------------------- |
| `{domain}`    | 所属领域目录名，如 `ai`               |
| `{tool-name}` | kebab-case 文件名，如 `search-goal`   |
| `{tool_name}` | snake_case 工具标识，如 `search_goal` |
| `{toolName}`  | camelCase，如 `searchGoal`            |
| `{ToolName}`  | PascalCase，如 `SearchGoal`           |

## 必填项标注

| 项            | 必填 | 说明                                       |
| ------------- | ---- | ------------------------------------------ |
| 参数 Schema   | 是   | 用 Zod 定义，所有入参必须可校验            |
| `name`        | 是   | 工具唯一标识，snake_case，供 LLM 调用      |
| `description` | 是   | 清晰描述工具能力，决定 LLM 何时选用        |
| 执行函数      | 是   | 纯业务逻辑，不得直接信任外部传入的原始参数 |
| 结果格式化    | 是   | 返回结构化数据 + 给 LLM 的文本表述         |

## 安全约束

- 工具执行涉及外部副作用（Shell、网络、写库）时，必须走工具权限校验，参见 `.trae/rules/ai/tool-perms.md`
- 参数中不得包含密钥、token；敏感凭证从环境变量或密钥服务读取
- 涉及用户输入拼接到命令/SQL 的，必须做转义或参数化，禁止字符串拼接
- 工具返回内容需经过脱敏，不得泄露内部错误堆栈或密钥

## 在 Agent 中注册

```typescript
import { {toolName}Tool, execute{ToolName} } from './tools/{tool-name}.tool';

const tools = [{toolName}Tool /* ... */];

async function dispatch(name: string, params: unknown) {
  if (name === {toolName}Tool.name) {
    const safe = {toolName}ParamsSchema.parse(params);
    const raw = await execute{ToolName}(safe);
    return format{ToolName}Result(raw);
  }
  // ...其他工具
}
```

## 后处理

- 确认参数 Schema 覆盖所有必填入参，未声明字段一律拒绝
- 工具 name 在 Agent 注册表中唯一，避免冲突
- 高风险工具（删除、外部请求）需有调用日志和确认机制
- 单元测试覆盖：正常入参、非法入参（应被 schema 拦截）、异常路径
