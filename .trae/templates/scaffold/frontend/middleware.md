# Middleware 骨架

适用：新建 Nuxt 路由中间件（鉴权、重定向、前置校验等）

## 输出文件

| 类型       | 路径                                            |
| ---------- | ----------------------------------------------- |
| 全局中间件 | `apps/frontend/app/middleware/{name}.global.ts` |
| 命名中间件 | `apps/frontend/app/middleware/{name}.ts`        |

## 骨架内容（命名中间件）

```typescript
export default defineNuxtRouteMiddleware(async (to, from) => {
  // --- 前置校验逻辑写在这里 ---
  // 校验失败时重定向
  // return navigateTo('/login');
  // 校验通过，继续
  // return;
});
```

## 骨架内容（带鉴权跳转）

```typescript
export default defineNuxtRouteMiddleware(async () => {
  const toast = useToast();
  const { checkAuth } = useAuth();

  if (!(await checkAuth())) {
    toast.add({
      title: "登录失效，请先登录",
      color: "warning",
    });
    return navigateTo("/");
  }
});
```

## 填充规则

| 占位     | 替换为                         |
| -------- | ------------------------------ |
| `{name}` | kebab-case 中间件名，如 `auth` |

## 返回值参考

| 返回                     | 行为               |
| ------------------------ | ------------------ |
| `undefined` / 不 return  | 继续导航           |
| `navigateTo('/path')`    | 重定向到指定路径   |
| `abortNavigation(error)` | 取消导航并抛出错误 |
| `false`                  | 取消导航           |

## 必填项标注

| 项                          | 必填 | 说明                                                     |
| --------------------------- | ---- | -------------------------------------------------------- |
| `defineNuxtRouteMiddleware` | 是   | 中间件必须用此助手定义，Nuxt 才能识别                    |
| `.global.ts` 后缀           | 否   | 仅全局中间件需要；命名中间件由页面 `middleware` 显式引用 |

## 在页面中引用命名中间件

```vue
<script setup lang="ts">
definePageMeta({
  middleware: "{name}", // 对应 middleware/{name}.ts
  // 多个中间件：middleware: ['auth', 'admin']
});
</script>
```

## 全局中间件匹配路径

全局中间件默认对所有路由生效。如需限定匹配路径，在 `nuxt.config.ts` 的 `routeRules` 中用 `appMiddleware` 指定，而不是在中间件内部判断 `to.path`：

```typescript
routeRules: {
  '/dashboard/**': { appMiddleware: ['auth'] },
}
```

## 后处理

- 确认中间件在 SSR 和 CSR 都能运行（避免直接访问 `window`）
- 中间件内的异步逻辑必须 `await`，否则校验未完成就放行
- 命名中间件需在页面 `definePageMeta.middleware` 中显式注册才会生效
