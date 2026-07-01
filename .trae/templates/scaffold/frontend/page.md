# Page 骨架

适用：新建 Nuxt 页面

## 输出文件

`apps/frontend/app/pages/{route_path}/index.vue`

## 骨架内容

```vue
<script setup lang="ts">
// import { useI18n } from 'vue-i18n';
// const { t } = useI18n();

definePageMeta({
  layout: "default", // 或 'dashboard'
  // middleware: 'auth',
});

// --- 业务逻辑写在这里 ---
</script>

<template>
  <div>
    <!-- UI 内容写在这里 -->
  </div>
</template>
```

## 填充规则

| 占位           | 替换为                                     |
| -------------- | ------------------------------------------ |
| `{route_path}` | Nuxt 路由路径目录，如 `dashboard/settings` |

## 模板中常用组件

| 用途         | 组件                                   |
| ------------ | -------------------------------------- |
| 页面标题区域 | `UPageHeading` / `h1` + `p.text-toned` |
| 数据卡片     | `UCard`                                |
| 表单         | `UForm` + `UFormGroup` + `UInput`      |
| 表格         | `UTable`                               |
| 弹窗         | `UModal`                               |
| 空状态       | `UEmptyState`                          |
| 加载态       | `USkeleton` / `ULoading`               |

## i18n

页面中所有用户可见文字必须使用 `t('key')`，不得硬编码中文/英文文案。

## 后处理

- 确认 `definePageMeta` 中的 `layout` 和 `middleware` 配置正确
- 检查路由是否与现有路由冲突
