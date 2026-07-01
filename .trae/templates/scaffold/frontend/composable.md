# Composable 骨架

适用：新建 Nuxt composable

## 输出文件

`apps/frontend/app/composables/use{CamelName}.ts`

## 骨架内容

```typescript
export const use{CamelName} = () => {
  // --- 状态定义 ---
  // const data = ref(null);
  // const loading = ref(false);

  // --- 方法定义 ---
  // const fetch = async () => {};

  // --- 生命周期 ---
  // onMounted(() => {});

  return {
    // data,
    // loading,
    // fetch,
  };
};
```

## 填充规则

| 占位          | 替换为                            |
| ------------- | --------------------------------- |
| `{CamelName}` | PascalCase，如 `Auth` → `useAuth` |

## 常见模式

```typescript
// 异步数据获取
const data = ref<T | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
```

```typescript
// 使用 Supabase
const supabase = useCreateSupabase();
const { data, error } = await supabase.from("{table}").select("*");
```

```typescript
// SSR 安全的数据获取（页面层）
const { data, pending } = await useFetch("/api/{path}");
```

## 后处理

- Nuxt 自动导入 `composables/` 下的 export，无需手动注册
- 确认 composable 在服务端和客户端都能正常运行（避免使用 `window`、`document`）
