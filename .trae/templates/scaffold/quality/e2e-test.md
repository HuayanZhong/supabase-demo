# E2E Test 骨架

适用：前端浏览器端到端测试（基于 Playwright）

## 输出文件

`apps/frontend/test/e2e/{name}.spec.ts`

## 骨架内容

```typescript
import { describe, it, expect, beforeEach, afterEach } from "vitest";
// import { mountSuspended } from '@nuxt/test-utils/runtime';
// import { render } from '@vue/test-utils';

describe("{FeatureName} (e2e)", () => {
  // --- setup：每个用例前的准备 ---

  beforeEach(async () => {
    // 例如：登录、导航到目标页、初始化测试数据
    // await navigateTo('/{path}');
  });

  // --- teardown：每个用例后的清理 ---

  afterEach(async () => {
    // 例如：清除测试数据、退出登录、关闭会话
  });

  describe("主流程", () => {
    it("应展示页面标题", async () => {
      // const heading = document.querySelector('h1');
      // expect(heading?.textContent).toContain('预期文案');
    });

    it("提交表单后应跳转到结果页", async () => {
      // 模拟填写 → 触发提交 → 断言路由或 DOM 变化
    });
  });

  describe("异常路径", () => {
    it("未登录访问应重定向到首页", async () => {
      // 断言路由被中间件拦截
    });
  });
});
```

## 填充规则

| 占位            | 替换为                             |
| --------------- | ---------------------------------- |
| `{FeatureName}` | PascalCase 功能名，如 `GoalsPage`  |
| `{name}`        | kebab-case 文件名，如 `goals`      |
| `{path}`        | 被测页面路由，如 `dashboard/goals` |

## 必填项标注

| 项           | 必填 | 说明                                     |
| ------------ | ---- | ---------------------------------------- |
| `describe`   | 是   | 用 `describe` 分组，按功能模块组织       |
| `it`         | 是   | 每个用例单一断言意图，标题描述行为       |
| `beforeEach` | 否   | 有状态依赖时必须做 setup                 |
| `afterEach`  | 否   | 修改了全局/持久状态的用例必须做 teardown |

## 覆盖标准

| 测试点 | 要求                                       |
| ------ | ------------------------------------------ |
| 主流程 | 用户核心路径（进入 → 操作 → 结果）必须覆盖 |
| 鉴权   | 未登录访问受保护页面被重定向               |
| 边界   | 空数据、超长输入、网络失败时的兜底 UI      |
| 路由   | 跳转目标、middleware 拦截行为符合预期      |

## 后处理

- 确认测试可独立运行：`pnpm --filter frontend test`
- E2E 用例不得依赖其他用例的副作用，每个用例自包含
- 涉及真实后端的用例，使用独立测试数据库，不得污染开发库
- 用例中的可见文案断言使用 i18n key 对应的固定值，避免硬编码随语言变化
