---
alwaysApply: false
description: 后端注释规范，涉及 apps/backend/ 下 Service/Controller/Util 类文件时生效
---

## 适用范围

仅适用于 `apps/backend/` 下使用 NestJS 装饰器（`@Injectable`、`@Controller` 等）的类文件。
前端 `.vue` / composable `.ts` 文件请参考 `frontend/comments.md`，通用注释要求请参考根 `comments.md`。

## JSDoc 模板

Service、Controller、Util 类型的类文件必须使用以下模板：

```
/**
 * 类职责说明
 * 补充：依赖关系、边界说明
 */
@Injectable()
export class XxxService {
  /**
   * 方法功能（一句话）
   *
   * 实现策略、缓存机制、副作用等详细说明
   *
   * @param paramName - 参数说明
   * @returns 返回值说明
   * @throws 异常条件说明
   */
  async methodName(param: Type): Promise<ReturnType> {
```

**要求**：

- 类级 JSDoc：说明类的职责边界、依赖方向
- 方法级 JSDoc：说明功能、策略选择、参数和返回
- `@param` 和参数说明之间用 `-` 分隔
- 若方法可能抛出异常，必须有 `@throws`
- 内部私有方法仅在逻辑复杂时使用 JSDoc，简单方法用 `//` 行内注释即可
- 图标映射表等数值映射结构，用 `// --- 分组标题 ---` 分隔逻辑组

**实际应用参考**：`apps/backend/src/modules/weathers/weathers.service.ts`（该文件注释风格获用户认可）

## 后端特定要求

- **Entity 类**：类级 JSDoc 说明表名和用途，字段级用行内注释说明业务含义
- **DTO / VO**：类级 JSDoc 说明用途，字段级用行内注释说明约束条件
- **Exception Filter**：类级 JSDoc 说明拦截的异常类型和处理策略
- **Module 类**：简单注明模块职责即可（1 行 JSDoc 或行内注释）
