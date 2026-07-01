# Layout 骨架

适用：新建 Nuxt layout，作为页面外壳（侧边栏、顶栏、整体框架）

## 输出文件

`apps/frontend/app/layouts/{name}.vue`

## 骨架内容（基础 layout）

```vue
<template>
  <div>
    <!-- layout 外壳内容写在这里 -->
    <slot />
  </div>
</template>
```

## 骨架内容（带侧边栏的 dashboard layout）

```vue
<script setup lang="ts">
// import type { NavigationMenuItem } from '@nuxt/ui';

// --- 侧边栏导航菜单 ---
// const navItems: NavigationMenuItem[][] = [
//   [{ label: '首页', to: '/{name}/home', icon: 'i-lucide-home' }],
// ];

// --- 业务逻辑写在这里 ---
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar :default-size="12">
      <template #header>
        <!-- 品牌标识 -->
      </template>

      <template #default>
        <!-- <UNavigationMenu :items="navItems" orientation="vertical" /> -->
      </template>

      <template #footer>
        <!-- 用户面板 -->
      </template>
    </UDashboardSidebar>

    <UDashboardPanel>
      <UDashboardNavbar>
        <template #right>
          <!-- 顶栏右侧操作区 -->
        </template>
      </UDashboardNavbar>

      <div class="flex-1 overflow-auto p-6">
        <slot />
      </div>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
```

## 填充规则

| 占位     | 替换为                           |
| -------- | -------------------------------- |
| `{name}` | kebab-case layout 名，如 `admin` |

## 页面引用 layout

layout 本身不需要 `definePageMeta`；由**页面**通过 `definePageMeta` 指定使用哪个 layout：

```vue
<!-- 在页面文件中 -->
<script setup lang="ts">
definePageMeta({
  layout: "{name}", // 对应 layouts/{name}.vue
});
</script>
```

## 必填项标注

| 项         | 必填 | 说明                                               |
| ---------- | ---- | -------------------------------------------------- |
| `<slot />` | 是   | 页面内容出口，缺失则页面不会渲染                   |
| 命名文件   | 是   | 文件名即 layout 名，页面用 `layout: '{name}'` 引用 |

## 命名约定

- 文件名 kebab-case：`layouts/default.vue` → `layout: 'default'`
- 文件名 kebab-case：`layouts/dashboard.vue` → `layout: 'dashboard'`
- `default.vue` 为默认 layout，页面不指定 `layout` 时自动使用

## 后处理

- 确认 `app/layouts/` 目录下的文件名与页面 `definePageMeta.layout` 一致
- 检查 Nuxt 自动导入是否正常（`pnpm --filter frontend dev` 后确认）
- layout 中所有用户可见文字必须走 `t()`，不得硬编码中文/英文
